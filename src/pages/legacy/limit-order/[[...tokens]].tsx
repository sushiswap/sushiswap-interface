import { SwitchVerticalIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Percent } from '@sushiswap/core-sdk'
import limitOrderPairList from '@sushiswap/limit-order-pair-list/dist/limit-order.pairlist.json'
import Container from 'app/components/Container'
import DoubleGlowShadow from 'app/components/DoubleGlowShadow'
import Typography from 'app/components/Typography'
import { ZERO_PERCENT } from 'app/constants'
import { Feature } from 'app/enums'
import LimitOrderApprovalCheck from 'app/features/legacy/limit-order/LimitOrderApprovalCheck'
import LimitOrderButton from 'app/features/legacy/limit-order/LimitOrderButton'
import LimitOrderRecipientField from 'app/features/legacy/limit-order/LimitOrderRecipientField'
import LimitOrderReviewModal from 'app/features/legacy/limit-order/LimitOrderReviewModal'
import LimitPriceInputPanel from 'app/features/legacy/limit-order/LimitPriceInputPanel'
import OrderExpirationDropdown from 'app/features/legacy/limit-order/OrderExpirationDropdown'
import HeaderNew from 'app/features/trade/HeaderNew'
import SwapAssetPanel from 'app/features/trident/swap/SwapAssetPanel'
import NetworkGuard from 'app/guards/Network'
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
import React, { useMemo } from 'react'

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
  const { chainId } = useActiveWeb3React()
  const [isExpertMode] = useExpertModeManager()
  const { typedField, typedValue, fromBentoBalance } = useLimitOrderState()
  const { inputCurrency, outputCurrency } = useLimitOrderDerivedCurrencies()
  const trade = useLimitOrderDerivedTrade()
  const rate = useLimitOrderDerivedLimitPrice()
  const parsedAmounts = useLimitOrderDerivedParsedAmounts({ rate, trade })
  const { onSwitchTokens, onCurrencySelection, onUserInput } = useLimitOrderActionHandlers()

  const pairs = useMemo(
    // @ts-ignore TYPE NEEDS FIXING
    () => (limitOrderPairList.pairs[chainId || 1] || []).map(([token0, token1]) => [token0.address, token1.address]),
    [chainId]
  )

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
    <>
      <LimitOrderApprovalCheck />
      <Container id="limit-order-page" className="py-4 md:py-12 lg:py-[120px]" maxWidth="md">
        <DoubleGlowShadow>
          <div id="limit-order-page" className="flex flex-col gap-3 p-4 rounded-[24px] bg-dark-800">
            <div className="px-2">
              <HeaderNew inputCurrency={inputCurrency} outputCurrency={outputCurrency} />
            </div>
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
              <div className="flex gap-3">
                <div className="flex flex-1">
                  <LimitPriceInputPanel trade={trade} limitPrice={!!rate ? rate : trade?.executionPrice} />
                </div>
                <SwitchVerticalIcon
                  width={18}
                  className="mt-6 cursor-pointer text-secondary hover:text-white"
                  onClick={onSwitchTokens}
                />
                <div className="flex flex-1">
                  <OrderExpirationDropdown />
                </div>
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
            </div>

            {isExpertMode && <LimitOrderRecipientField />}
            <LimitOrderButton trade={trade} parsedAmounts={parsedAmounts} />
            <LimitOrderReviewModal
              parsedAmounts={parsedAmounts}
              trade={trade}
              limitPrice={!!rate ? rate : trade?.executionPrice}
            />
          </div>
          <Typography variant="xs" className="px-10 mt-5 italic text-center text-low-emphesis">
            {i18n._(
              t`Limit orders use funds from BentoBox, to create a limit order depositing into BentoBox is required.`
            )}
          </Typography>
        </DoubleGlowShadow>
      </Container>
    </>
  )
}

LimitOrder.Guard = NetworkGuard(Feature.LIMIT_ORDERS)

export default LimitOrder
