import Vault from '@artifacts/contracts/Vault.sol/Vault.json'
import {
  Box,
  Button,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react'
import { Forum as ForumModel } from '@models/Forum.model'
import { useContracts } from '@shared/useContracts'
import { ethers } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import Image from 'next/image'
import { FC, PropsWithChildren, useState } from 'react'
import toast from 'react-hot-toast'
import { Vault as VaultType } from 'src/types/typechain'
import 'twin.macro'
import { useAccount, useConnect, useSigner } from 'wagmi'
import badgeBronzeImg from '/src/public/badges/badge-bronze.png'
import badgeGoldImg from '/src/public/badges/badge-gold.png'
import badgeSilverImg from '/src/public/badges/badge-silver.png'

export interface AwardBadgeDialogProps {
  isOpen?: boolean
  forum: ForumModel
  address: string
  onClose?: () => void
}
export const AwardBadgeDialog: FC<AwardBadgeDialogProps> = ({
  isOpen,
  address: memberAddress,
  onClose,
  forum,
}) => {
  const { data: signer } = useSigner()
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState<0 | 1 | 2>(0)
  const { connect } = useConnect()
  const { contracts } = useContracts()

  const awardBadge = async () => {
    if (!signer || !address || !memberAddress || ![0, 1, 2].includes(selectedBadge)) return
    setIsLoading(true)

    let receipt
    try {
      const vaultContract = new ethers.Contract(contracts.Vault, Vault.abi, signer) as VaultType
      let tsx
      if (selectedBadge === 2)
        tsx = await vaultContract.giveGold(memberAddress, parseEther('1'), forum.forumAddress)
      else if (selectedBadge === 1)
        tsx = await vaultContract.giveSilver(memberAddress, parseEther('1'), forum.forumAddress)
      else tsx = await vaultContract.giveBronze(memberAddress, parseEther('1'), forum.forumAddress)
      receipt = await tsx.wait()
    } catch (e) {
      console.error(e)
      toast.error('Error while rewarding badge. Please try again!')
    } finally {
      toast.success(`Successfully rewarded badge!`)
      setIsLoading(false)
      onClose?.()
    }
  }

  const badgeOptions = ['bronze', 'silver', 'gold']
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'badge',
    defaultValue: 'bronze',
    onChange: (badgeLevel: any) => {
      setSelectedBadge((['bronze', 'silver', 'gold'].indexOf(badgeLevel) as 0 | 1 | 2) || 0)
    },
  })
  const group = getRootProps()
  const RadioBadgeCard: FC<PropsWithChildren> = ({ children, ...props }) => {
    const { getInputProps, getCheckboxProps } = useRadio(props)
    const input = getInputProps()
    const checkbox = getCheckboxProps()
    return (
      <Box as="label">
        <input {...input} />
        <Box
          {...checkbox}
          cursor="pointer"
          borderWidth="1px"
          borderRadius="md"
          boxShadow="md"
          _checked={{
            bg: 'gray.800',
            color: 'white',
            borderColor: 'gray.600',
          }}
          _focus={{
            boxShadow: 'outline',
          }}
          px={5}
          py={3}
          position="relative"
        >
          {children}
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Modal
        isOpen={!!isOpen}
        onClose={() => {
          onClose?.()
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Award Reputation Badge</ModalHeader>
          <ModalCloseButton />

          {/* Provide Membership Form */}
          <ModalBody>
            <FormLabel>Address of Member</FormLabel>
            <Input readOnly={true} tw="grow mb-4" size="sm" disabled={true} value={address} />

            <FormLabel>Select Badge-Level</FormLabel>
            <HStack {...group}>
              {badgeOptions.map((value) => {
                const radio = getRadioProps({ value })
                return (
                  <RadioBadgeCard key={`badge-${value}`} {...radio}>
                    <Image
                      src={
                        {
                          bronze: badgeBronzeImg,
                          silver: badgeSilverImg,
                          gold: badgeGoldImg,
                        }[value] as any
                      }
                      width="200"
                      height="200"
                      alt="Badge"
                    />
                  </RadioBadgeCard>
                )
              })}
            </HStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="facebook"
              variant="solid"
              disabled={isLoading}
              size="lg"
              isLoading={isLoading}
              onClick={awardBadge}
            >
              Award Badge
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
