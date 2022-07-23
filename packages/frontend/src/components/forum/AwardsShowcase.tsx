import Badges from '@artifacts/contracts/Badges.sol/Badges.json'
import Forum from '@artifacts/contracts/Forum.sol/Forum.json'
import { Forum as ForumModel } from '@models/Forum.model'
import { useContracts } from '@shared/useContracts'
import { ethers } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import Image from 'next/image'
import { FC, useState } from 'react'
import { Badges as BadgesType, Forum as ForumType } from 'src/types/typechain'
import 'twin.macro'
import useAsyncEffect from 'use-async-effect'
import { useAccount, useSigner } from 'wagmi'
import badgeBronzeImg from '/public/badges/badge-bronze.png'
import badgeGoldImg from '/public/badges/badge-gold.png'
import badgeSilverImg from '/public/badges/badge-silver.png'

export interface AwardsShowcaseProps {
  forum: ForumModel
}
export const AwardsShowcase: FC<AwardsShowcaseProps> = ({ forum }) => {
  const { data: signer } = useSigner()
  const { address } = useAccount()
  const { contracts } = useContracts()
  const [amountBronzeAwards, setAmountBronzeAwards] = useState(0)
  const [amountSilverAwards, setAmountSilverAwards] = useState(0)
  const [amountGoldAwards, setAmountGoldAwards] = useState(0)
  const [score, setScore] = useState(0)

  useAsyncEffect(async () => {
    if (!signer || !address || !forum?.forumAddress) return

    try {
      // fetch badge values
      const badgesContract = new ethers.Contract(
        contracts.cBadges,
        Badges.abi,
        signer
      ) as BadgesType
      const bronze = await badgesContract.balanceOf(address, 0)
      setAmountBronzeAwards(parseInt(formatEther(bronze)))
      const silver = await badgesContract.balanceOf(address, 1)
      setAmountSilverAwards(parseInt(formatEther(silver)))
      const gold = await badgesContract.balanceOf(address, 2)
      setAmountGoldAwards(parseInt(formatEther(gold)))

      // fetch reputation score
      const forumContract = new ethers.Contract(forum.forumAddress, Forum.abi, signer) as ForumType
      const score = await forumContract.getScore(address)
      setScore(parseInt(formatEther(score)))
    } catch (e) {
      console.error('Error while fetching award balances', e)
    }
  }, [address])

  return (
    <>
      <div tw="flex flex-col border-4 border-gray-200 rounded-lg bg-white shadow-2xl shadow-gray-200 px-2 py-4 overflow-hidden">
        <div tw="grid grid-cols-4">
          <div tw="flex flex-col justify-center items-center">
            <div tw="shrink-0">
              <Image src={badgeBronzeImg} width="80" height="80" alt="Bronze Award" />
            </div>
            <div tw="text-lg font-bold">{amountBronzeAwards}</div>
          </div>
          <div tw="flex flex-col justify-center items-center">
            <div tw="shrink-0">
              <Image src={badgeSilverImg} width="80" height="80" alt="Silver Award" />
            </div>
            <div tw="text-lg font-bold">{amountSilverAwards}</div>
          </div>
          <div tw="flex flex-col justify-center items-center">
            <div tw="shrink-0">
              <Image src={badgeGoldImg} width="80" height="80" alt="Gold Award" />
            </div>
            <div tw="text-lg font-bold">{amountGoldAwards}</div>
          </div>
          <div tw="flex flex-col items-center justify-center text-center border-l-2 border-gray-200 pl-1">
            <div tw="font-bold text-2xl mb-1">{score}</div>
            <div tw="text-gray-600 text-sm">Reputation Score</div>
          </div>
        </div>
      </div>
    </>
  )
}
