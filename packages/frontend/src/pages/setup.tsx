import { CenterBody } from '@components/layout/CenterBody'
import { Wrapper } from '@components/layout/Wrapper'
import { usePrivyClientContext } from '@components/PrivyClientProvider'
import type { NextPage } from 'next'
import { useState } from 'react'
import Dropzone from 'react-dropzone'
import { useForm } from 'react-hook-form'
import 'twin.macro'

const HomePage: NextPage = () => {
  const form = useForm({ mode: 'onChange' })
  const newForumName = form.watch('newForumName')
  const newForumSlug = form.watch('newForumSlug')

  const { isValid, errors } = form.formState

  const [address, setAddress] = useState(null)
  const [forumName, setForumName] = useState('')
  const [forumSlug, setForumSlug] = useState('')

  const { client, session } = usePrivyClientContext()
  const testAction = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        alert('Please install MetaMask for this demo: https://metamask.io/')
        return
      }

      if (!(await session.isAuthenticated())) {
        await session.authenticate()
      }
      const address = await session.address()
      setAddress(address)
    } catch (error) {
      console.error(error)
    }
  }

  const saveData = async () => {
    if (!isValid) return
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
  }

  return (
    <>
      <CenterBody>
        <Wrapper tw="flex flex-col grow">
          <div tw="grow w-full flex flex-col my-20 items-stretch">
            <h1 tw="font-display text-5xl font-black">Debate3</h1>
            <p tw="text-gray-600 text-lg mt-1 mb-2">Setup your new forum ✨</p>
            <main tw="grow flex flex-col w-full border-4 border-gray-200 rounded-md p-2">
              {/* Authentication with Privy */}
              {!address && (
                <button
                  tw="bg-gray-500 rounded-sm p-2"
                  onClick={() => {
                    testAction()
                  }}
                >
                  Authenticate Privy
                </button>
              )}

              {/* Create Forum */}
              {address && (
                <>
                  <Dropzone onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
                    {({ getRootProps, getInputProps }) => (
                      <section tw="bg-gray-100 border-2 border-gray-300 border-dashed rounded-sm p-4">
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          <p>Drag n drop some files here, or click to select files</p>
                        </div>
                      </section>
                    )}
                  </Dropzone>

                  <div>Address: {address}</div>

                  <input
                    type="text"
                    placeholder="New Forum Name"
                    {...form.register('newForumName', { required: true })}
                  />
                  <input
                    type="text"
                    placeholder="New Forum Slug"
                    {...form.register('newForumSlug', { required: true })}
                  />

                  <button
                    tw="bg-gray-500 rounded-sm p-2"
                    onClick={() => {
                      saveData()
                    }}
                  >
                    Set Forum Data
                  </button>

                  <div>Forum Name: {forumName}</div>
                  <div>Forum Slug: {forumSlug}</div>
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
