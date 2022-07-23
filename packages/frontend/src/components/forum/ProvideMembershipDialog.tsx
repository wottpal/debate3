import Forum from '@artifacts/contracts/Forum.sol/Forum.json'
import {
  Button,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { Forum as ForumModel } from '@models/Forum.model'
import { useContracts } from '@shared/useContracts'
import { ethers } from 'ethers'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Forum as ForumType } from 'src/types/typechain'
import 'twin.macro'
import { useAccount, useSigner } from 'wagmi'

export interface ProvideMembershipDialogProps {
  isOpen?: boolean
  forum: ForumModel
  onClose?: () => void
}
export const ProvideMembershipDialog: FC<ProvideMembershipDialogProps> = ({
  isOpen,
  onClose,
  forum,
}) => {
  const { data: signer } = useSigner()
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm({ mode: 'onChange' })
  const newMemberAddress = form.watch('memberAddress')
  const { isValid, errors } = form.formState
  const { contracts } = useContracts()

  const provideMembership = async () => {
    if (!signer || !address || !isValid) return
    setIsLoading(true)

    const forumContract = new ethers.Contract(forum.address, Forum.abi, signer) as ForumType
    let receipt
    try {
      const tsx = await forumContract.provideMembership([newMemberAddress], [])
      receipt = await tsx.wait()
    } catch (e) {
      console.error(e)
      toast.error('Error while providing membership. Please try again!')
    } finally {
      toast.success(`Successfully provided membership to address!`)
      setIsLoading(false)
      onClose?.()
    }
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
          <ModalHeader>Provide Membership</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {/* Provide Membership Form */}
            <FormLabel>Address of new Member*</FormLabel>
            <Input
              placeholder="0x…"
              size="lg"
              tw="grow"
              isInvalid={!!errors?.newMemberAddress}
              {...form.register(`memberAddress`, {
                pattern: /^0x[a-fA-F0-9]{40}$/,
                required: true,
              })}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="facebook"
              variant="solid"
              disabled={!isValid || isLoading}
              size="lg"
              isLoading={isLoading}
              onClick={provideMembership}
            >
              Provide Membership
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
