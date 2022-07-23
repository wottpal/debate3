import { useOrbisContext } from '@components/OrbisProvider'
import { ChatAltIcon, PaperClipIcon, XIcon } from '@heroicons/react/outline'
import { Forum } from '@models/Forum.model'
import { PrivyClient } from '@privy-io/privy-node'
import { env } from '@shared/environment'
import type { GetServerSideProps } from 'next'
import { FC, MouseEvent, useEffect, useState } from 'react'
import 'twin.macro'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
export interface ForumPageProps {
  forumData: object
}
export default function ForumPage({ forumData }: ForumPageProps) {
  const forum = Forum.fromObject(forumData)
  const [user, setUser] = useState()
  const [openCommentModal, setOpenCommentModal] = useState(true)
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
      <h2 className="forum-header">{forum.forumName}</h2>
      <div className="debates-feed">
        <Posts context={forum.forumName} />
      </div>
      {openCommentModal && (
        <div className="modal-dim" onClick={() => setOpenCommentModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="close-comments-btn" onClick={() => setOpenCommentModal(false)}>
              <XIcon className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
        </div>
      )}
      <div className="new-discussion-container">
        <Share context={forum.forumName} />
        {user ? (
          <button
            className="orbis-connect-btn"
            tw="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-800 focus:outline-none"
            style={{ cursor: 'auto' }}
          >
            Connected
          </button>
        ) : (
          <button
            className="orbis-connect-btn"
            tw="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => connect()}
          >
            Connect
          </button>
        )}
      </div>
      <div className="sidebar"></div>
    </>
  )
}

function Share({ context }: any) {
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState<string>('')
  const { orbis } = useOrbisContext()

  async function share(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
    e.preventDefault()
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
      <div tw="flex items-start space-x-4">
        <div tw="flex-shrink-0">
          <img
            tw="inline-block h-10 w-10 rounded-full"
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt=""
          />
        </div>
        <div tw="min-w-0 flex-1">
          <form action="#">
            <div tw="border-b border-gray-200 focus-within:border-indigo-600">
              <label htmlFor="comment" tw="sr-only">
                Add your debate
              </label>
              <textarea
                rows={3}
                name="comment"
                id="comment"
                onChange={(e) => setText(e.target.value)}
                value={text}
                style={{ padding: '0.5rem', borderRadius: '10px' }}
                tw="block w-full border-0 border-b border-transparent p-0 pb-2 resize-none focus:ring-0 focus:border-indigo-600 sm:text-sm"
                placeholder="Comment..."
                defaultValue={''}
              />
            </div>
            <div className="new-debate-background" tw="pt-2 flex justify-between">
              <div tw="flex items-center space-x-5">
                <div tw="flow-root">
                  <button
                    type="button"
                    tw="-m-2 w-10 h-10 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-500"
                  >
                    <PaperClipIcon tw="h-6 w-6" aria-hidden="true" />
                    <span tw="sr-only">Attach a file</span>
                  </button>
                </div>
                <div tw="flow-root"></div>
              </div>
              <div tw="flex-shrink-0">
                <button
                  type="submit"
                  onClick={(e) => share(e)}
                  tw="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Open debate
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
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
            <div
              key={key}
              style={{ cursor: 'auto' }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 posts-container"
            >
              <div className="debate">
                <div tw="flex-shrink-0">
                  {/* <img className="h-10 w-10 rounded-full" src={} alt="" /> */}
                </div>
                <div tw="flex-1 min-w-0">
                  <div tw="focus:outline-none">
                    <span tw="absolute inset-0" aria-hidden="true" />
                    {/* <p><b>Shared by: {post.creator}</b></p> */}
                    <p tw="text-sm text-gray-900 ">{post.content?.body}</p>
                  </div>
                </div>
                <div tw="flex">
                  <button>
                    <ChatAltIcon tw="h-6 w-6 mt-2" aria-hidden="true" />
                  </button>
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
  const { next_cursor_id, users } = await client.getBatch(
    ['forum-name', 'forum-slug', 'forum-address', 'forum-chain', 'forum-logo-uri'],
    {
      limit: 50,
    }
  )

  console.log({ users })
  const forums = (users || [])
    .map((u) => Forum.fromPrivyInstance(u) || null)
    .filter(Boolean) as Forum[]
  console.log({ forums })

  const forum = forums.find((f) => f.forumSlug === slug)
  if (!forum) return { notFound: true }

  return {
    props: {
      forumData: forum.toJson(),
    } as ForumPageProps,
  }
}
