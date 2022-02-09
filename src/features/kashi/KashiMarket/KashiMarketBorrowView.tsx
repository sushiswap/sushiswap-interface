import { Transition } from '@headlessui/react'
import { ArrowDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, ZERO } from '@sushiswap/core-sdk'
import { LTV } from 'app/features/kashi/constants'
import { KashiMarketBorrowDetailsView } from 'app/features/kashi/KashiMarket/index'
import KashiMarketBorrowButton from 'app/features/kashi/KashiMarket/KashiMarketBorrowButton'
import KashiMarketBorrowLeverageView from 'app/features/kashi/KashiMarket/KashiMarketBorrowLeverageView'
import useMaxBorrow from 'app/features/kashi/KashiMarket/useMaxBorrow'
import { KashiMarket } from 'app/features/kashi/types'
import SwapAssetPanel from 'app/features/trident/swap/SwapAssetPanel'
import { tryParseAmount } from 'app/functions'
import { useCurrency } from 'app/hooks/Tokens'
import React, { FC, useCallback, useMemo, useRef, useState } from 'react'

interface KashiMarketBorrowView {
  market: KashiMarket
}

const KashiMarketBorrowView: FC<KashiMarketBorrowView> = ({ market }) => {
  const { i18n } = useLingui()

  const inputRef = useRef<HTMLInputElement>(null)
  const [leverage, setLeverage] = useState<boolean>(false)
  const [spendFromWallet, setSpendFromWallet] = useState<boolean>(true)
  const [receiveInWallet, setReceiveInWallet] = useState<boolean>(true)

  const collateral = useCurrency(market.collateral.address) ?? undefined
  const asset = useCurrency(market.asset.address) ?? undefined

  const [collateralAmount, setCollateralAmount] = useState<string>()
  const [borrowAmount, setBorrowAmount] = useState<string>()

  const borrowAmountCurrencyAmount = useMemo(
    () => tryParseAmount(borrowAmount || '0', asset) ?? (asset ? CurrencyAmount.fromRawAmount(asset, '0') : undefined),
    [asset, borrowAmount]
  )
  const collateralAmountCurrencyAmount = useMemo(
    () =>
      tryParseAmount(collateralAmount || '0', collateral) ??
      (collateral ? CurrencyAmount.fromRawAmount(collateral, '0') : undefined),
    [collateral, collateralAmount]
  )
  const { maxBorrow, priceImpact } = useMaxBorrow({
    leveraged: leverage,
    borrowAmount: borrowAmountCurrencyAmount,
    collateralAmount: collateralAmountCurrencyAmount,
    market,
  })

  const onMultiply = useCallback(
    (multiplier: string, persist: boolean = false) => {
      if (!collateral || !asset || !collateralAmountCurrencyAmount) return

      const multiplied = collateralAmountCurrencyAmount
        .add(
          collateralAmountCurrencyAmount
            .multiply(multiplier.toBigNumber(collateral.decimals).toString())
            .divide('1'.toBigNumber(collateral.decimals).toString())
        )
        .multiply(LTV)
        .divide(market.currentExchangeRate.toString())

      if (inputRef.current) {
        inputRef.current.value = multiplied.asFraction.toSignificant(6)
      }

      if (persist) {
        setBorrowAmount(multiplied.asFraction.toSignificant(6))
      }
    },
    [asset, collateral, collateralAmountCurrencyAmount, inputRef, market.currentExchangeRate]
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <SwapAssetPanel
          error={borrowAmountCurrencyAmount && maxBorrow ? borrowAmountCurrencyAmount.greaterThan(maxBorrow) : false}
          header={(props) => <SwapAssetPanel.Header {...props} label={i18n._(t`Deposit`)} />}
          walletToggle={(props) => (
            <SwapAssetPanel.Switch
              id={`switch-classic-withdraw-from-0}`}
              {...props}
              label={i18n._(t`Deposit from`)}
              onChange={() => setSpendFromWallet((prev) => !prev)}
            />
          )}
          spendFromWallet={spendFromWallet}
          currency={collateral}
          value={collateralAmount}
          onChange={setCollateralAmount}
          currencies={[]}
        />
      </div>
      <div className="flex justify-center relative lg:mt-[-23px] lg:mb-[-23px]">
        <div className="rounded-full lg:border-2 lg:border-dark-800 hover:lg:border-dark-700 hover:text-white bg-dark-900 p-1.5 cursor-pointer">
          <ArrowDownIcon width={12} height={12} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <SwapAssetPanel
          ref={inputRef}
          error={false}
          header={(props) => <SwapAssetPanel.Header {...props} label={i18n._(t`Borrow`)} />}
          walletToggle={(props) => (
            <Transition
              show={!leverage}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-100 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <SwapAssetPanel.Switch
                id={`switch-classic-withdraw-from-0}`}
                {...props}
                label={i18n._(t`Receive in`)}
                onChange={() => setReceiveInWallet((prev) => !prev)}
              />
            </Transition>
          )}
          spendFromWallet={receiveInWallet}
          currency={asset}
          value={borrowAmount}
          onChange={setBorrowAmount}
          currencies={[]}
        />
      </div>
      {collateralAmountCurrencyAmount?.greaterThan(ZERO) && (
        <KashiMarketBorrowLeverageView
          borrowAmount={borrowAmountCurrencyAmount}
          collateralAmount={collateralAmountCurrencyAmount}
          market={market}
          enabled={leverage}
          onSwitch={() => setLeverage((prev) => !prev)}
          onChange={(val) => onMultiply(val, false)}
          afterChange={(val) => onMultiply(val, true)}
        />
      )}
      <KashiMarketBorrowDetailsView
        priceImpact={leverage ? priceImpact : undefined}
        market={market}
        borrowAmount={borrowAmountCurrencyAmount}
        collateralAmount={collateralAmountCurrencyAmount}
      />
      <KashiMarketBorrowButton
        borrowAmount={borrowAmountCurrencyAmount}
        market={market}
        collateralAmount={collateralAmountCurrencyAmount}
        spendFromWallet={spendFromWallet}
        maxBorrow={maxBorrow}
        leveraged={leverage}
        receiveInWallet={receiveInWallet}
      />
    </div>
  )
}

export default KashiMarketBorrowView
