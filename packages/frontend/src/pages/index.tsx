import { Button } from '@chakra-ui/react'
import { Wrapper } from '@components/layout/Wrapper'
import { Forum } from '@models/Forum.model'
import { AllForumsProps, getAllForums } from '@shared/getAllForums'
import type { GetServerSideProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import 'twin.macro'
import cronosImg from '/src/public/partners/cronos.svg'
import gnosisImg from '/src/public/partners/gnosis.svg'
import celoImg from '/src/public/partners/celo.svg'
import polygonImg from '/src/public/partners/polygon.svg'
import orbisImg from '/src/public/partners/orbis.svg'
import vyperImg from '/src/public/partners/vyper.svg'
import truffleImg from '/src/public/partners/truffle.svg'
import infuraImg from '/src/public/partners/infura.svg'
import privyImg from '/src/public/partners/privy.svg'
import ipfsImg from '/src/public/partners/ipfs.svg'
import background from '/src/public/bg/landing_bg.svg'
import neonImg from '/src/public/partners/neon.svg'
import { LockClosedIcon, RefreshIcon, BadgeCheckIcon } from '@heroicons/react/outline'

const features = [
  {
    name: 'Reputation Badges',
    description:
      'Reward community with ERC-1155 NFT badges. User points will disappear after longer inactivity',
    icon: BadgeCheckIcon,
  },
  {
    name: 'Token Gated',
    description:
      'Create your own token gated forum. Only authorised users will have access your private debates.',
    icon: LockClosedIcon,
  },
  {
    name: 'Fading Reputation',
    description:
      'Keep your community engaged. Inactive users start losing reputation points after some period of time.',
    icon: RefreshIcon,
  },
]

interface HomePageProps extends AllForumsProps {}
export default function HomePage({ forumsData }: HomePageProps) {
  const [allForums, setAllForums] = useState<Forum[]>([])
  useEffect(() => {
    const forums = (forumsData || []).map((f) => Forum.fromObject(f)).filter(Boolean) as Forum[]
    setAllForums(forums)
  }, forumsData)

  return (
    <>
      <div className="landing-background">
        <Image src={background} style={{ width: '100%' }} alt="Background" />
      </div>
      {/* Navbar */}
      <Wrapper>
        <nav tw="flex items-center justify-between">
          <div tw="font-display font-bold tracking-tight text-4xl">Debate3</div>
          <Link href="/setup" prefetch={true} passHref>
            <Button variant="solid">Create a Forum</Button>
          </Link>
        </nav>
      </Wrapper>

      {/* Hero */}
      <div tw="flex flex-col justify-center items-center text-center mt-28">
        <h1 tw="mx-auto max-w-4xl font-display font-semibold text-6xl leading-[1.2] tracking-tight text-slate-900 z-10">
          <span tw="relative whitespace-nowrap" style={{ color: '#2F43FF' }}>
            <svg
              aria-hidden="true"
              viewBox="0 0 418 42"
              tw="absolute top-2/3 left-0 h-[0.58em] w-full fill-brandblue/25"
              preserveAspectRatio="none"
            >
              <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
            </svg>
            <span tw="relative font-black">Decentralized</span>
          </span>
          <br />
          discussions for DAOs
        </h1>
        <p
          tw="mx-auto mt-6 max-w-2xl text-xl tracking-tight text-slate-700"
          style={{ zIndex: '1' }}
        >
          A token-gated, decentralized discussion platform with an <br />
          inbuilt reputation system and moderation.
        </p>
        <Link href="/setup" prefetch={true} passHref>
          <Button
            tw="mt-10"
            variant="solid"
            size="lg"
            style={{ backgroundColor: '#2F43FF', color: 'white' }}
          >
            Create a Forum
          </Button>
        </Link>
      </div>

      {/* Sponsors */}
      <Wrapper>
        <div tw="flex flex-col items-center mt-12 bg-white">
          {/* <p tw="font-bold text-xl tracking-tight mb-8">
            Built with the help of amazing sponsors at EthCC
          </p> */}
          <div tw="flex flex-wrap space-x-10 justify-center">
            <a
              href="https://cronos.org/"
              target="_blank"
              tw="cursor-pointer grayscale opacity-80 hover:(opacity-100 grayscale-0)"
            >
              <Image src={cronosImg} width={120} height={75} alt="Cronos" />
            </a>
            <a
              href="https://gnosis.io/"
              target="_blank"
              tw="cursor-pointer grayscale opacity-80 hover:(opacity-100 grayscale-0)"
            >
              <Image src={gnosisImg} width={120} height={75} alt="Gnosis" />
            </a>
            <a
              href="https://celo.org/"
              target="_blank"
              tw="cursor-pointer grayscale opacity-80 hover:(opacity-100 grayscale-0)"
            >
              <Image src={celoImg} width={120} height={75} alt="Celo" />
            </a>
            <a
              href="https://www.privy.io/"
              target="_blank"
              tw="cursor-pointer grayscale opacity-80 hover:(opacity-100 grayscale-0) mt-2"
            >
              <Image src={privyImg} width={120} height={75} alt="Privy" />
            </a>
            <a
              href="https://orbis.club/"
              target="_blank"
              tw="cursor-pointer grayscale opacity-80 hover:(opacity-100 grayscale-0)"
            >
              <Image src={orbisImg} width={120} height={75} alt="Orbis" />
            </a>
            <a
              href="https://polygon.technology/"
              target="_blank"
              tw="cursor-pointer grayscale opacity-80 hover:(opacity-100 grayscale-0)"
            >
              <Image src={polygonImg} width={120} height={75} alt="Polygon" />
            </a>
            <a
              href="https://vyper.readthedocs.io/en/stable/toctree.html#"
              target="_blank"
              tw="cursor-pointer grayscale opacity-80 hover:(opacity-100 grayscale-0)"
            >
              <Image src={vyperImg} width={100} height={75} alt="Vyper" />
            </a>
            <a
              href="https://trufflesuite.com/"
              target="_blank"
              tw="cursor-pointer grayscale opacity-80 hover:(opacity-100 grayscale-0) "
            >
              <Image src={truffleImg} width={100} height={75} alt="Truffle" />
            </a>
            <a
              href="https://neon-labs.org/"
              target="_blank"
              tw="cursor-pointer grayscale opacity-80 hover:(opacity-100 grayscale-0)"
            >
              <Image src={neonImg} width={120} height={75} alt="Neon" />
            </a>
            <a
              href="https://infura.io/"
              target="_blank"
              tw="cursor-pointer grayscale opacity-80 hover:(opacity-100 grayscale-0)"
            >
              <Image src={infuraImg} width={120} height={75} alt="Infura" />
            </a>
            <a
              href="https://ipfs.io/"
              target="_blank"
              tw="cursor-pointer grayscale opacity-80 hover:(opacity-100 grayscale-0)"
            >
              <Image src={ipfsImg} width={120} height={75} alt="Infura" />
            </a>
          </div>
        </div>
      </Wrapper>

      {/* Features */}
      <Wrapper>
        <div tw="relative bg-white py-12 sm:py-12 lg:py-12">
          <div tw="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 tw="text-base font-semibold uppercase tracking-wider" style={{ color: '#385897' }}>
              Build community
            </h2>
            <p tw="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to keep community engaged.
            </p>
            <div tw="mt-16">
              <div tw="grid grid-cols-1 gap-24 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => (
                  <div key={feature.name} className="feature-card">
                    <div tw="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                      <div tw="-mt-6">
                        <div>
                          <span
                            tw="inline-flex items-center justify-center rounded-md p-3 shadow-lg"
                            style={{ backgroundColor: '#2F43FF' }}
                          >
                            <feature.icon tw="h-6 w-6 text-white" aria-hidden="true" />
                          </span>
                        </div>
                        <h3 tw="mt-8 text-lg font-bold tracking-tight text-gray-900">
                          {feature.name}
                        </h3>
                        <p tw="mt-5 text-base text-gray-500">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Wrapper>

      {/* All Forums */}
      {/* TODO */}
      <Wrapper>
        <div tw="relative bg-white py-8 sm:py-16 lg:py-8">
          <h1 tw="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl text-center">
            Join Forum Now
          </h1>
          <div className="forums-container">
            {allForums.map((f) => (
              <a className="landing-forum-card" key={f.forumAddress}>
                <img
                  src="https://images.unsplash.com/photo-1658251216561-077bf584633a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=830&q=80"
                  className="forum-image"
                ></img>
                <div className="forum-content">
                  <p onClick={() => console.log(f)} tw="text-2xl font-bold mt-4">
                    {f.forumName}
                  </p>
                  <button
                    style={{ backgroundColor: '#2F43FF', color: 'white' }}
                    className="join-forum"
                  >
                    Join
                  </button>
                </div>
              </a>
            ))}
          </div>
        </div>
      </Wrapper>

      {/* Footer */}
      <Wrapper>
        <nav tw="flex items-center justify-center whitespace-pre-wrap mt-16">
          <a href="http://ethcchack.com/" target="_blank">
            Built at EthCC 2022
          </a>
          {' • '}
          <a href="https://github.com/wottpal/debate3" target="_blank">
            Open-Source on Github
          </a>
        </nav>
      </Wrapper>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = getAllForums
