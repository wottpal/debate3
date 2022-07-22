import { CenterBody } from '@components/layout/CenterBody'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { NextPage } from 'next'
import 'twin.macro'

const HomePage: NextPage = () => {
  return (
    <>
      <CenterBody>
        <h1 tw="text-3xl mb-6">debate3.xyz</h1>
        <ConnectButton />
      </CenterBody>
    </>
  )
}

export default HomePage
