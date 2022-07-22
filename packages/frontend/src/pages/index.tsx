import { Button } from '@chakra-ui/react'
import { Wrapper } from '@components/layout/Wrapper'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import 'twin.macro'
import cronosImg from '/src/public/partners/cronos.svg'

const HomePage: NextPage = () => {
  return (
    <>
      {/* Navbar */}
      <Wrapper>
        <nav tw="flex items-center justify-between">
          <div tw="font-display font-bold tracking-tight text-lg">Debate3.xyz</div>
          <Link href="/setup" passHref>
            <Button variant="solid">Create a Forum</Button>
          </Link>
        </nav>
      </Wrapper>

      {/* Hero */}
      <div tw="flex flex-col justify-center items-center text-center mt-28">
        <h1 tw="mx-auto max-w-4xl font-display font-semibold text-6xl leading-[1.2] tracking-tight text-slate-900">
          <span tw="relative whitespace-nowrap text-brandblue">
            <svg
              aria-hidden="true"
              viewBox="0 0 418 42"
              tw="absolute top-2/3 left-0 h-[0.58em] w-full fill-brandblue/25"
              preserveAspectRatio="none"
            >
              <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
            </svg>
            <span tw="relative">Decentralized</span>
          </span>
          <br />
          discussions for DAOs
        </h1>
        <p tw="mx-auto mt-6 max-w-2xl text-xl tracking-tight text-slate-700">
          A token-gated, decentralized discussion platform with an <br />
          inbuilt reputation system and moderation.
        </p>
        <Link href="/setup" passHref>
          <Button tw="mt-10" colorScheme="facebook" variant="solid" size="lg">
            Create a Forum
          </Button>
        </Link>
      </div>

      {/* Sponsors */}
      <Wrapper>
        <div tw="flex flex-col items-center mt-20">
          {/* <p tw="font-bold text-xl tracking-tight mb-8">
            Built with the help of amazing sponsors at EthCC
          </p> */}
          <div tw="flex flex-wrap space-x-6 justify-center">
            <a
              href="https://cronos.org/"
              target="_blank"
              tw="cursor-pointer grayscale opacity-80 hover:(opacity-100 grayscale-0)"
            >
              <Image src={cronosImg} width={150} height={75} alt="Cronos" />
            </a>
            <a
              href="https://cronos.org/"
              target="_blank"
              tw="cursor-pointer grayscale opacity-80 hover:(opacity-100 grayscale-0)"
            >
              <Image src={cronosImg} width={150} height={75} alt="Cronos" />
            </a>
            <a
              href="https://cronos.org/"
              target="_blank"
              tw="cursor-pointer grayscale opacity-80 hover:(opacity-100 grayscale-0)"
            >
              <Image src={cronosImg} width={150} height={75} alt="Cronos" />
            </a>
            <a
              href="https://cronos.org/"
              target="_blank"
              tw="cursor-pointer grayscale opacity-80 hover:(opacity-100 grayscale-0)"
            >
              <Image src={cronosImg} width={150} height={75} alt="Cronos" />
            </a>
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

export default HomePage
