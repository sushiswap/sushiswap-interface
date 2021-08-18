import React, { FC, useCallback } from 'react'
import Button from '../../../components/Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import Typography from '../../../components/Typography'
import HeadlessUIModal from '../../../components/Modal/HeadlessUIModal'
import { useTridentAddLiquidityPageContext, useTridentAddLiquidityPageState } from './context'
import { ActionType, LiquidityMode } from './context/types'
import { useLingui } from '@lingui/react'
import ListPanel from '../../../components/ListPanel'
import Divider from '../../../components/Divider'
import { ZERO } from '@sushiswap/sdk'
import TransactionDetails from './TransactionDetails'

const AddTransactionReviewModal: FC = () => {
  const { i18n } = useLingui()
  const { liquidityMode, showZapReview } = useTridentAddLiquidityPageState()
  const { pool, dispatch, execute, parsedInputAmounts, parsedOutputAmounts } = useTridentAddLiquidityPageContext()

  const closeModal = useCallback(() => {
    dispatch({
      type: ActionType.SHOW_ZAP_REVIEW,
      payload: false,
    })
  }, [dispatch])

  // Need to use controlled modal here as open variable comes from the liquidityPageState.
  // In other words, this modal needs to be able to get spawned from anywhere within this context
  return (
    <HeadlessUIModal.Controlled isOpen={showZapReview} onDismiss={closeModal}>
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
                onClick={closeModal}
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
              items={Object.values(parsedInputAmounts).reduce((acc, cur, index) => {
                if (cur?.greaterThan(ZERO)) acc.push(<ListPanel.CurrencyAmountItem amount={cur} key={index} />)
                return acc
              }, [])}
            />
          </div>
          {liquidityMode === LiquidityMode.ZAP && (
            <div className="flex flex-col gap-3 px-5">
              <Typography weight={700} variant="lg">
                {i18n._(t`Which will be converted to:`)}
              </Typography>
              <ListPanel
                items={pool.tokens.map((token, index) => (
                  <ListPanel.CurrencyAmountItem amount={parsedOutputAmounts[token.address]} key={index} />
                ))}
              />
            </div>
          )}
          <div className="flex flex-row justify-between px-5">
            <Typography weight={700} variant="lg">
              {i18n._(t`You'll receive:`)}
            </Typography>
            <Typography weight={700} variant="lg" className="text-high-emphesis">
              10.3875 SLP
            </Typography>
          </div>
        </div>
        <div className="flex flex-col px-5 gap-5">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <Typography variant="sm">{i18n._(t`Rates:`)}</Typography>
              <Typography variant="sm" className="text-right">
                1 SUSHI = .0021 WETH
              </Typography>
            </div>
            <div className="flex justify-end">
              <Typography variant="sm" className="text-right">
                1 WETH = 474.254761 SUSHI
              </Typography>
            </div>
          </div>
          <Divider />
          <div className="flex flex-col gap-1">
            {pool.tokens.map((token, index) => (
              <div className="flex justify-between" key={index}>
                <Typography variant="sm" className="text-secondary">
                  {i18n._(t`${token.symbol} Deposited:`)}
                </Typography>
                <Typography variant="sm" weight={700} className="text-high-emphesis text-right">
                  0.00 → 281.2334 {token.symbol}
                </Typography>
              </div>
            ))}
            <div className="flex justify-between">
              <Typography variant="sm" className="text-secondary">
                {i18n._(t`Share of Pool`)}
              </Typography>
              <Typography variant="sm" weight={700} className="text-high-emphesis text-right">
                0.00% → 0.03%
              </Typography>
            </div>
          </div>
          <Button color="gradient" size="lg" onClick={execute}>
            <Typography variant="sm" weight={700} className="text-high-emphesis">
              Confirm Deposit
            </Typography>
          </Button>
        </div>
        <TransactionDetails />
      </div>
    </HeadlessUIModal.Controlled>
  )
}

export default AddTransactionReviewModal
