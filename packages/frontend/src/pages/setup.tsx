import { CenterBody } from '@components/layout/CenterBody'
import { usePrivyClientContext } from '@components/PrivyClientProvider'
import type { NextPage } from 'next'
import { useState } from 'react'
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
      </CenterBody>
    </>
  )
}

export default HomePage
