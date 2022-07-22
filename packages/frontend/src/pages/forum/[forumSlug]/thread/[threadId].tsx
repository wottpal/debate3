import type { GetServerSideProps } from 'next'
import 'twin.macro'

export interface ThreadPageProps {
  forumSlug: string
  threadId: string
}
export default function ThreadPage({ forumSlug, threadId }: ThreadPageProps) {
  return (
    <>
      Forum Thread for ID: {threadId} for Forum: {forumSlug}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const forumSlug = params?.forumSlug
  const threadId = params?.threadId
  console.log({ forumSlug, threadId })

  // const res = await fetch(`https://.../data`)
  // const data = await res.json()

  // if (!data) {
  //   return {
  //     notFound: true,
  //   }
  // }

  return {
    props: {
      forumSlug,
      threadId,
    } as ThreadPageProps,
  }
}
