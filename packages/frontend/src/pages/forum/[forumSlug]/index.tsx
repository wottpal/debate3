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
  ModalHeader,
  Textarea,
} from '@chakra-ui/react'
import { BlockiesAvatar } from '@components/BlockiesAvatar'
import { AwardBadgeDialog } from '@components/forum/AwardBadgeDialog'
import { AwardsShowcase } from '@components/forum/AwardsShowcase'
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
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Forum as ForumType } from 'src/types/typechain'
import 'twin.macro'
import useAsyncEffect from 'use-async-effect'
import { useAccount, useSigner } from 'wagmi'
import emptyImg from '/public/illustrations/post_01.svg'
import unlockImg from '/public/illustrations/unlock_01.svg'

export interface ForumPageProps extends SingleForumProps {}
export default function ForumPage({ forumData }: ForumPageProps) {
  const { data: signer } = useSigner()
  const { address } = useAccount()
  const forum = ForumModel.fromObject(forumData)
  const [orbisUser, setOrbisUser] = useState()
  const [openCommentModal, setOpenCommentModal] = useState(false)
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
  const [selectedPost, setSelectedPost] = useState<any>(null)

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
  const loadPosts = async () => {
    if (orbis) {
      setLoading(true)
      const { data, error, status } = await orbis.getPosts({ context: forum?.forumName })

      if (data && orbis) {
        setPosts(data)
      }
      setLoading(false)
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
  const refetchComments = async () => {
    if (!selectedPost?.stream_id) return
    const { data } = await orbis.getPosts({ context: selectedPost.stream_id })
    setComments(data)
  }
  useEffect(() => {
    refetchComments()
  }, [selectedPost])

  if (!forum) return null
  return (
    <>
      <Wrapper tw="flex flex-col grow relative">
        <div tw="grow w-full flex flex-col my-20">
          {/* Top Bar */}
          <div tw="flex justify-between items-center mb-5">
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
                      <div tw="font-semibold break-all">{post.content?.body}</div>
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
                        onClick={() => {
                          setSelectedPost(post)
                        }}
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
            <div tw="mt-2 flex w-full space-x-2">
              <div tw="grow w-2/3 flex flex-col border-4 border-gray-200 rounded-lg bg-white shadow-2xl shadow-gray-200 overflow-hidden">
                <Share
                  context={forum.forumName}
                  orbisUser={orbisUser}
                  connectOrbis={connectOrbis}
                  refetchPosts={loadPosts}
                />
              </div>
              <AwardsShowcase forum={forum} />
            </div>
          )}
        </div>
      </Wrapper>

      {/* Thread Modal/Dialog */}
      <Drawer
        isOpen={!!selectedPost}
        onClose={() => {
          setSelectedPost(null)
        }}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          <ModalHeader>
            Full Thread
            <p tw="text-sm text-gray-500">
              Shared by{' '}
              {selectedPost?.creator_details?.metadata?.ensName ||
                truncateHash(selectedPost?.creator_details?.metadata?.address)}
            </p>
          </ModalHeader>
          <DrawerCloseButton />
          {selectedPost && (
            <DrawerBody>
              <div tw="h-full grow flex flex-col">
                <div tw="grow flex flex-col divide-y-2 divide-gray-200 -mx-5">
                  {[selectedPost, ...comments].map((post, key) => (
                    <div
                      key={key}
                      tw="flex items-center py-5 px-5 last:(border-b-2 border-gray-200) first:(border-t-2 border-gray-200)"
                    >
                      <BlockiesAvatar
                        address={post.creator_details?.metadata?.address}
                        tw="w-[2.5rem] h-[2.5rem] shrink-0 mr-3 overflow-hidden rounded-full bg-gray-200"
                      />
                      <div tw="flex flex-col">
                        <div tw="font-semibold break-all">{post.content?.body}</div>
                        <div
                          tw="text-xs text-gray-500"
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
                      </div>
                    </div>
                  ))}
                </div>

                <Share
                  context={selectedPost?.stream_id}
                  orbisUser={orbisUser}
                  connectOrbis={connectOrbis}
                  refetchPosts={() => {
                    refetchComments()
                  }}
                />
              </div>
            </DrawerBody>
          )}
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

function Share({ context, orbisUser, connectOrbis, refetchPosts, ...props }: any) {
  const [loading, setLoading] = useState(false)
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
      toast.success('Successfully shared post!')
    } else {
      console.log('Error sharing post: ', res)
      toast.error('Error while sharing posts. Please try again!')
      alert('Error sharing post.')
    }

    setLoading(false)
    setValue('')
    setTimeout(() => {
      refetchPosts()
    }, 1000)
  }

  return (
    <div tw="flex items-start py-5 px-5" {...props}>
      <div tw="flex flex-col grow">
        <Textarea value={value} onChange={handleInputChange} rows={2} placeholder="gm world ☀️" />
        <Button onClick={share} tw="mt-2" size="sm" disabled={!value} isLoading={loading}>
          Share Post
        </Button>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = getSingleForum
