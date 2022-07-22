import { AddIcon } from '@chakra-ui/icons'
import { Button, FormControl, FormHelperText, FormLabel, IconButton, Input } from '@chakra-ui/react'
import { CenterBody } from '@components/layout/CenterBody'
import { Wrapper } from '@components/layout/Wrapper'
import { usePrivyClientContext } from '@components/PrivyClientProvider'
import type { NextPage } from 'next'
import Image from 'next/image'
import { useState } from 'react'
import Dropzone from 'react-dropzone'
import { useForm } from 'react-hook-form'
import 'twin.macro'
import useAsyncEffect from 'use-async-effect'
import welcomeImg from '/src/public/illustrations/welcome_01.svg'

const HomePage: NextPage = () => {
  const form = useForm({ mode: 'onChange' })
  const newForumName = form.watch('newForumName')
  const newForumSlug = form.watch('newForumSlug')
  const [isLoading, setIsLoading] = useState(false)
  const { isValid, errors } = form.formState
  const [address, setAddress] = useState(null)
  const [forumName, setForumName] = useState('')
  const [forumSlug, setForumSlug] = useState('')
  const { client, session } = usePrivyClientContext()

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
    if (!isValid) return
    setIsLoading(true)
    try {
      const [forumName, forumSlug] = await client.put(address, [
        {
          field: 'forum-name',
          value: newForumName,
        },
        {
          field: 'forum-slug',
          value: newForumSlug,
        },
      ])
      setForumName(forumName.text())
      setForumSlug(forumSlug.text())
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <CenterBody>
        <Wrapper tw="flex flex-col grow">
          <div tw="grow w-full flex flex-col my-20 items-stretch">
            <h1 tw="font-display text-5xl font-black">Debate3</h1>
            <p tw="text-gray-600 text-lg mt-1 mb-3">Setup your new forum ✨</p>
            <main tw="grow flex flex-col w-full border-4 border-gray-200 rounded p-4 bg-white">
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
                    <div tw="flex space-x-6">
                      <Dropzone onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
                        {({ getRootProps, getInputProps }) => (
                          <section tw="w-[300px] h-[300px] flex cursor-pointer hover:(bg-gray-100 border-gray-300) items-center justify-center text-center  bg-gray-50 border-2 text-gray-600 border-gray-200 border-dashed rounded p-4">
                            <div {...getRootProps()}>
                              <input {...getInputProps()} />
                              <p tw="leading-5 text-sm italic">
                                Drag&apos;n&apos;drop a logo here which is minted as the access
                                token to the forum.
                              </p>
                            </div>
                          </section>
                        )}
                      </Dropzone>

                      <div tw="flex flex-col grow space-y-4 justify-start">
                        <div tw="flex flex-col">
                          <FormLabel>Forum Name</FormLabel>
                          <Input
                            placeholder="WAGMI DAO"
                            size="lg"
                            width="auto"
                            {...form.register('newForumName', { required: true })}
                          />
                        </div>
                        <div tw="flex flex-col">
                          <FormLabel>Moderator Addresses</FormLabel>
                          <Input
                            placeholder="0x…"
                            size="lg"
                            width="auto"
                            {...form.register('newForumSlug', { required: true })}
                          />
                          <IconButton
                            aria-label="Add moderator address"
                            size="sm"
                            tw="mt-2"
                            icon={<AddIcon />}
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
