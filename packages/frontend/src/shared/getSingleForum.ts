import { Forum } from '@models/Forum.model'
import { PrivyClient } from '@privy-io/privy-node'
import { GetServerSideProps } from 'next'
import { env } from './environment'

export type SingleForumProps = {
  forumData: object
}

export const getSingleForum: GetServerSideProps = async ({ params }) => {
  const slug = ((params?.forumSlug as string) || '').toLowerCase()
  if (!slug) return { notFound: true }

  // Fetch all forums / deployer users
  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const client = new PrivyClient(env.privy.apiKey, env.privy.apiSecret!)
  const { next_cursor_id, users } = await client.getBatch(Forum.allFields(), {
    limit: 50,
  })

  const forums = (users || [])
    .map((u) => Forum.fromPrivyInstance(u) || null)
    .filter(Boolean) as Forum[]
  const forum = forums.find((f) => f.forumSlug === slug)
  if (!forum) return { notFound: true }
  const forumData = forum.toJson()

  return {
    props: {
      forumData,
    } as SingleForumProps,
  }
}
