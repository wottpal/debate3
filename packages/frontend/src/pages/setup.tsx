import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { Button, FormControl, FormHelperText, FormLabel, IconButton, Input } from '@chakra-ui/react'
import { CenterBody } from '@components/layout/CenterBody'
import { Wrapper } from '@components/layout/Wrapper'
import { usePrivyClientContext } from '@components/PrivyClientProvider'
import { env } from '@shared/environment'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { NFTStorage } from 'nft.storage'
import { useEffect, useState } from 'react'
import Dropzone from 'react-dropzone'
import { useFieldArray, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import slugify from 'slugify'
import 'twin.macro'
import useAsyncEffect from 'use-async-effect'
import welcomeImg from '/src/public/illustrations/welcome_01.svg'

const HomePage: NextPage = () => {
  const form = useForm({
    mode: 'onChange',
  })
  const forumName = form.watch('forumName')
  const [isLoading, setIsLoading] = useState(false)
  const { isValid, errors } = form.formState
  const [address, setAddress] = useState(null)
  const { client, session } = usePrivyClientContext()
  const [logoImage, setLogoImage] = useState<File>()
  const [logoImagePreviewUri, setLogoImagePreviewUri] = useState<string>()
  const {
    fields: moderatorFields,
    append: appendModerator,
    remove: removeModerator,
  } = useFieldArray({ control: form.control, name: 'moderators' })
  useEffect(() => {
    form.setValue('moderators', [''])
  }, [form])

  // check if already signed-in
  useAsyncEffect(async () => {
    console.log('here')
    if (await session?.isAuthenticated()) {
      const address = await session.address()
      console.log({ address })
      setAddress(address)
    }
  }, [session])

  // sign-in with privy
  const authenticatePrivy = async () => {
    setIsLoading(true)
    try {
      if (!(await session.isAuthenticated())) {
        await session.authenticate()
      }
      const address = await session.address()
      setAddress(address)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // call contract and save privy data
  const createForum = async () => {
    if (!isValid || !logoImage) return
    setIsLoading(true)

    try {
      // 1. Mint Logo NFT
      // const logoImageBuffer = await logoImage.arrayBuffer()
      const nft = {
        image: logoImage,
        name: forumName,
        description: 'Access-token for Debate3.xyz DAO forum',
      }

      const nftStorageClient = new NFTStorage({ token: env.nftStorageApiKey })
      const metadata = await nftStorageClient.store(nft)
      toast('Minted Logo as NFT successfully')
      console.log({ metadata })

      // 2. Mint Contract(s)
      // TODO

      // 3. Save Form Content to Privy
      const forumSlug = slugify(forumName, { lower: true, strict: true })
      const [updatedName, updatedSlug] = await client.put(address, [
        {
          field: 'forum-name',
          value: forumName,
        },
        {
          field: 'forum-slug',
          value: forumSlug,
        },
      ])
      console.log({
        updatedName: updatedName.text(),
        updatedSlug: updatedSlug.text(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onFileDrop = async (files: File[]) => {
    const file = files?.[0]
    if (!file || !file.type.startsWith('image')) return
    console.log('file.type', file.type)
    setLogoImage(file)
    setLogoImagePreviewUri(URL.createObjectURL(file))
  }

  return (
    <>
      <CenterBody>
        <Wrapper tw="flex flex-col grow">
          <div tw="grow w-full flex flex-col my-20 items-stretch">
            <Link href="/" passHref>
              <h1 tw="font-display text-4xl font-black tracking-tight cursor-pointer">
                Debate3.xyz
              </h1>
            </Link>
            <p tw="text-gray-600 text-lg mt-1 mb-3">Setup your new forum ✨</p>
            <main tw="grow flex flex-col w-full border-4 border-gray-200 rounded-lg p-5 bg-white shadow-2xl shadow-gray-200">
              {/* Authentication with Privy */}
              {!address && (
                <div tw="flex flex-col items-center justify-center h-full">
                  <Image src={welcomeImg} alt="Welcome" width="250px" height="250px"></Image>
                  <Button
                    colorScheme="facebook"
                    variant="solid"
                    tw="mt-10"
                    size="lg"
                    onClick={authenticatePrivy}
                    isLoading={isLoading}
                  >
                    Sign-in with Wallet
                  </Button>
                </div>
              )}

              {/* Setup Form */}
              {address && (
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
      </CenterBody>
    </>
  )
}

export default HomePage
