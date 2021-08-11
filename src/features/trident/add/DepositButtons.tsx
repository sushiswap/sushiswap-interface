import React, { FC } from 'react'
import Button from '../../../components/Button'
import Typography from '../../../components/Typography'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useTridentAddLiquidityPageContext } from './context'
import { classNames } from '../../../functions'

interface DepositButtonsProps {
  inputValid: boolean
  onMax?: () => void
  isMaxInput?: boolean
}

const DepositButtons: FC<DepositButtonsProps> = ({ inputValid, isMaxInput, onMax }) => {
  const { i18n } = useLingui()
  const { showReview } = useTridentAddLiquidityPageContext()

  const onMaxButton = (
    <Button color="gradient" variant={isMaxInput ? 'filled' : 'outlined'} disabled={isMaxInput} onClick={onMax}>
      <Typography variant="sm" weight={700} className={!isMaxInput ? 'text-high-emphesis' : 'text-low-emphasis'}>
        {i18n._(t`Max Deposit`)}
      </Typography>
    </Button>
  )

  return (
    <div className={classNames(onMax ? 'grid grid-cols-2 gap-3' : 'flex')}>
      {onMax && onMaxButton}
      <Button color="gradient" disabled={!inputValid} onClick={showReview}>
        <Typography variant="sm" weight={700} className={inputValid ? 'text-high-emphesis' : 'text-low-emphasis'}>
          {inputValid ? i18n._(t`Confirm Deposit`) : i18n._(t`Enter Amounts`)}
        </Typography>
      </Button>
    </div>
  )
}

export default DepositButtons
