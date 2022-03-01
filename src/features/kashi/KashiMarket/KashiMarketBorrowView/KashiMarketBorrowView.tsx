import { Transition } from '@headlessui/react'
import { ArrowDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, Fraction, JSBI, ZERO } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import {
  KashiMarketBorrowButton,
  KashiMarketBorrowLeverageView,
  KashiMarketDetailsView,
  KashiMarketView,
  useMaxBorrow,
} from 'app/features/kashi/KashiMarket'
import { useKashiMarket } from 'app/features/kashi/KashiMarket/KashiMarketContext'
import { KashiMarketCurrentPosition } from 'app/features/kashi/KashiMarket/KashiMarketCurrentPosition'
import SwapAssetPanel from 'app/features/trident/swap/SwapAssetPanel'
import { e10, tryParseAmount, unwrappedToken } from 'app/functions'
import React, { FC, useCallback, useMemo, useRef, useState } from 'react'

interface KashiMarketBorrowView {}

export const KashiMarketBorrowView: FC<KashiMarketBorrowView> = () => {
  const { i18n } = useLingui()
  const { market } = useKashiMarket()

  const inputRef = useRef<HTMLInputElement>(null)
  const multiplierRef = useRef<Fraction>()

  const [leverage, setLeverage] = useState<boolean>(false)
  const [spendFromWallet, setSpendFromWallet] = useState<boolean>(true)
  const [receiveInWallet, setReceiveInWallet] = useState<boolean>(true)

  const collateral = unwrappedToken(market.collateral.token)
  const asset = unwrappedToken(market.asset.token)

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
      multiplierRef.current = new Fraction(
        JSBI.add(JSBI.BigInt(multiplier.toBigNumber(18)), JSBI.BigInt(0)),
        JSBI.BigInt(1e18)
      )

      const { numerator, denominator } = collateralAmountCurrencyAmount
        .add(
          collateralAmountCurrencyAmount
            .multiply(multiplier.toBigNumber(collateral.decimals).toString())
            .divide('1'.toBigNumber(collateral.decimals).toString())
        )
        .multiply(JSBI.BigInt(e10(16)))
        .multiply(JSBI.BigInt('75'))
        .divide(market.exchangeRate)

      const amount = CurrencyAmount.fromFractionalAmount(asset, numerator, denominator)
      if (inputRef.current) {
        inputRef.current.value = amount.toSignificant(6)
      }

      if (persist) {
        setBorrowAmount(amount.toSignificant(6))
      }
    },
    [asset, collateral, collateralAmountCurrencyAmount, market.exchangeRate]
  )

  return (
    <div className="flex flex-col gap-3">
      <KashiMarketCurrentPosition setBorrowAmount={setBorrowAmount} setCollateralAmount={setCollateralAmount} />
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
      <div className="flex justify-center relative lg:mt-[-23px] lg:mb-[-23px]">
        <div className="rounded-full lg:border-2 lg:border-dark-800 hover:lg:border-dark-700 hover:text-white bg-dark-900 p-1.5 cursor-pointer">
          <ArrowDownIcon width={12} height={12} />
        </div>
      </div>
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
        balancePanel={({ onChange }) => (
          <Typography variant="sm" className="text-secondary text-right" onClick={() => onChange(maxBorrow?.toExact())}>
            Max Borrow: {maxBorrow?.toSignificant(6)}
          </Typography>
        )}
      />
      {collateralAmountCurrencyAmount?.greaterThan(ZERO) && (
        <KashiMarketBorrowLeverageView
          borrowAmount={borrowAmountCurrencyAmount}
          collateralAmount={collateralAmountCurrencyAmount}
          enabled={leverage}
          onSwitch={() => setLeverage((prev) => !prev)}
          onChange={(val) => onMultiply(val, false)}
          afterChange={(val) => onMultiply(val, true)}
          multiplier={leverage ? multiplierRef.current : undefined}
        />
      )}
      <KashiMarketDetailsView
        priceImpact={leverage ? priceImpact : undefined}
        borrowAmount={borrowAmountCurrencyAmount}
        collateralAmount={collateralAmountCurrencyAmount}
        multiplier={leverage ? multiplierRef.current : undefined}
        view={KashiMarketView.BORROW}
      />
      <KashiMarketBorrowButton
        borrowAmount={borrowAmountCurrencyAmount}
        collateralAmount={collateralAmountCurrencyAmount}
        spendFromWallet={spendFromWallet}
        maxBorrow={maxBorrow}
        leveraged={leverage}
        receiveInWallet={receiveInWallet}
        view={KashiMarketView.BORROW}
      />
    </div>
  )
}
