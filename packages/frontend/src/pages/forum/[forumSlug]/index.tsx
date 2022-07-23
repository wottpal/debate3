import { Forum } from '@models/Forum.model'
import { PrivyClient } from '@privy-io/privy-node'
import { env } from '@shared/environment'
import type { GetServerSideProps } from 'next'
import 'twin.macro'
import {
  FC,
  PropsWithChildren,
  Fragment,
  useEffect,
  useState,
  MouseEvent,
  SetStateAction,
} from 'react'
import { useOrbisContext } from '@components/OrbisProvider'
import {
  EmojiHappyIcon as EmojiHappyIconOutline,
  PaperClipIcon,
  ChatAltIcon,
  XIcon,
} from '@heroicons/react/outline'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
export interface ForumPageProps {
  forumData: object
}
export default function ForumPage({ forumData }: ForumPageProps) {
  const forum = Forum.fromObject(forumData)
  const [user, setUser] = useState()
  const [openCommentModal, setOpenCommentModal] = useState(false)
  const [selectedDebateContent, setSelectedDebateContent] = useState('')
  const [selectedDebateId, setSelectedDebateId] = useState('')
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState<any[]>([])
  const [comments, setComments] = useState<any[]>([])
  const { orbis } = useOrbisContext()

  useEffect(() => {
    loadPosts()
  }, [orbis])

  async function loadPosts() {
    setLoading(true)
    if (orbis) {
      const { data, error, status } = await orbis.getPosts({ context: forum?.forumName })

      if (data && orbis) {
        setPosts(data)
        setLoading(false)
      }
    }
  }

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

  const openComments = async (debate: SetStateAction<string>, id: SetStateAction<string>) => {
    setOpenCommentModal(true)
    setSelectedDebateContent(debate)
    setSelectedDebateId(id)
    if (selectedDebateId && orbis) {
      const { data } = await orbis.getPosts({ context: selectedDebateId })
      console.log(data)
      console.log(orbis)
      if (data && orbis) {
        setComments(data)
      }
    }
  }

  if (!forum) return null
  return (
    <>
      {/* <div>Deployer Address / Admin: {forum.address}</div> */}
      <h2 className="forum-header">{forum.forumName}</h2>
      <div className="debates-feed">
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
                  <button
                    style={{ zIndex: '1' }}
                    onClick={() => openComments(post.content?.body, post.stream_id)}
                  >
                    <ChatAltIcon tw="h-6 w-6 mt-2" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {openCommentModal && (
        <div className="modal-dim" onClick={() => setOpenCommentModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div
              className="close-comments-btn"
              style={{ zIndex: '10' }}
              onClick={() => setOpenCommentModal(false)}
            >
              <XIcon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="comments-debate">{selectedDebateContent}</div>
            <div>
              {comments.map((comment, key) => {
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
                          <p tw="text-sm text-gray-900 ">{comment.content?.body}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <ShareComment context={selectedDebateId} />
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
    <div className="share-container" style={{ zIndex: '2' }}>
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
                placeholder="Debate..."
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

function ShareComment({ context }: any) {
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState<string>('')
  const { orbis } = useOrbisContext()

  async function share(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
    e.preventDefault()
    setLoading(true)
    const res = await orbis.createPost({
      body: text,
      context: context,
    })

    if (res.status == 200) {
      console.log('Shared post with stream_id: ', res.doc)
    } else {
      console.log('Error sharing post: ', res)
      console.log(context)
      alert('Error sharing post.')
    }
    setLoading(false)
  }

  return (
    <div className="share-container comment-share-container" style={{ zIndex: '2' }}>
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
              <div tw="flex-shrink-0">
                <button
                  type="submit"
                  onClick={(e) => share(e)}
                  tw="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Comment
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
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
