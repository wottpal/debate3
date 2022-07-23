import Forum from '@artifacts/contracts/Forum.sol/Forum.json'
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormLabel,
  HStack,
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
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ethers } from 'ethers'
import Image from 'next/image'
import { FC, PropsWithChildren, useState } from 'react'
import { Forum as ForumType } from 'src/types/typechain'
import 'twin.macro'
import useAsyncEffect from 'use-async-effect'
import { useAccount, useConnect, useSigner } from 'wagmi'
import badgeBronzeImg from '/src/public/badges/badge-bronze.png'
import badgeGoldImg from '/src/public/badges/badge-gold.png'
import badgeSilverImg from '/src/public/badges/badge-silver.png'

export interface AwardBadgeDialogProps {
  isOpen?: boolean
  forum: ForumModel
  onClose?: () => void
}
export const AwardBadgeDialog: FC<AwardBadgeDialogProps> = ({ isOpen, onClose, forum }) => {
  const { data: signer } = useSigner()
  const { address } = useAccount()
  const [isModerator, setIsModerator] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState<'bronze' | 'silver' | 'gold'>('bronze')
  const { connect } = useConnect()

  useAsyncEffect(async () => {
    if (!signer || !address) return
    try {
      const isModerator = true // await contract.isModerator(address)
      setIsModerator(isModerator)
      const contract = new ethers.Contract(forum.address, Forum.abi, signer) as ForumType
    } catch (e) {
      console.error(e)
    }
  }, [signer, address, forum])

  const awardBadge = async () => {
    if (!signer || !address) return
    // setIsLoading(true)
    // setIsSuccess(false)

    // const contract = new ethers.Contract(contracts.Vault, Vault.abi, signer) as VaultType
    // let receipt
    // try {
    //   const tsx = await contract.createForum(forumName, forumModerators, nftMetadata.url)
    //   receipt = await tsx.wait()
    // } catch (e) {
    //   console.error(e)
    //   toast.error('Error while providing membership. Please try again!')
    // } finally {
    //   setIsLoading(false)
    // }
  }

  const badgeOptions = ['bronze', 'silver', 'gold']
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'badge',
    defaultValue: selectedBadge,
    onChange: (badgeLevel: any) => {
      setSelectedBadge(badgeLevel)
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

          {/* No Address connected  */}
          {(!signer || !address) && (
            <ModalBody>
              <Alert status="warning" tw="mb-2">
                <AlertIcon />
                You are not connected to a wallet or not on a supported chain.
              </Alert>
              <div tw="text-center my-6">
                <ConnectButton />
              </div>
            </ModalBody>
          )}

          {/* No valid moderator */}
          {address && signer && !isModerator && (
            <ModalBody>
              <Alert status="error" tw="mb-2">
                <AlertIcon />
                You are no moderator and therefore not allowed to perform this action.
              </Alert>
            </ModalBody>
          )}

          {/* Provide Membership Form */}
          {isModerator && (
            <>
              <ModalBody>
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
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
