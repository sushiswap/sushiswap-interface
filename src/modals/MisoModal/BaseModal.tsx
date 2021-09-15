import React from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Image from '../../components/Image'
import Modal from '../../components/Modal'
import ModalHeader from '../../components/ModalHeader'

import ExclamationIcon from '../../../public/images/miso/modal-exclamation.svg'
import Typography from '../../components/Typography'
import Button from '../../components/Button'
import { XCircleIcon } from '@heroicons/react/outline'

interface BaseModalProps {
  isOpen: boolean
  onDismiss: () => void
  onAction: () => void
  title: string
  description: string
  actionTitle: string
  actionDescription: string
  children: React.ReactNode
}

function BaseModal({
  isOpen,
  onDismiss,
  title,
  description,
  actionTitle,
  actionDescription,
  onAction,
  children,
}: BaseModalProps) {
  const { i18n } = useLingui()

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <div className="relative text-center mb-10 py-3">
        <XCircleIcon
          className="absolute cursor-pointer right-0 top-0 text-primary w-[30px] h-[30px]"
          onClick={onDismiss}
        />
        <Image src={ExclamationIcon} height={58} alt="!" />
        <Typography variant="h2" className="text-white mt-3">
          {title}
        </Typography>
        <Typography className="mt-2">{description}</Typography>
      </div>
      <div className="bg-dark-800 -m-6 p-6">
        {children}

        <Button color="gradient" size="default" className="mt-8" onClick={onAction}>
          {i18n._(t`${actionTitle}`)}
        </Button>
        {/* <button
          onClick={onDismiss}
          className="flex items-center justify-center w-full h-12 text-lg font-medium rounded bg-pink hover:bg-opacity-90 text-high-emphesis"
        >
          {i18n._(t`${actionTitle}`)}
        </button> */}
        <Typography variant="sm" className="mt-3 text-center">
          {actionDescription}
        </Typography>
      </div>
    </Modal>
  )
}

BaseModal.whyDidYouRender = true

export default BaseModal
