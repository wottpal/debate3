import blockies from 'blockies-ts'
import { ethers } from 'ethers'
import Image from 'next/image'
import { useMemo } from 'react'
import 'twin.macro'

export interface BlockiesAvatarProps {
  address?: string
}

export const BlockiesAvatar = ({
  address = '0x0000000000000000000000000000000000000000',
  ...props
}: BlockiesAvatarProps): JSX.Element => {
  const avatarDataUrl = useMemo(
    () => blockies.create({ seed: ethers.utils.getAddress(address) }).toDataURL(),
    [address]
  )

  return (
    <div tw="relative [image-rendering:pixelated]" {...props}>
      <Image src={avatarDataUrl} alt={address} layout="fill" />
    </div>
  )
}
