import type { GetServerSideProps } from 'next'
import 'twin.macro'

export interface ForumPageProps {
  slug: string
}
export default function ForumPage({ slug }: ForumPageProps) {
  return <>Forum Page for DAO: {slug}</>
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.forumSlug
  console.log({ slug })

  // const res = await fetch(`https://.../data`)
  // const data = await res.json()

  // if (!data) {
  //   return {
  //     notFound: true,
  //   }
  // }

  return {
    props: {
      slug,
    } as ForumPageProps,
  }
}
