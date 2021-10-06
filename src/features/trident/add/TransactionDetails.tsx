import { FC } from 'react'
import Typography from '../../../components/Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import { useRecoilValue } from 'recoil'
import { liquidityModeAtom, poolAtom, poolBalanceAtom } from '../context/atoms'
import { useDependentAssetInputs } from '../context/hooks/useDependentAssetInputs'
import { usePoolDetails } from '../context/hooks/usePoolDetails'
import { useZapAssetInput } from '../context/hooks/useZapAssetInput'
import { LiquidityMode } from '../types'
import TransactionDetailsExplanationModal from '../TransactionDetailsExplanationModal'

const TransactionDetails: FC = () => {
  const { i18n } = useLingui()
  const [, pool] = useRecoilValue(poolAtom)
  const poolBalance = useRecoilValue(poolBalanceAtom)
  const { parsedAmountsWithSlippage } = useDependentAssetInputs()

  // TODO parsedSplitAmounts is still empty
  const { parsedSplitAmounts } = useZapAssetInput()

  const liquidityMode = useRecoilValue(liquidityModeAtom)
  const input = liquidityMode === LiquidityMode.ZAP ? parsedSplitAmounts : parsedAmountsWithSlippage
  const { price, currentPoolShare, liquidityMinted, poolShare } = usePoolDetails(input)

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
        {pool && (
          <>
            <div className="flex flex-row justify-between gap-2">
              <Typography variant="sm" className="text-secondary">
                1 {pool?.token0?.symbol}
              </Typography>
              <Typography weight={700} variant="sm" className="text-high-emphesis text-right">
                {price ? price.toSignificant(6) : '0.000'} {pool?.token1?.symbol}
              </Typography>
            </div>
            <div className="flex flex-row justify-between">
              <Typography variant="sm" className="text-secondary">
                1 {pool?.token1?.symbol}
              </Typography>
              <Typography weight={700} variant="sm" className="text-high-emphesis text-right">
                {price ? price.invert().toSignificant(6) : '0.000'} {pool?.token0?.symbol}
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
          <Typography variant="sm" className="text-secondary whitespace-nowrap">
            {i18n._(t`Your Pool Tokens`)}
          </Typography>
          <Typography weight={700} variant="sm" className="text-high-emphesis text-right">
            {poolBalance?.greaterThan(0) ? poolBalance?.toSignificant(6) : '0.000'}
            {liquidityMinted?.greaterThan(0) && (
              <>
                {' '}
                →{' '}
                <span className="text-green">
                  {poolBalance && liquidityMinted ? poolBalance.add(liquidityMinted)?.toSignificant(6) : '0.000'} SLP
                </span>
              </>
            )}
          </Typography>
        </div>
        <div className="flex flex-row justify-between gap-2">
          <Typography variant="sm" className="text-secondary">
            {i18n._(t`Your Pool Share`)}
          </Typography>
          <Typography weight={700} variant="sm" className="text-high-emphesis text-right">
            {currentPoolShare?.greaterThan(0) ? currentPoolShare?.toSignificant(6) : '0.000'}%
            {poolShare?.greaterThan(0) && (
              <>
                → <span className="text-green">{poolShare?.toSignificant(6) || '0.000'}%</span>
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
