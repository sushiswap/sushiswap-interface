import Typography from '../../../../components/Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import TransactionDetails from '../TransactionDetails'
import React from 'react'
import useZapPercentageInput from '../../context/hooks/useZapPercentageInput'

const ClassicZapAside = () => {
  const { i18n } = useLingui()
  const { error } = useZapPercentageInput()

  return (
    <div className="flex flex-col p-10 rounded bg-dark-1000 shadow-lg gap-20">
      <div className="flex flex-col gap-3">
        <Typography variant="h3" className="text-high-emphesis">
          {i18n._(t`Standard Mode`)}
        </Typography>
        <Typography variant="sm">
          {i18n._(
            t`You can withdraw to one or both of these assets, in any amount.  If you would like to receive your investment as another token (e.g. in USDC), then withdraw using Zap mode.`
          )}
        </Typography>
      </div>
      <div className={error ? 'opacity-50' : 'opacity-100'}>
        <TransactionDetails />
      </div>
    </div>
  )
}

export default ClassicZapAside
