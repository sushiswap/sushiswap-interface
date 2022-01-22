import { ArrowDownIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Percent } from '@sushiswap/core-sdk'
import limitOrderPairList from '@sushiswap/limit-order-pair-list/dist/limit-order.pairlist.json'
import AddressInputPanel from 'app/components/AddressInputPanel'
import Container from 'app/components/Container'
import DoubleGlowShadow from 'app/components/DoubleGlowShadow'
import ExpertModePanel from 'app/components/ExpertModePanel'
import Typography from 'app/components/Typography'
import { ZERO_PERCENT } from 'app/constants'
import { Feature } from 'app/enums'
import LimitOrderButton from 'app/features/legacy/limit-order/LimitOrderButton'
import LimitOrderReviewModal from 'app/features/legacy/limit-order/LimitOrderReviewModal'
import LimitPriceInputPanel from 'app/features/legacy/limit-order/LimitPriceInputPanel'
import OrderExpirationDropdown from 'app/features/legacy/limit-order/OrderExpirationDropdown'
import HeaderNew from 'app/features/trade/HeaderNew'
import SwapAssetPanel from 'app/features/trident/swap/SwapAssetPanel'
import { maxAmountSpend } from 'app/functions'
import NetworkGuard from 'app/guards/Network'
import { useBentoOrWalletBalances } from 'app/hooks/useBentoOrWalletBalance'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppDispatch } from 'app/state/hooks'
import { Field, setFromBentoBalance } from 'app/state/limit-order/actions'
import useLimitOrderDerivedCurrencies, {
  useLimitOrderActionHandlers,
  useLimitOrderDerivedLimitPrice,
  useLimitOrderDerivedParsedAmounts,
  useLimitOrderDerivedTrade,
  useLimitOrderState,
} from 'app/state/limit-order/hooks'
import { useExpertModeManager } from 'app/state/user/hooks'
import React, { useCallback, useMemo, useState } from 'react'

// @ts-ignore TYPE NEEDS FIXING
const areEqual = (first, second) => {
  if (first.length !== second.length) {
    return false
  }
  for (let i = 0; i < first.length; i++) {
    if (!second.includes(first[i])) {
      return false
    }
  }
  return true
}

