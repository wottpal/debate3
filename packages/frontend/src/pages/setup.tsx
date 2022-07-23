import Vault from '@artifacts/contracts/Vault.sol/Vault.json'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { Button, FormControl, FormHelperText, FormLabel, IconButton, Input } from '@chakra-ui/react'
import { Confetti } from '@components/Confetti'
import { CenterBody } from '@components/layout/CenterBody'
import { Wrapper } from '@components/layout/Wrapper'
import { usePrivyClientContext } from '@components/PrivyClientProvider'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { env } from '@shared/environment'
import { useContracts } from '@shared/useContracts'
import { useIsSSR } from '@shared/useIsSSR'
import { ethers } from 'ethers'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NFTStorage } from 'nft.storage'
import { useEffect, useState } from 'react'
import Dropzone from 'react-dropzone'
import { useFieldArray, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import slugify from 'slugify'
import { Vault as VaultType } from 'src/types/typechain'
import { ForumCreatedEvent } from 'src/types/typechain/Vault'
import 'twin.macro'
import useAsyncEffect from 'use-async-effect'
import { useAccount, useSigner } from 'wagmi'
import welcomeImg from '/src/public/illustrations/welcome_01.svg'

const SetupPage: NextPage = () => {
  const isSsr = useIsSSR()
  const form = useForm({
    mode: 'onChange',
  })

  const forumName = form.watch('forumName')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const { isValid, errors } = form.formState
  const [privyAuthenticated, setPrivyAuthenticated] = useState(false)
  const { client, session } = usePrivyClientContext()
  const [logoImage, setLogoImage] = useState<File>()
  const [logoImagePreviewUri, setLogoImagePreviewUri] = useState<string>()
  const {
    fields: moderatorFields,
    append: appendModerator,
    remove: removeModerator,
  } = useFieldArray({ control: form.control, name: 'moderators' })
  const { contracts, contractsChainId } = useContracts()
  const { data: signer } = useSigner()
  const { address } = useAccount()

  // set default form value
  useEffect(() => {
    form.setValue('moderators', [''])
  }, [form])

  // check if already signed-in
  useAsyncEffect(async () => {
    if (await session?.isAuthenticated()) {
      setPrivyAuthenticated(true)
    }
  }, [session])

  // listens on file-drops
  const onFileDrop = async (files: File[]) => {
    const file = files?.[0]
    if (!file || !file.type.startsWith('image')) return
    setLogoImage(file)
    setLogoImagePreviewUri(URL.createObjectURL(file))
  }

  // call contract and save privy data
  const createForum = async () => {
    if (!isValid || !logoImage || !signer) return
    setIsLoading(true)
    setIsSuccess(false)

    const forumSlug = slugify(forumName, { lower: true, strict: true })
    const forumModerators = (form.getValues('moderators') || []).filter(Boolean) as string[]

    try {
      // 0. Authenticate with Privy if not done so
      if (!privyAuthenticated || (await session.address()) !== address) {
        await session.authenticate()
        setPrivyAuthenticated(true)
      }

      // 1. Mint Logo NFT
      const nftStorageClient = new NFTStorage({ token: env.nftStorageApiKey })
      const nftMetadata = await nftStorageClient.store({
        image: logoImage,
        name: forumName,
        description: 'Access-token for Debate3.xyz DAO forum',
      })
      toast.success('Logo-NFT minted successfully')
      console.log({ nftMetadata })

      // 2. Mint Contract(s)
      const contract = new ethers.Contract(contracts.Vault, Vault.abi, signer) as VaultType
      let receipt
      try {
        const tsx = await contract.createForum(forumName, forumModerators, nftMetadata.url)
        receipt = await tsx.wait()
      } catch (e) {
        console.error(e)
      }
      const event = (receipt?.events || []).find(
        (e: any) => e.event === 'ForumCreated'
      ) as ForumCreatedEvent
      const forumAddress = event.args[0]

      // 3. Save Form Content to Privy
      const privyData = [
        {
          field: 'forum-name',
          value: forumName,
        },
        {
          field: 'forum-slug',
          value: forumSlug,
        },
        {
          field: 'forum-address',
          value: forumAddress,
        },
        {
          field: 'forum-chain',
          value: contractsChainId,
        },
        {
          field: 'forum-logo-uri',
          value: nftMetadata.url,
        },
      ]
      console.log({ privyData })
      await client.put(address, privyData)

      // SUCCESS – Confetti & Forward to Forum
      setIsSuccess(true)
      toast.success('Forum created successfully. Forwarding…')
      setTimeout(() => {
        router.push(`/forum/${forumSlug}`)
      }, 1500)
    } catch (e) {
      console.error('Error while creating forum:', e)
      toast.error('There was an error while creating the forum. Please try again!')
    } finally {
      setIsLoading(false)
    }
  }
  // const readForumAddresses = async () => {
  //   if (!signer || !address) return
  //   const contract = new ethers.Contract(contracts.Vault, Vault.abi, signer) as VaultType
  //   let addresses
  //   try {
  //     addresses = await contract.forumAddresses('1')
  //   } catch (e) {
  //     console.error(e)
  //   }
  //   console.log({ addresses })
  // }

  // if (isSsr) return null

  return (
    <>
      <CenterBody>
        <Wrapper tw="flex flex-col grow">
          <div tw="grow w-full flex flex-col my-20">
            {/* Top Bar */}
            <div tw="flex justify-between items-center">
              <div tw="flex flex-col items-start">
                <Link href="/" passHref>
                  <h1 tw="font-display text-4xl font-black tracking-tight cursor-pointer">
                    Debate3.xyz
                  </h1>
                </Link>
                <p tw="text-gray-600 text-lg mt-1 mb-3">Setup your new forum ✨</p>
              </div>
              {!isSsr && <div>{address && <ConnectButton showBalance={false} />}</div>}
            </div>

            {/* Body */}
            <main tw="grow flex flex-col w-full border-4 border-gray-200 rounded-lg p-5 bg-white shadow-2xl shadow-gray-200">
              {/* Wallet Authentication */}
              {!address && !isSsr && (
                <div tw="flex flex-col items-center justify-center h-full">
                  <Image src={welcomeImg} alt="Welcome" width="250px" height="250px"></Image>
                  <div tw="mt-10">
                    <ConnectButton label="Connect your Wallet" />
                  </div>
                </div>
              )}

              {/* Setup Form */}
              {address && !isSsr && (
                <>
                  <FormControl tw="flex flex-col grow">
                    <div tw="flex space-x-5">
                      <div tw="flex flex-col">
                        <FormLabel>Logo Image*</FormLabel>
                        <Dropzone onDrop={onFileDrop}>
                          {({ getRootProps, getInputProps }) => (
                            <section tw="relative overflow-hidden w-[300px] h-[300px] flex cursor-pointer hover:(bg-gray-100 border-gray-300) items-center justify-center text-center  bg-gray-50 border-2 border-gray-200 border-dashed rounded p-4">
                              <div
                                {...getRootProps()}
                                tw="flex justify-center items-center z-10 absolute inset-0 p-2"
                              >
                                <input {...getInputProps()} />
                                {logoImagePreviewUri ? (
                                  <Image
                                    src={logoImagePreviewUri}
                                    alt="Logo Image Preview"
                                    layout="fill"
                                  />
                                ) : (
                                  <FormHelperText>
                                    Drag&apos;n&apos;drop an image here which is minted as the
                                    access token to the forum.
                                  </FormHelperText>
                                )}
                              </div>
                            </section>
                          )}
                        </Dropzone>
                      </div>

                      <div tw="flex flex-col grow space-y-4 justify-start">
                        <div tw="flex flex-col">
                          <FormLabel>Forum Name*</FormLabel>
                          <Input
                            placeholder="WAGMI DAO"
                            size="lg"
                            isInvalid={!!errors?.forumName}
                            {...form.register('forumName', { required: true })}
                          />
                          <FormHelperText>
                            {forumName &&
                              `New Forum-URL: ${env.url}/forum/${slugify(
                                slugify(forumName, { lower: true, strict: true })
                              )}`}
                          </FormHelperText>
                        </div>
                        <div tw="flex flex-col">
                          <FormLabel>Moderator Addresses</FormLabel>
                          <div tw="flex flex-col space-y-2">
                            {moderatorFields.map((item, index) => {
                              return (
                                <div key={item.id} tw="flex">
                                  <Input
                                    placeholder="0x…"
                                    size="lg"
                                    tw="grow"
                                    isInvalid={!!errors?.moderators?.[index]}
                                    {...form.register(`moderators.${index}`, {
                                      pattern: {
                                        value: /^0x[a-fA-F0-9]{40}$/,
                                        message: 'Please enter a valid address',
                                      },
                                    })}
                                  />
                                  <IconButton
                                    aria-label="Delete moderator address"
                                    size="lg"
                                    tw="ml-2"
                                    icon={<DeleteIcon />}
                                    onClick={() => {
                                      removeModerator(index)
                                    }}
                                  />
                                </div>
                              )
                            })}
                          </div>
                          <IconButton
                            aria-label="Add moderator address"
                            tw="mt-2"
                            icon={<AddIcon />}
                            onClick={() => {
                              appendModerator('')
                            }}
                          />
                          <FormHelperText>
                            Define up to 5 moderators that are allowed to award reputation NFTs.
                          </FormHelperText>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div tw="text-center mt-auto">
                      <Button
                        colorScheme="facebook"
                        variant="solid"
                        tw="mt-10"
                        disabled={!isValid || !logoImage || isLoading}
                        size="lg"
                        onClick={createForum}
                        isLoading={isLoading}
                      >
                        Deploy new Forum
                      </Button>
                    </div>
                  </FormControl>
                </>
              )}
            </main>
          </div>
        </Wrapper>
        {isSuccess && <Confetti />}
      </CenterBody>
    </>
  )
}

export default SetupPage
