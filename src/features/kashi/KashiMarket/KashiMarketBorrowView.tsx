import { ArrowDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, Fraction, ZERO } from '@sushiswap/core-sdk'
import { KashiMarketBorrowDetailsView } from 'app/features/kashi/KashiMarket/index'
import KashiMarketBorrowLeverageView from 'app/features/kashi/KashiMarket/KashiMarketBorrowLeverageView'
import useMaxBorrow from 'app/features/kashi/KashiMarket/useMaxBorrow'
import { KashiMarket } from 'app/features/kashi/types'
import SwapAssetPanel from 'app/features/trident/swap/SwapAssetPanel'
import { tryParseAmount } from 'app/functions'
import { useCurrency } from 'app/hooks/Tokens'
import React, { FC, useCallback, useState } from 'react'

interface KashiMarketBorrowView {
  market: KashiMarket
}

const KashiMarketBorrowView: FC<KashiMarketBorrowView> = ({ market }) => {
  const { i18n } = useLingui()
  const [leverage, setLeverage] = useState<boolean>(false)
  const [spendFromWallet, setSpendFromWallet] = useState<boolean>(true)
  const [receiveInWallet, setReceiveInWallet] = useState<boolean>(true)

  const collateral = useCurrency(market.collateral.address) ?? undefined
  const [collateralAmount, setCollateralAmount] = useState<string>()

  const asset = useCurrency(market.asset.address) ?? undefined
  const [borrowAmount, setBorrowAmount] = useState<string>()
  const [leveragedAmount, setLeveragedAmount] = useState<string>()

  const borrowAmountCurrencyAmount =
    tryParseAmount(borrowAmount || '0', asset) ?? (asset ? CurrencyAmount.fromRawAmount(asset, '0') : undefined)
  const collateralAmountCurrencyAmount =
    tryParseAmount(collateralAmount || '0', collateral) ??
    (collateral ? CurrencyAmount.fromRawAmount(collateral, '0') : undefined)

  const maxBorrow = useMaxBorrow({
    leveraged: leverage,
    borrowAmount: borrowAmountCurrencyAmount,
    collateralAmount: collateralAmountCurrencyAmount,
    market,
  })

  const onMultiply = (multiplier: string) => {
    if (!collateral || !asset || !collateralAmountCurrencyAmount) return

    const multiplied = collateralAmountCurrencyAmount
      .add(
        collateralAmountCurrencyAmount
          .multiply(multiplier.toBigNumber(collateral.decimals).toString())
          .divide('1'.toBigNumber(collateral.decimals).toString())
      )
      .multiply(new Fraction(75, 100))
      .divide(market.currentExchangeRate.toString())

    setLeveragedAmount(multiplied.asFraction.toFixed(asset.decimals))
  }

  const handleSetBorrowAmount = useCallback((value: string) => {
    setLeveragedAmount(undefined)
    setBorrowAmount(value)
  }, [])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <SwapAssetPanel
          error={false}
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
          error={false}
          header={(props) => <SwapAssetPanel.Header {...props} label={i18n._(t`Borrow`)} />}
          walletToggle={(props) => (
            <SwapAssetPanel.Switch
              id={`switch-classic-withdraw-from-0}`}
              {...props}
              label={i18n._(t`Receive in`)}
              onChange={() => setReceiveInWallet((prev) => !prev)}
            />
          )}
          spendFromWallet={receiveInWallet}
          currency={asset}
          value={leverage ? leveragedAmount : borrowAmount}
          onChange={leverage ? setLeveragedAmount : handleSetBorrowAmount}
          currencies={[]}
        />
      </div>
      {collateralAmountCurrencyAmount?.greaterThan(ZERO) && borrowAmountCurrencyAmount?.greaterThan(ZERO) && (
        <KashiMarketBorrowLeverageView
          market={market}
          enabled={leverage}
          onSwitch={() => setLeverage((prev) => !prev)}
          onChange={onMultiply}
        />
      )}
      <KashiMarketBorrowDetailsView market={market} />
    </div>
  )
}

export default KashiMarketBorrowView
