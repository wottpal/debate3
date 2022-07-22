import { Forum } from '@models/Forum.model'
import { PrivyClient } from '@privy-io/privy-node'
import { env } from '@shared/environment'
import type { GetServerSideProps } from 'next'
import 'twin.macro'

export interface ForumPageProps {
  forumData: object
}
export default function ForumPage({ forumData }: ForumPageProps) {
  const forum = Forum.fromObject(forumData)

  if (!forum) return null
  return (
    <>
      Forum Page for DAO:
      <div>Deployer Address / Admin: {forum.address}</div>
      <div>Forum Name: {forum.forumName}</div>
      <div>Slug: {forum.forumSlug}</div>
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

  // const res = await fetch(`https://.../data`)
  // const data = await res.json()

  // if (!data) {
  //   return {
  //     notFound: true,
  //   }
  // }

  return {
    props: {
      forumData: forum.toJson(),
    } as ForumPageProps,
  }
}
