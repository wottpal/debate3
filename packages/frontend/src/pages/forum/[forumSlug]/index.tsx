import { Forum } from '@models/Forum.model'
import { PrivyClient } from '@privy-io/privy-node'
import { env } from '@shared/environment'
import type { GetServerSideProps } from 'next'
import 'twin.macro'
import { FC, PropsWithChildren, useEffect, useState } from 'react'
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
      {/* <div>Deployer Address / Admin: {forum.address}</div> */}
      <div tw="flex-1 min-w-0 mt-4 ml-4">
        <h2 className="forum-header">{forum.forumName}</h2>
      </div>
      <div className="debates-container">
        <Posts context={forum.forumName} />
      </div>
      <div className="new-discussion-container">
        {user ? (
          <>
            <Share context={forum.forumName} />
          </>
        ) : (
          <button
            className="orbis-connect-btn"
            tw="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => connect()}
          >
            Open your debate
          </button>
        )}
      </div>
      <div className="sidebar"></div>
    </>
  )
}

function Share({ context }: any) {
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState<string>()
  const { orbis } = useOrbisContext()

  async function share() {
    setLoading(true)
    console.log('Sharing with context ', context)
    const res = await orbis.createPost({
      body: text,
      context: context,
    })

    if (res.status == 200) {
      console.log('Shared post with stream_id: ', res.doc)
    } else {
      console.log('Error sharing post: ', res)
      alert('Error sharing post.')
    }

    setLoading(false)
  }

  return (
    <div className="share-container">
      <textarea
        placeholder="Start discussion..."
        className="forum-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {loading ? (
        <button className="share-btn">Loading...</button>
      ) : (
        <button className="share-btn" onClick={() => share()}>
          Share
        </button>
      )}
    </div>
  )
}

interface PostsProps {
  context: any
}
export const Posts: FC<PostsProps> = ({ context }) => {
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState<any[]>([])
  const { orbis } = useOrbisContext()

  useEffect(() => {
    console.log(context)
    console.log(orbis)
    loadPosts()
  }, [orbis])

  async function loadPosts() {
    setLoading(true)
    if (orbis) {
      const { data, error, status } = await orbis.getPosts({ context: context })

      if (data && orbis) {
        setPosts(data)
        setLoading(false)
      }
    }
  }

  if (loading) {
    return <p>Loading posts...</p>
  }

  if (posts && posts.length > 0) {
    return (
      <>
        {posts.map((post, key) => {
          return (
            <div key={key} className="grid grid-cols-1 gap-4 sm:grid-cols-2 posts-container">
              <div className="debate">
                <div className="flex-shrink-0">
                  {/* <img className="h-10 w-10 rounded-full" src={} alt="" /> */}
                </div>
                <div className="flex-1 min-w-0">
                  <a href="#" className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {/* <p><b>Shared by: {post.creator}</b></p> */}
                    <p className="text-sm text-gray-500 truncate">{post.content?.body}</p>
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </>
    )
  } else {
    return <p>No posts shared in this context.</p>
  }
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
