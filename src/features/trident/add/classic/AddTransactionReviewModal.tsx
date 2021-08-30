import { FC } from 'react'
import {
  currentLiquidityValueSelector,
  liquidityMintedSelector,
  liquidityValueSelector,
  parsedAmountsSelector,
  poolAtom,
  poolShareSelector,
  useClassicAddExecute,
} from './context/atoms'
import ListPanel from '../../../../components/ListPanel'
import { useRecoilState, useRecoilValue } from 'recoil'
import TransactionDetails from '../TransactionDetails'
import Typography from '../../../../components/Typography'
import { t } from '@lingui/macro'
import Divider from '../../../../components/Divider'
import { useLingui } from '@lingui/react'
import HeadlessUIModal from '../../../../components/Modal/HeadlessUIModal'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import Button from '../../../../components/Button'
import { ZERO } from '@sushiswap/sdk'
import { LiquidityMode } from '../../types'
import { currentPoolShareSelector, liquidityModeAtom, priceSelector, showReviewAtom } from '../../context/atoms'

const AddTransactionReviewModal: FC = () => {
  const { i18n } = useLingui()
  const [, pool] = useRecoilValue(poolAtom)
  const liquidityMode = useRecoilValue(liquidityModeAtom)
  const [showReview, setShowReview] = useRecoilState(showReviewAtom)
  const parsedAmounts = useRecoilValue(parsedAmountsSelector)
  const liquidityMinted = useRecoilValue(liquidityMintedSelector)
  const liquidityValue = useRecoilValue(liquidityValueSelector)
  const currentLiquidityValues = useRecoilValue(currentLiquidityValueSelector)
  const price = useRecoilValue(priceSelector)
  const poolTokenPercentage = useRecoilValue(poolShareSelector)
  const currentPoolShare = useRecoilValue(currentPoolShareSelector)

  const { standardModeExecute, zapModeExecute } = useClassicAddExecute()

  // Need to use controlled modal here as open variable comes from the liquidityPageState.
  // In other words, this modal needs to be able to get spawned from anywhere within this context
  return (
    <HeadlessUIModal.Controlled isOpen={showReview} onDismiss={() => setShowReview(false)}>
      <div className="flex flex-col gap-8 h-full">
        <div className="relative">
          <div className="pointer-events-none absolute w-full h-full bg-gradient-to-r from-opaque-blue to-opaque-pink opacity-20" />
          <div className="px-5 pt-5 pb-8 flex flex-col gap-4">
            <div className="flex flex-row justify-between">
              <Button
                color="blue"
                variant="outlined"
                size="sm"
                className="rounded-full py-1 pl-2 cursor-pointer"
                startIcon={<ChevronLeftIcon width={24} height={24} />}
                onClick={() => setShowReview(false)}
              >
                {i18n._(t`Back`)}
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <Typography variant="h2" weight={700} className="text-high-emphesis">
                {i18n._(t`Confirm Add Liquidity`)}
              </Typography>
              <Typography variant="sm">
                {i18n._(t`Output is estimated. If the price changes by more than 0.5% your transaction will revert.`)}
              </Typography>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 px-5">
            <Typography weight={700} variant="lg">
              {i18n._(t`You are depositing:`)}
            </Typography>
            <ListPanel
              items={parsedAmounts.reduce((acc, cur, index) => {
                if (cur?.greaterThan(ZERO)) acc.push(<ListPanel.CurrencyAmountItem amount={cur} key={index} />)
                return acc
              }, [])}
            />
          </div>
          {/*{liquidityMode === LiquidityMode.ZAP && (*/}
          {/*  <div className="flex flex-col gap-3 px-5">*/}
          {/*    <Typography weight={700} variant="lg">*/}
          {/*      {i18n._(t`Which will be converted to:`)}*/}
          {/*    </Typography>*/}
          {/*    <ListPanel*/}
          {/*      items={currencies.map((currency, index) => (*/}
          {/*        <ListPanel.CurrencyAmountItem amount={parsedOutputAmounts[address]} key={index} />*/}
          {/*      ))}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*)}*/}
          <div className="flex flex-row justify-between px-5">
            <Typography weight={700} variant="lg">
              {i18n._(t`You'll receive:`)}
            </Typography>
            <Typography weight={700} variant="lg" className="text-high-emphesis">
              {liquidityMinted?.toSignificant(6)} SLP
            </Typography>
          </div>
        </div>
        <div className="flex flex-col px-5 gap-5">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <Typography variant="sm">{i18n._(t`Rates:`)}</Typography>
              <Typography variant="sm" className="text-right">
                1 {pool?.token0?.symbol} = {price?.toSignificant(6)} {pool?.token1?.symbol}
              </Typography>
            </div>
            <div className="flex justify-end">
              <Typography variant="sm" className="text-right">
                1 {pool?.token1?.symbol} = {price?.invert().toSignificant(6)} {pool?.token0?.symbol}
              </Typography>
            </div>
          </div>
          <Divider />
          <div className="flex flex-col gap-1">
            {currentLiquidityValues && liquidityValue && (
              <>
                <div className="flex justify-between">
                  <Typography variant="sm" className="text-secondary">
                    {i18n._(t`${pool?.token0?.symbol} Deposited:`)}
                  </Typography>
                  <Typography variant="sm" weight={700} className="text-high-emphesis text-right">
                    {currentLiquidityValues[0] ? currentLiquidityValues[0].toSignificant(6) : '0.000'} →{' '}
                    {liquidityValue[0] ? liquidityValue[0].toSignificant(6) : '0.000'}
                    {pool?.token0?.symbol}
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="sm" className="text-secondary">
                    {i18n._(t`${pool?.token1?.symbol} Deposited:`)}
                  </Typography>
                  <Typography variant="sm" weight={700} className="text-high-emphesis text-right">
                    {currentLiquidityValues[1] ? currentLiquidityValues[1].toSignificant(6) : '0.000'} →{' '}
                    {liquidityValue[1] ? liquidityValue[1].toSignificant(6) : '0.000'}
                    {pool?.token1?.symbol}
                  </Typography>
                </div>
              </>
            )}
            <div className="flex justify-between">
              <Typography variant="sm" className="text-secondary">
                {i18n._(t`Share of Pool`)}
              </Typography>
              <Typography variant="sm" weight={700} className="text-high-emphesis text-right">
                {currentPoolShare?.greaterThan(0) ? currentPoolShare?.toSignificant(6) : '0.000'}% →{' '}
                {poolTokenPercentage?.toSignificant(6) || '0.000'}%
              </Typography>
            </div>
          </div>
          <Button
            color="gradient"
            size="lg"
            onClick={liquidityMode === LiquidityMode.STANDARD ? standardModeExecute : zapModeExecute}
          >
            <Typography variant="sm" weight={700} className="text-high-emphesis">
              {i18n._(t`Confirm Deposit`)}
            </Typography>
          </Button>
        </div>
        <div className="flex flex-col px-5">
          <TransactionDetails />
        </div>
      </div>
    </HeadlessUIModal.Controlled>
  )
}

export default AddTransactionReviewModal
