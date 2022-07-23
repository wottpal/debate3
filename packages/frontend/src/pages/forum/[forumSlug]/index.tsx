import Forum from '@artifacts/contracts/Forum.sol/Forum.json'
import { ChatIcon, ChevronDownIcon, StarIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Textarea,
} from '@chakra-ui/react'
import { BlockiesAvatar } from '@components/BlockiesAvatar'
import { AwardBadgeDialog } from '@components/forum/AwardBadgeDialog'
import { ProvideMembershipDialog } from '@components/forum/ProvideMembershipDialog'
import { RevokeMembershipDialog } from '@components/forum/RevokeMembershipDialog'
import { Wrapper } from '@components/layout/Wrapper'
import { useOrbisContext } from '@components/OrbisProvider'
import { Forum as ForumModel } from '@models/Forum.model'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { getSingleForum, SingleForumProps } from '@shared/getSingleForum'
import { truncateHash } from '@shared/truncateHash'
import { useContracts } from '@shared/useContracts'
import { useIsSSR } from '@shared/useIsSSR'
import axios from 'axios'
import { ethers } from 'ethers'
import type { GetServerSideProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { MouseEvent, SetStateAction, useEffect, useState } from 'react'
import { Forum as ForumType } from 'src/types/typechain'
import 'twin.macro'
import useAsyncEffect from 'use-async-effect'
import { useAccount, useSigner } from 'wagmi'
import emptyImg from '/src/public/illustrations/post_01.svg'
import unlockImg from '/src/public/illustrations/unlock_01.svg'

export interface ForumPageProps extends SingleForumProps {}
export default function ForumPage({ forumData }: ForumPageProps) {
  const { data: signer } = useSigner()
  const { address } = useAccount()
  const forum = ForumModel.fromObject(forumData)
  const [orbisUser, setOrbisUser] = useState()
  const [openCommentModal, setOpenCommentModal] = useState(false)
  const [selectedDebateContent, setSelectedDebateContent] = useState('')
  const [selectedDebateId, setSelectedDebateId] = useState('')
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState<any[]>([])
  const [comments, setComments] = useState<any[]>([])
  const { orbis } = useOrbisContext()
  const { contracts } = useContracts()
  const isSsr = useIsSSR()
  const [isModerator, setIsModerator] = useState(false)
  const [accessIsAllowed, setAccessIsAllowed] = useState(false)
  const [provideMembershipDialogIsOpen, setProvideMembershipDialogIsOpen] = useState(false)
  const [revokeMembershipDialogIsOpen, setRevokeMembershipDialogIsOpen] = useState(false)
  const [awardBadgeDialogData, setAwardBadgeDialogData] = useState<any>({ isOpen: false })
  const [nftLogoUrl, setNftLogoUrl] = useState<string | null>(null)

  // fetch nft logo
  useAsyncEffect(async () => {
    if (!forum) {
      setNftLogoUrl(null)
      return
    }
    const ipfsUri = forum.forumLogoUri.slice(7)
    const { data } = await axios.get(`https://ipfs.io/ipfs/${ipfsUri}`)
    const imageUri = data?.image
    if (!imageUri) {
      setNftLogoUrl(null)
      return
    }
    const imageIpfsUri = `https://ipfs.io/ipfs/${imageUri.slice(7)}`
    setNftLogoUrl(imageIpfsUri)
  }, [forum])

  // fetch if current user is moderator
  useAsyncEffect(async () => {
    if (!signer || !address || !forum) return
    try {
      const contract = new ethers.Contract(forum.forumAddress, Forum.abi, signer) as ForumType
      const isModerator = await contract.isModerator(address)
      setIsModerator(isModerator)
    } catch (e) {
      console.error(e)
      setIsModerator(false)
    }
  }, [signer, address, forum])

  // fetch if current user has forum membership
  useAsyncEffect(async () => {
    if (!signer || !address || !forum) {
      setAccessIsAllowed(false)
      return
    }
    try {
      const contract = new ethers.Contract(forum.forumAddress, Forum.abi, signer) as ForumType
      const accessIsAllowed = await contract.allowedForCaller()
      setAccessIsAllowed(accessIsAllowed)
    } catch (e) {
      console.error(e)
      setAccessIsAllowed(false)
    }
  }, [signer, address, forum])

  // fetch orbis posts
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
  useEffect(() => {
    loadPosts()
  }, [orbis])

  // connect with orbis
  async function connectOrbis() {
    const res = await orbis.connect()

    if (res.status == 200) {
      console.log('Connected to Ceramic with: ', res.did)
      setOrbisUser(res.did)
    } else {
      console.log('Error connecting to Ceramic: ', res)
      alert('Error connecting to Ceramic.')
    }
  }

  // fetch orbis comments for selected comment
  useEffect(() => {
    const loadComments = async () => {
      setLoading(true)
      if (selectedDebateId) {
        const { data } = await orbis.getPosts({ context: selectedDebateId })
        setComments(data)
        setLoading(false)
      }
    }
    loadComments()
  }, [selectedDebateId])

  // open comment drawer
  const openComments = async (debate: SetStateAction<string>, id: SetStateAction<string>) => {
    setOpenCommentModal(true)
    setSelectedDebateContent(debate)
    setSelectedDebateId(id)
  }

  if (!forum) return null
  return (
    <>
      <Wrapper tw="flex flex-col grow relative">
        <div tw="grow w-full flex flex-col my-20">
          {/* Top Bar */}
          <div tw="flex justify-between items-center mb-4">
            {/* Logo & Name */}
            <div tw="flex items-center">
              {nftLogoUrl && (
                <div tw="w-[4rem] h-[4rem] relative mr-3.5 overflow-hidden shadow-lg rounded-full bg-gray-200 shrink-0">
                  <Image src={nftLogoUrl} alt="logo" layout="fill" />
                </div>
              )}
              <div tw="flex flex-col items-start">
                <h1 tw="font-display text-4xl font-black tracking-tight mb-0.5">
                  {forum.forumName}
                </h1>
                {isModerator ? (
                  <Menu>
                    {/* Moderator Menu */}
                    <MenuButton
                      as={Box}
                      tw="cursor-pointer font-semibold opacity-75 hover:opacity-100"
                    >
                      Moderator Actions <ChevronDownIcon />
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        onClick={() => {
                          setProvideMembershipDialogIsOpen(true)
                        }}
                      >
                        Provide Membership
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setRevokeMembershipDialogIsOpen(true)
                        }}
                      >
                        Revoke Membership
                      </MenuItem>
                    </MenuList>
                  </Menu>
                ) : (
                  <Link href="/" passHref>
                    <p tw="text-gray-600 text-lg  cursor-pointer hover:text-gray-800">
                      Powered by Debate3.xyz
                    </p>
                  </Link>
                )}
              </div>
            </div>

            {/* Connect Button */}
            {!isSsr && <ConnectButton showBalance={false} />}
          </div>

          {/* Body */}
          <main tw="grow flex flex-col w-full border-4 border-gray-200 rounded-lg bg-white shadow-2xl shadow-gray-200 overflow-hidden">
            {/* Locked State */}
            {!accessIsAllowed && !isSsr && (
              <div tw="flex flex-col items-center justify-center h-full my-10">
                <div tw="text-center mb-8">
                  <h2 tw="font-bold text-xl mb-1">No Access</h2>
                  <p tw="text-gray-600">
                    This is a gated forum and your wallet has no membership NFT.
                  </p>
                </div>
                <Image src={unlockImg} alt="Unlock" width="250px" height="250px"></Image>
                <div tw="mt-10">
                  <ConnectButton label="Connect your Wallet" />
                </div>
              </div>
            )}

            {accessIsAllowed && !posts?.length && (
              <div tw="flex flex-col items-center justify-center h-full my-10">
                <div tw="text-center mb-8">
                  <h2 tw="font-bold text-xl mb-1">No Posts yet</h2>
                  <p tw="text-gray-600">
                    Invite members and be the first to open a debate in your fancy new forum.
                  </p>
                </div>
                <Image src={emptyImg} alt="Unlock" width="250px" height="250px"></Image>
              </div>
            )}

            {accessIsAllowed && !!posts?.length && (
              <div tw="grow flex flex-col divide-y-2 divide-gray-200">
                {posts.map((post, key) => (
                  <div key={key} tw="flex items-center py-5 px-5 last:(border-b-2 border-gray-200)">
                    <BlockiesAvatar
                      address={post.creator_details?.metadata?.address}
                      tw="w-[2.5rem] h-[2.5rem] shrink-0 mr-3 overflow-hidden rounded-full bg-gray-200"
                    />
                    <div tw="flex flex-col">
                      <div tw="font-semibold">{post.content?.body}</div>
                      <div
                        tw="text-sm text-gray-700"
                        title={post.creator_details?.metadata?.address}
                      >
                        Shared by{' '}
                        {post.creator_details?.metadata?.ensName ||
                          truncateHash(post.creator_details?.metadata?.address)}
                      </div>
                    </div>

                    <div tw="ml-auto space-x-2">
                      {isModerator && (
                        <Button
                          leftIcon={<StarIcon />}
                          size="sm"
                          onClick={() => {
                            setAwardBadgeDialogData({
                              isOpen: true,
                              address: post.creator_details?.metadata?.address,
                            })
                          }}
                          colorScheme="yellow"
                        >
                          Award Badge
                        </Button>
                      )}
                      <Button
                        leftIcon={<ChatIcon />}
                        size="sm"
                        onClick={() => openComments(post.content?.body, post.stream_id)}
                      >
                        Full Thread
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

          {/* Share new Post */}
          {accessIsAllowed && (
            <div tw="mt-2 flex flex-col w-full border-4 border-gray-200 rounded-lg bg-white shadow-2xl shadow-gray-200 overflow-hidden">
              <Share
                context={forum.forumName}
                orbisUser={orbisUser}
                connectOrbis={connectOrbis}
                refetchPosts={loadPosts}
              />
            </div>
          )}
        </div>
      </Wrapper>

      {/* Thread Modal/Dialog */}
      <Drawer
        isOpen={openCommentModal}
        onClose={() => {
          setOpenCommentModal(false)
        }}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          {/* <ModalHeader>Post Details</ModalHeader> */}
          <DrawerCloseButton />
          <DrawerBody>
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
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Moderator Dialogs */}
      <ProvideMembershipDialog
        isOpen={provideMembershipDialogIsOpen}
        onClose={() => {
          setProvideMembershipDialogIsOpen(false)
        }}
        forum={forum}
      />
      <RevokeMembershipDialog
        isOpen={revokeMembershipDialogIsOpen}
        onClose={() => {
          setRevokeMembershipDialogIsOpen(false)
        }}
        forum={forum}
      />
      <AwardBadgeDialog
        onClose={() => {
          setAwardBadgeDialogData({ isOpen: false })
        }}
        forum={forum}
        {...awardBadgeDialogData}
      />
    </>
  )
}

function Share({ context, orbisUser, connectOrbis, refetchPosts }: any) {
  const [loading, setLoading] = useState(false)
  const { address } = useAccount()
  const { orbis } = useOrbisContext()
  const [value, setValue] = useState('')

  const handleInputChange = (e: any) => {
    const inputValue = e.target.value
    setValue(inputValue)
  }

  async function share() {
    setLoading(true)
    if (!orbisUser) await connectOrbis()
    console.log('Sharing with context ', context)
    const res = await orbis.createPost({
      body: value,
      context: context,
    })

    if (res.status == 200) {
      console.log('Shared post with stream_id: ', res.doc)
    } else {
      console.log('Error sharing post: ', res)
      alert('Error sharing post.')
    }

    await refetchPosts()
    setLoading(false)
    setValue('')
  }

  return (
    <div tw="flex items-start py-5 px-5">
      {/* <BlockiesAvatar
        address={address}
        tw="w-[3rem] h-[3rem] shrink-0 mr-3 overflow-hidden rounded-full bg-gray-200"
      /> */}
      <div tw="flex flex-col grow">
        <Textarea value={value} onChange={handleInputChange} rows={2} placeholder="gm world ☀️" />
        <Button onClick={share} tw="mt-2" size="sm" disabled={!value} isLoading={loading}>
          Share Post
        </Button>
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

export const getServerSideProps: GetServerSideProps = getSingleForum
