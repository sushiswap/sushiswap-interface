import { FC } from 'react'
import Typography from '../../../components/Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import TransactionDetailsExplanationModal from './TransactionDetailsExplanationModal'
import { useRecoilValue } from 'recoil'
import { liquidityMintedSelector, poolAtom, poolShareSelector } from './classic/context/atoms'
import { currentPoolShareSelector, poolBalanceAtom, priceSelector } from '../context/atoms'

const TransactionDetails: FC = () => {
  const { i18n } = useLingui()
  const [, pool] = useRecoilValue(poolAtom)
  const liquidityMinted = useRecoilValue(liquidityMintedSelector)
  const poolBalance = useRecoilValue(poolBalanceAtom)
  const poolTokenPercentage = useRecoilValue(poolShareSelector)
  const currentPoolShare = useRecoilValue(currentPoolShareSelector)
  const price = useRecoilValue(priceSelector)

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
            1 {pool?.token0?.symbol}
          </Typography>
          <Typography weight={700} variant="sm" className="text-high-emphesis">
            {price ? price.toSignificant(6) : '0.000'} {pool?.token1?.symbol}
          </Typography>
        </div>
        <div className="flex flex-row justify-between">
          <Typography variant="sm" className="text-secondary">
            1 {pool?.token1?.symbol}
          </Typography>
          <Typography weight={700} variant="sm" className="text-high-emphesis">
            {price ? price.invert().toSignificant(6) : '0.000'} {pool?.token0?.symbol}
          </Typography>
        </div>
        <div className="flex flex-row justify-between">
          <Typography variant="sm" className="text-secondary">
            {i18n._(t`Minimum Received`)}
          </Typography>
          <Typography weight={700} variant="sm" className="text-high-emphesis">
            {liquidityMinted?.toSignificant(6) || '0.000'} SLP
          </Typography>
        </div>
        <div className="flex flex-row justify-between">
          <Typography variant="sm" className="text-secondary">
            {i18n._(t`Your Pool Tokens`)}
          </Typography>
          <Typography weight={700} variant="sm" className="text-high-emphesis">
            {poolBalance?.greaterThan(0) ? poolBalance?.toSignificant(6) : '0.000'} →{' '}
            <span className="text-green">
              {poolBalance && liquidityMinted ? poolBalance.add(liquidityMinted)?.toSignificant(6) : '0.000'} SLP
            </span>
          </Typography>
        </div>
        <div className="flex flex-row justify-between">
          <Typography variant="sm" className="text-secondary">
            {i18n._(t`Your Pool Share`)}
          </Typography>
          <Typography weight={700} variant="sm" className="text-high-emphesis">
            {'<'} {currentPoolShare?.greaterThan(0) ? currentPoolShare?.toSignificant(6) : '0.000'} →{' '}
            <span className="text-green">{poolTokenPercentage?.toSignificant(6) || '0.000'}%</span>
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
