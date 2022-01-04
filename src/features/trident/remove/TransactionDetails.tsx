import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { FC } from 'react'
import { useRecoilValue } from 'recoil'

import { DEFAULT_REMOVE_V2_SLIPPAGE_TOLERANCE, liquidityModeAtom, poolBalanceAtom } from '../context/atoms'
import { usePoolDetailsBurn } from '../context/hooks/usePoolDetails'
import useRemovePercentageInput from '../context/hooks/useRemovePercentageInput'
import TransactionDetailsExplanationModal from '../TransactionDetailsExplanationModal'
import { LiquidityMode } from '../types'

const TransactionDetails: FC = () => {
  const { i18n } = useLingui()
  const poolBalance = useRecoilValue(poolBalanceAtom)
  const liquidityMode = useRecoilValue(liquidityModeAtom)

  const { parsedSLPAmount } = useRemovePercentageInput()

  // TODO ramin: fix for zap mode
  const input = liquidityMode === LiquidityMode.STANDARD ? parsedSLPAmount : undefined

  // TODO ramin: fix for zap mode
  const { poolShareBefore, poolShareAfter } = usePoolDetailsBurn(input, DEFAULT_REMOVE_V2_SLIPPAGE_TOLERANCE)

  return (
    <div className="flex flex-col gap-4 lg:gap-8">
      <div className="flex flex-row justify-between">
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
        <div className="flex flex-row justify-between gap-2">
          <Typography variant="sm" className="text-secondary">
            {i18n._(t`Your Pool Share`)}
          </Typography>
          <Typography weight={700} variant="sm" className="text-high-emphesis text-right">
            {poolShareBefore?.greaterThan(0) ? poolShareBefore?.toSignificant(6) : '0.000'}%
            {parsedSLPAmount?.greaterThan(0) && (
              <>
                {' '}
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
            {parsedSLPAmount?.greaterThan(0) && (
              <>
                {' SLP '}→{' '}
                <span className="text-green">
                  {poolBalance && parsedSLPAmount ? poolBalance.subtract(parsedSLPAmount)?.toSignificant(6) : '0.000'}{' '}
                  SLP
                </span>
              </>
            )}
          </Typography>
        </div>
        {/*<div className="flex flex-row justify-between">*/}
        {/*  <Typography variant="sm" className="text-secondary">*/}
        {/*    {i18n._(t`Liquidity Provider Fee`)}*/}
        {/*  </Typography>*/}
        {/*  <Typography weight={700} variant="sm" className="text-high-emphesis">*/}
        {/*    0.00283 ETH*/}
        {/*  </Typography>*/}
        {/*</div>*/}
        {/*<div className="flex flex-row justify-between">*/}
        {/*  <Typography variant="sm" className="text-secondary">*/}
        {/*    {i18n._(t`Network Fee`)}*/}
        {/*  </Typography>*/}
        {/*  <Typography weight={700} variant="sm" className="text-high-emphesis">*/}
        {/*    0.008654 ETH*/}
        {/*  </Typography>*/}
        {/*</div>*/}
      </div>
    </div>
  )
}

export default TransactionDetails
