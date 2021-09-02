import React from 'react'

import Image from '../../components/Image'
import Modal from '../../components/Modal'
import ModalHeader from '../../components/ModalHeader'

import ExclamationIcon from '../../../public/images/miso/modal-exclamation.svg'
import Typography from '../../components/Typography'

interface BaseModalProps {
  isOpen: boolean
  onDismiss: () => void
  title: string
  description: string
  children: React.ReactNode
}

function BaseModal({ isOpen, onDismiss, title, description, children }: BaseModalProps) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalHeader onClose={onDismiss} title=" " />
      <div className="text-center mb-9">
        <Image src={ExclamationIcon} height={58} alt="!" />
        <Typography variant="h2" weight={700} className="text-white mt-3">
          {title}
        </Typography>
        <Typography className="mt-3">{description}</Typography>
      </div>
      <div className="bg-dark-800 -m-6 p-6">{children}</div>
    </Modal>
  )
}

BaseModal.whyDidYouRender = true

export default BaseModal
