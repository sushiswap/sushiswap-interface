import { ArrowDownIcon } from '@heroicons/react/outline'
import { ExclamationIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import limitOrderPairList from '@sushiswap/limit-order-pair-list/dist/limit-order.pairlist.json'
import swapArrowsAnimationData from 'app/animation/swap-arrows.json'
import AddressInputPanel from 'app/components/AddressInputPanel'
import Alert from 'app/components/Alert'
import Container from 'app/components/Container'
import DoubleGlowShadow from 'app/components/DoubleGlowShadow'
import ExpertModePanel from 'app/components/ExpertModePanel'
import Typography from 'app/components/Typography'
import { Feature } from 'app/enums'
import BalancePanel from 'app/features/legacy/limit-order/BalancePanel'
import CurrencyInput from 'app/features/legacy/limit-order/CurrencyInput'
import CurrencyInputPanel from 'app/features/legacy/limit-order/CurrencyInputPanel'
import CurrencySelect from 'app/features/legacy/limit-order/CurrencySelect'
import LimitOrderButton from 'app/features/legacy/limit-order/LimitOrderButton'
import LimitPriceInputPanel from 'app/features/legacy/limit-order/LimitPriceInputPanel'
import OrderExpirationDropdown from 'app/features/legacy/limit-order/OrderExpirationDropdown'
import PayFromToggle from 'app/features/legacy/limit-order/PayFromToggle'
import PriceRatio from 'app/features/legacy/limit-order/PriceRatio'
import ExchangeHeader from 'app/features/trade/Header'
import { maxAmountSpend } from 'app/functions'
import NetworkGuard from 'app/guards/Network'
import { useBentoOrWalletBalances } from 'app/hooks/useBentoOrWalletBalance'
import { useActiveWeb3React } from 'app/services/web3'
import useLimitOrderDerivedCurrencies, {
  useLimitOrderActionHandlers,
  useLimitOrderDerivedLimitPrice,
  useLimitOrderDerivedParsedAmounts,
  useLimitOrderDerivedTrade,
  useLimitOrderState,
} from 'app/state/limit-order/hooks'
import { Field } from 'app/state/swap/actions'
import { useExpertModeManager } from 'app/state/user/hooks'
import Lottie from 'lottie-react'
import Head from 'next/head'
import React, { useCallback, useMemo, useState } from 'react'

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

function LimitOrder() {
  const { i18n } = useLingui()
  const { chainId, account } = useActiveWeb3React()
  const [isExpertMode, toggleExpertMode] = useExpertModeManager()
  const { independentField, typedValue, recipient, fromBentoBalance } = useLimitOrderState()
  const { inputCurrency, outputCurrency } = useLimitOrderDerivedCurrencies()
  const parsedAmounts = useLimitOrderDerivedParsedAmounts()
  const trade = useLimitOrderDerivedTrade()
  const limitPrice = useLimitOrderDerivedLimitPrice()
  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useLimitOrderActionHandlers()
  const [animateSwapArrows, setAnimateSwapArrows] = useState<boolean>(false)
  const pairs = useMemo(
    () => (limitOrderPairList.pairs[chainId || 1] || []).map(([token0, token1]) => [token0.address, token1.address]),
    [chainId]
  )
  const [walletBalance, bentoBalance] = useBentoOrWalletBalances(
    account ?? undefined,
    [inputCurrency, inputCurrency],
    [true, false]
  )

  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }
  const maxAmountInput = maxAmountSpend(walletBalance)
  const atMaxAmountInput = bentoBalance
    ? Boolean(
        fromBentoBalance
          ? parsedAmounts[Field.INPUT]?.equalTo(bentoBalance)
          : maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput)
      )
    : undefined

  const handleMaxInput = useCallback(() => {
    if (fromBentoBalance) {
      bentoBalance && onUserInput(Field.INPUT, bentoBalance.toExact())
    } else {
      maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [bentoBalance, fromBentoBalance, maxAmountInput, onUserInput])

  const inputPanelError = useMemo(() => {
    const currentPrice = trade?.executionPrice
    if (limitPrice && currentPrice && !limitPrice.greaterThan(currentPrice)) {
      return i18n._(t`This transaction is below market rate`)
    }

    if (
      pairs &&
      inputCurrency &&
      outputCurrency &&
      !pairs.find((el) => areEqual(el, [inputCurrency.wrapped.address, outputCurrency.wrapped.address]))
    ) {
      return 'Invalid pair'
    }
  }, [i18n, inputCurrency, limitPrice, outputCurrency, pairs, trade?.executionPrice])

  const inputTokenList = useMemo(() => {
    if (pairs.length === 0) return []
    return pairs.reduce((acc, [token0, token1]) => {
      acc.push(token0)
      acc.push(token1)
      return acc
    }, [])
  }, [pairs])

  const outputTokenList = useMemo(() => {
    if (pairs.length === 0) return []
    if (inputCurrency) {
      return pairs.reduce((acc, [token0, token1]) => {
        if (inputCurrency.wrapped.address === token0) acc.push(token1)
        if (inputCurrency.wrapped.address === token1) acc.push(token0)
        return acc
      }, [])
    }
    return pairs.reduce((acc, [token0, token1]) => {
      acc.push(token0)
      acc.push(token1)
      return acc
    }, [])
  }, [inputCurrency, pairs])

  return (
    <Container id="limit-order-page" className="py-4 space-y-6 md:py-8 lg:py-12" maxWidth="2xl">
      <Head>
        <title>{i18n._(t`Limit order`)} | Sushi</title>
      </Head>
      <ExpertModePanel
        active={isExpertMode}
        onClose={() => {
          onChangeRecipient(undefined)
          toggleExpertMode()
        }}
      >
        <DoubleGlowShadow>
          <div id="limit-order-page" className="flex flex-col gap-4 p-4 rounded bg-dark-900">
            <ExchangeHeader input={inputCurrency} output={outputCurrency} />
            <div className="flex flex-col gap-4">
              <CurrencyInputPanel
                className="rounded-t"
                id="swap-currency-input"
                topAdornment={<PayFromToggle />}
                bottomAdornment={<BalancePanel />}
                selectComponent={
                  <CurrencySelect
                    currency={inputCurrency}
                    otherCurrency={outputCurrency}
                    label={i18n._(t`You pay`)}
                    onSelect={(inputCurrency) => onCurrencySelection(Field.INPUT, inputCurrency)}
                    currencyList={inputTokenList}
                    allowManageTokenList={false}
                  />
                }
                inputComponent={
                  <CurrencyInput
                    id="token-amount-input"
                    onMax={handleMaxInput}
                    showMaxButton={!atMaxAmountInput}
                    onUserInput={(value) => onUserInput(Field.INPUT, value)}
                    value={formattedAmounts[Field.INPUT]}
                  />
                }
              />
              <div className="flex flex-row gap-5">
                <div />
                <div className="relative flex items-center">
                  <div className="z-0 absolute w-[2px] bg-dark-800 h-[calc(100%+32px)] top-[-16px] left-[calc(50%-1px)]" />
                  <button
                    className="z-10 rounded-full bg-dark-900 p-3px"
                    onClick={() => {
                      onSwitchTokens()
                    }}
                  >
                    <div
                      className="p-2 rounded-full bg-dark-800 hover:bg-dark-700"
                      onMouseEnter={() => setAnimateSwapArrows(true)}
                      onMouseLeave={() => setAnimateSwapArrows(false)}
                    >
                      <Lottie
                        animationData={swapArrowsAnimationData}
                        autoplay={animateSwapArrows}
                        loop={false}
                        className="w-[32px] h-[32px]"
                      />
                    </div>
                  </button>
                </div>
                <LimitPriceInputPanel trade={trade} />
              </div>
              <CurrencyInputPanel
                className="relative rounded z-1"
                id="swap-currency-input"
                selectComponent={
                  <CurrencySelect
                    disabled={!inputCurrency}
                    currency={outputCurrency}
                    otherCurrency={inputCurrency}
                    label={i18n._(t`You receive:`)}
                    onSelect={(outputCurrency) => onCurrencySelection(Field.OUTPUT, outputCurrency)}
                    currencyList={outputTokenList}
                    includeNativeCurrency={false}
                    allowManageTokenList={false}
                  />
                }
                inputComponent={
                  <CurrencyInput
                    id="token-amount-output"
                    showMaxButton={false}
                    onUserInput={(value) => onUserInput(Field.OUTPUT, value)}
                    value={formattedAmounts[Field.OUTPUT]}
                    error={inputPanelError}
                  />
                }
                bottomAdornment={
                  inputPanelError ? (
                    <div className="z-0 flex items-center justify-center py-2 -mt-2 rounded-b bg-red bg-opacity-20">
                      <div className="flex items-center gap-2 pt-2">
                        <ExclamationIcon className="text-red" width={24} height={24} />
                        <Typography variant="xs" weight={700}>
                          {inputPanelError}
                        </Typography>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )
                }
              />
              {recipient !== undefined ? (
                <>
                  <div className="relative left-9">
                    <ArrowDownIcon className="text-high-emphesis" strokeWidth={2} width={16} height={16} />
                  </div>
                  <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                  {recipient !== account && (
                    <Alert
                      type="warning"
                      dismissable={false}
                      showIcon
                      message={i18n._(
                        t`Please note that the recipient address is different from the connected wallet address.`
                      )}
                    />
                  )}
                </>
              ) : undefined}
            </div>

            <div className="flex flex-col items-end justify-between w-full gap-4 md:flex-row md:items-center">
              {inputCurrency && outputCurrency && (
                <div className="flex flex-1">
                  <PriceRatio trade={trade} />
                </div>
              )}
              {isExpertMode && recipient === undefined && (
                <div className={`flex flex-1 ${inputCurrency && outputCurrency ? 'justify-center' : ''}`}>
                  <div
                    className="flex items-center text-sm underline cursor-pointer text-blue"
                    onClick={() => onChangeRecipient('')}
                  >
                    {i18n._(t`Change Recipient`)}
                  </div>
                </div>
              )}
              {!(inputCurrency && outputCurrency) && !(isExpertMode && recipient === undefined) && (
                <div className="flex flex-1" />
              )}

              <OrderExpirationDropdown />
            </div>

            <div className="flex flex-col gap-3">
              <LimitOrderButton color="gradient" className="font-bold" />
            </div>
          </div>
        </DoubleGlowShadow>
      </ExpertModePanel>
    </Container>
  )
}

LimitOrder.Guard = NetworkGuard(Feature.LIMIT_ORDERS)

export default LimitOrder
