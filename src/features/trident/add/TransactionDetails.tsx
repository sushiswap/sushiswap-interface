import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { useAddDetails } from 'app/features/trident/add/useAddDetails'
import { useAddLiquidityState } from 'app/features/trident/add/useAddLiquidityState'
import { usePoolContext } from 'app/features/trident/PoolContext'
import { FC } from 'react'

import TransactionDetailsExplanationModal from '../TransactionDetailsExplanationModal'

const TransactionDetails: FC = () => {
  const { i18n } = useLingui()
  const { poolWithState, poolBalance } = usePoolContext()
  const { parsedAmounts } = useAddLiquidityState()
  const { price, poolShareBefore, liquidityMinted, poolShareAfter } = useAddDetails(parsedAmounts)

  return (
    <div className="flex flex-col gap-4 lg:gap-8">
      <div className="flex flex-row justify-between gap-2">
        <Typography weight={700} className="text-high-emphesis">
          {i18n._(t`Transaction Details`)}
        </Typography>
        <TransactionDetailsExplanationModal>
          <Typography weight={700} variant="sm" className="text-blue text-right">
            {i18n._(t`What do these mean?`)}
          </Typography>
        </TransactionDetailsExplanationModal>
      </div>
      <div className="flex flex-col gap-1">
        {poolWithState?.pool && (
          <>
            <div className="flex flex-row justify-between gap-2">
              <Typography variant="sm" className="text-secondary">
                1 {poolWithState.pool?.token0?.symbol}
              </Typography>
              <Typography weight={700} variant="sm" className="text-high-emphesis text-right">
                {price ? price.toSignificant(6) : '0.000'} {poolWithState.pool?.token1?.symbol}
              </Typography>
            </div>
            <div className="flex flex-row justify-between">
              <Typography variant="sm" className="text-secondary">
                1 {poolWithState.pool?.token1?.symbol}
              </Typography>
              <Typography weight={700} variant="sm" className="text-high-emphesis text-right">
                {price ? price.invert().toSignificant(6) : '0.000'} {poolWithState.pool?.token0?.symbol}
              </Typography>
            </div>
          </>
        )}
        <div className="flex flex-row justify-between gap-2">
          <Typography variant="sm" className="text-secondary">
            {i18n._(t`Minimum Received`)}
          </Typography>
          <Typography weight={700} variant="sm" className="text-high-emphesis">
            {liquidityMinted?.toSignificant(6) || '0.000'} SLP
          </Typography>
        </div>
        <div className="flex flex-row justify-between gap-2">
          <Typography variant="sm" className="text-secondary">
            {i18n._(t`Your Pool Share`)}
          </Typography>
          <Typography weight={700} variant="sm" className="text-high-emphesis text-right">
            {poolShareBefore?.greaterThan(0) ? poolShareBefore?.toSignificant(6) : '0.000'}%
            {poolShareAfter?.greaterThan(0) && (
              <>
                → <span className="text-green">{poolShareAfter?.toSignificant(6) || '0.000'}%</span>
              </>
            )}
          </Typography>
        </div>
        <div className="flex flex-row justify-between gap-2">
          <Typography variant="sm" className="text-secondary whitespace-nowrap">
            {i18n._(t`Your Pool Tokens`)}
          </Typography>
          <Typography weight={700} variant="sm" className="text-high-emphesis text-right">
            {poolBalance?.greaterThan(0) ? poolBalance?.toSignificant(6) : '0.000'}
            {liquidityMinted?.greaterThan(0) && (
              <>
                {' SLP '}→{' '}
                <span className="text-green">
                  {poolBalance && liquidityMinted ? poolBalance.add(liquidityMinted)?.toSignificant(6) : '0.000'} SLP
                </span>
              </>
            )}
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default TransactionDetails
