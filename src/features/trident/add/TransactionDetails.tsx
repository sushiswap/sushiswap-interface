import { FC } from 'react'
import Typography from '../../../components/Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import TransactionDetailsExplanationModal from './TransactionDetailsExplanationModal'

const TransactionDetails: FC = () => {
  const { i18n } = useLingui()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <Typography weight={700} className="text-high-emphesis">
          {i18n._(t`Transaction Details`)}
        </Typography>
        <TransactionDetailsExplanationModal>
          <Typography weight={700} variant="sm" className="text-blue">
            {i18n._(t`What do these mean?`)}
          </Typography>
        </TransactionDetailsExplanationModal>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex flex-row justify-between">
          <Typography variant="sm" className="text-secondary">
            {i18n._(t`Minimum Received`)}
          </Typography>
          <Typography weight={700} variant="sm" className="text-high-emphesis">
            10.38765 SLP
          </Typography>
        </div>
        <div className="flex flex-row justify-between">
          <Typography variant="sm" className="text-secondary">
            {i18n._(t`Price Impact`)}
          </Typography>
          <Typography weight={700} variant="sm" className="text-yellow">
            10.5%
          </Typography>
        </div>
        <div className="flex flex-row justify-between">
          <Typography variant="sm" className="text-secondary">
            {i18n._(t`Your Pool Tokens`)}
          </Typography>
          <Typography weight={700} variant="sm" className="text-high-emphesis">
            1.576 → <span className="text-green">11.787 SLP</span>
          </Typography>
        </div>
        <div className="flex flex-row justify-between">
          <Typography variant="sm" className="text-secondary">
            {i18n._(t`Your Pool Share`)}
          </Typography>
          <Typography weight={700} variant="sm" className="text-high-emphesis">
            {'<'} 0.01% → <span className="text-green">0.01%</span>
          </Typography>
        </div>
        <div className="flex flex-row justify-between">
          <Typography variant="sm" className="text-secondary">
            {i18n._(t`Liquidity Provider Fee`)}
          </Typography>
          <Typography weight={700} variant="sm" className="text-high-emphesis">
            0.00283 ETH
          </Typography>
        </div>
        <div className="flex flex-row justify-between">
          <Typography variant="sm" className="text-secondary">
            {i18n._(t`Network Fee`)}
          </Typography>
          <Typography weight={700} variant="sm" className="text-high-emphesis">
            0.008654 ETH
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default TransactionDetails
