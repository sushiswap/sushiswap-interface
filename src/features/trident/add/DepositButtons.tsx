import React, { FC } from 'react'
import Button from '../../../components/Button'
import Typography from '../../../components/Typography'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { classNames } from '../../../functions'
import Dots from '../../../components/Dots'

interface DepositButtonsProps {
  inputValid?: boolean
  onMax?: () => void
  isMaxInput?: boolean
  onClick: () => void
  errorMessage?: string
  pending?: boolean
}

const DepositButtons: FC<DepositButtonsProps> = ({ inputValid, isMaxInput, onMax, onClick, errorMessage, pending }) => {
  const { i18n } = useLingui()

  const onMaxButton = (
    <Button color="gradient" variant={isMaxInput ? 'filled' : 'outlined'} disabled={isMaxInput} onClick={onMax}>
      <Typography variant="sm" weight={700} className={!isMaxInput ? 'text-high-emphesis' : 'text-low-emphasis'}>
        {i18n._(t`Max Deposit`)}
      </Typography>
    </Button>
  )

  const buttonText = !errorMessage ? i18n._(t`Confirm Deposit`) : errorMessage

  return (
    <div className={classNames(onMax && !isMaxInput ? 'grid grid-cols-2 gap-3' : 'flex')}>
      {!isMaxInput && onMaxButton}
      <Button color="gradient" disabled={!!errorMessage} onClick={onClick}>
        <Typography variant="sm" weight={700} className={inputValid ? 'text-high-emphesis' : 'text-low-emphasis'}>
          {pending ? <Dots>{buttonText}</Dots> : buttonText}
        </Typography>
      </Button>
    </div>
  )
}

export default DepositButtons