const LimitOrder = () => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { chainId, account } = useActiveWeb3React()
  const [isExpertMode, toggleExpertMode] = useExpertModeManager()
  const { typedField, typedValue, recipient, fromBentoBalance } = useLimitOrderState()
  const { inputCurrency, outputCurrency } = useLimitOrderDerivedCurrencies()
  const trade = useLimitOrderDerivedTrade()
  const rate = useLimitOrderDerivedLimitPrice()
  const parsedAmounts = useLimitOrderDerivedParsedAmounts({ rate, trade })
  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useLimitOrderActionHandlers()
  const [animateSwapArrows, setAnimateSwapArrows] = useState<boolean>(false)
  const pairs = useMemo(
    // @ts-ignore TYPE NEEDS FIXING
    () => (limitOrderPairList.pairs[chainId || 1] || []).map(([token0, token1]) => [token0.address, token1.address]),
    [chainId]
  )

  const [walletBalance, bentoBalance] = useBentoOrWalletBalances(
    account ?? undefined,
    [inputCurrency, inputCurrency],
    [true, false]
  )

  const maxAmountInput = maxAmountSpend(walletBalance)
  const atMaxAmountInput = bentoBalance
    ? Boolean(
        fromBentoBalance
          ? trade?.inputAmount?.equalTo(bentoBalance)
          : maxAmountInput && trade?.inputAmount?.equalTo(maxAmountInput)
      )
    : undefined

  const handleMaxInput = useCallback(() => {
    if (fromBentoBalance) {
      bentoBalance && onUserInput(Field.INPUT, bentoBalance.toExact())
    } else {
      maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [bentoBalance, fromBentoBalance, maxAmountInput, onUserInput])

  const inputPanelHelperText = useMemo(() => {
    if (rate && trade) {
      const { numerator, denominator } = rate.subtract(trade.executionPrice).divide(trade.executionPrice)
      return new Percent(numerator, denominator)
    }
  }, [rate, trade])

  const inputTokenList = useMemo(() => {
    if (pairs.length === 0) return []
    // @ts-ignore TYPE NEEDS FIXING
    return pairs.reduce((acc, [token0, token1]) => {
      acc.push(token0)
      acc.push(token1)
      return acc
    }, [])
  }, [pairs])

  const outputTokenList = useMemo(() => {
    if (pairs.length === 0) return []
    if (inputCurrency) {
      // @ts-ignore TYPE NEEDS FIXING
      return pairs.reduce((acc, [token0, token1]) => {
        if (inputCurrency.wrapped.address === token0) acc.push(token1)
        if (inputCurrency.wrapped.address === token1) acc.push(token0)
        return acc
      }, [])
    }
    // @ts-ignore TYPE NEEDS FIXING
    return pairs.reduce((acc, [token0, token1]) => {
      acc.push(token0)
      acc.push(token1)
      return acc
    }, [])
  }, [inputCurrency, pairs])

  return (
    <Container id="limit-order-page" className="py-4 md:py-12 lg:py-[120px]" maxWidth="md">
      <ExpertModePanel
        active={isExpertMode}
        onClose={() => {
          onChangeRecipient(undefined)
          toggleExpertMode()
        }}
      >
        <DoubleGlowShadow>
          <div id="limit-order-page" className="flex flex-col gap-3 p-4 rounded-[24px] bg-dark-800">
            <div className="px-2">
              <HeaderNew inputCurrency={inputCurrency} outputCurrency={outputCurrency} />
            </div>
            {/*<ExchangeHeader input={inputCurrency} output={outputCurrency} />*/}
            <div className="flex flex-col gap-3">
              <SwapAssetPanel
                error={false}
                header={(props) => <SwapAssetPanel.Header {...props} label={i18n._(t`You pay`)} />}
                walletToggle={(props) => (
                  <SwapAssetPanel.Switch
                    id={`switch-classic-withdraw-from-0}`}
                    {...props}
                    label={i18n._(t`Pay from`)}
                    onChange={() => dispatch(setFromBentoBalance(!fromBentoBalance))}
                  />
                )}
                selected={true}
                spendFromWallet={!fromBentoBalance}
                currency={inputCurrency}
                value={(typedField === Field.INPUT ? typedValue : parsedAmounts?.inputAmount?.toSignificant(6)) || ''}
                onChange={(value) => onUserInput(Field.INPUT, value || '')}
                onSelect={(inputCurrency) => onCurrencySelection(Field.INPUT, inputCurrency)}
                currencies={inputTokenList}
              />
              <div className="grid grid-cols-2 gap-4">
                <LimitPriceInputPanel trade={trade} limitPrice={!!rate ? rate : trade?.executionPrice} />
                <OrderExpirationDropdown />
              </div>
              <SwapAssetPanel
                error={false}
                header={(props) => <SwapAssetPanel.Header {...props} label={i18n._(t`You receive`)} />}
                selected={true}
                currency={outputCurrency}
                value={(typedField === Field.OUTPUT ? typedValue : parsedAmounts?.outputAmount?.toSignificant(6)) || ''}
                onChange={(value) => onUserInput(Field.OUTPUT, value || '')}
                onSelect={(outputCurrency) => onCurrencySelection(Field.OUTPUT, outputCurrency)}
                currencies={outputTokenList}
                priceImpact={inputPanelHelperText}
                priceImpactCss={inputPanelHelperText?.greaterThan(ZERO_PERCENT) ? 'text-green' : 'text-red'}
              />
              {recipient !== undefined ? (
                <>
                  <div className="relative left-9">
                    <ArrowDownIcon className="text-high-emphesis" strokeWidth={2} width={16} height={16} />
                  </div>
                  <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                  {recipient !== account && (
                    <div className="rounded p-4 border border-yellow/40">
                      <Typography variant="sm" weight={700}>
                        {i18n._(
                          t`Please note that the recipient address is different from the connected wallet address.`
                        )}
                      </Typography>
                    </div>
                  )}
                </>
              ) : undefined}
            </div>

            {/*<div className="flex flex-col items-end justify-between w-full gap-4 md:flex-row md:items-center">*/}
            {/*  <PriceRatio price={!!rate ? rate : trade?.executionPrice} />*/}
            {/*  {isExpertMode && recipient === undefined && (*/}
            {/*    <div className={`flex flex-1 ${inputCurrency && outputCurrency ? 'justify-center' : ''}`}>*/}
            {/*      <div*/}
            {/*        className="flex items-center text-sm underline cursor-pointer text-blue"*/}
            {/*        onClick={() => onChangeRecipient('')}*/}
            {/*      >*/}
            {/*        {i18n._(t`Change Recipient`)}*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  )}*/}
            {/*  {!(inputCurrency && outputCurrency) && !(isExpertMode && recipient === undefined) && (*/}
            {/*    <div className="flex flex-1" />*/}
            {/*  )}*/}

            {/*  <OrderExpirationDropdown />*/}
            {/*</div>*/}

            <LimitOrderButton trade={trade} parsedAmounts={parsedAmounts} />
            <LimitOrderReviewModal
              parsedAmounts={parsedAmounts}
              trade={trade}
              limitPrice={!!rate ? rate : trade?.executionPrice}
            />
          </div>
        </DoubleGlowShadow>
      </ExpertModePanel>
    </Container>
  )
}

LimitOrder.Guard = NetworkGuard(Feature.LIMIT_ORDERS)

export default LimitOrder
