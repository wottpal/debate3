import { Forum } from '@models/Forum.model'
import { PrivyClient } from '@privy-io/privy-node'
import { env } from '@shared/environment'
import type { GetServerSideProps } from 'next'
import 'twin.macro'
import { useState } from 'react'
import { useOrbisContext } from '@components/OrbisProvider'

export interface ForumPageProps {
  forumData: object
}
export default function ForumPage({ forumData }: ForumPageProps) {
  const forum = Forum.fromObject(forumData)
  const [user, setUser] = useState()
  const { orbis } = useOrbisContext()

  async function connect() {
    const res = await orbis.connect()

    if (res.status == 200) {
      console.log('Connected to Ceramic with: ', res.did)
      setUser(res.did)
    } else {
      console.log('Error connecting to Ceramic: ', res)
      alert('Error connecting to Ceramic.')
    }
  }

  if (!forum) return null
  return (
    <>
      c Forum Page for DAO:
      <div>Deployer Address / Admin: {forum.address}</div>
      <div>Forum Name: {forum.forumName}</div>
      <div>Slug: {forum.forumSlug}</div>
      <div>
        {user ? (
          <>
            <p>Connected with: {user}</p>
          </>
        ) : (
          <button onClick={() => connect()}>Connect</button>
        )}
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = ((params?.forumSlug as string) || '').toLowerCase()
  if (!slug) return { notFound: true }

  // Fetch all forums / deployer users
  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const client = new PrivyClient(env.privy.apiKey, env.privy.apiSecret!)
  const { next_cursor_id, users } = await client.getBatch(['forum-name', 'forum-slug'], {
    limit: 50,
  })

  const forums = (users || [])
    .map((u) => Forum.fromPrivyInstance(u) || null)
    .filter(Boolean) as Forum[]

  const forum = forums.find((f) => f.forumSlug === slug)
  if (!forum) return { notFound: true }

  return {
    props: {
      forumData: forum.toJson(),
    } as ForumPageProps,
  }
}
