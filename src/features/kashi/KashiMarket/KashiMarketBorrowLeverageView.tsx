import { Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, Fraction } from '@sushiswap/core-sdk'
import CloseIcon from 'app/components/CloseIcon'
import QuestionHelper from 'app/components/QuestionHelper'
import Slider from 'app/components/Slider'
import Switch from 'app/components/Switch'
import Typography from 'app/components/Typography'
import { KashiMarket } from 'app/features/kashi/types'
import { classNames } from 'app/functions'
import { useUSDCPrice } from 'app/hooks'
import { useCurrency } from 'app/hooks/Tokens'
import React, { FC, useCallback, useState } from 'react'

const LTV = 75
const LIQUIDATION_MULTIPLIER = 200 - LTV

const LeverageColor = (x: number) => {
  if (x < 1) return 'text-green'
  if (x < 1.5) return 'text-yellow'
  return 'text-red'
}

interface KashiMarketBorrowLeverageView {
  market: KashiMarket
  onChange(x: string): void
  enabled: boolean
  onSwitch(): void
}

const KashiMarketBorrowLeverageView: FC<KashiMarketBorrowLeverageView> = ({ enabled, onSwitch, market, onChange }) => {
  const { i18n } = useLingui()
  const [range, setRange] = useState<number>(0.5)
  const asset = useCurrency(market.asset.address) ?? undefined
  const collateral = useCurrency(market.collateral.address) ?? undefined
  const usdcPrice = useUSDCPrice(asset)

  const handleChange = useCallback(
    (value: number) => {
      setRange(value)
      onChange(value.toString())
    },
    [onChange]
  )

  const borrowPart = asset ? CurrencyAmount.fromRawAmount(asset, market.userBorrowPart.toString()) : undefined
  const collateralShare = collateral
    ? CurrencyAmount.fromRawAmount(collateral, market.userCollateralShare.toString())
    : undefined
  const quote = borrowPart && usdcPrice ? usdcPrice.quote(borrowPart) : undefined
  const share = quote && collateralShare ? quote.divide(collateralShare) : undefined
  const liquidationRatio = share && usdcPrice ? share.multiply(usdcPrice.invert()) : undefined
  const liquidationPrice = liquidationRatio?.multiply(new Fraction(LIQUIDATION_MULTIPLIER, 100))

  return (
    <div
      className={classNames(
        enabled ? 'bg-dark-900' : '',
        'flex flex-col gap-3 border rounded border-dark-700 py-2 pr-3 pl-4'
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <Typography variant="sm" weight={700} className="flex items-center">
          {i18n._(t`Leverage position`)}
          <QuestionHelper
            text={
              <div className="flex flex-col gap-2">
                <Typography variant="xs">
                  {i18n._(
                    t`Leverage your position by swapping the received borrowed ${market.asset.symbol} for ${market.collateral.symbol} and use that as extra collateral to borrow more ${market.asset.symbol}.`
                  )}
                </Typography>
                <Typography variant="xs" className="italic">
                  {i18n._(t`Please note that you won't receive any tokens when you use leverage.`)}
                </Typography>
              </div>
            }
          />
        </Typography>
        <Switch
          size="sm"
          id="toggle-expert-mode-button"
          checked={enabled}
          onChange={onSwitch}
          checkedIcon={<CheckIcon className="text-dark-700" />}
          uncheckedIcon={<CloseIcon />}
          color="gradient"
        />
      </div>
      <Transition
        show={enabled}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
      >
        <div className="flex flex-col">
          <div className="pt-2 pb-5">
            <Slider
              value={range}
              onChange={handleChange}
              marks={[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]}
              min={0.25}
              max={2}
              step={0.25}
              defaultValue={0.5}
              markFormatter={(mark) => `${mark}x`}
            />
          </div>
          <div className="flex justify-between gap-4">
            <Typography variant="xs">{i18n._(t`Liquidation Price`)}</Typography>
            <Typography variant="sm" weight={700} className={classNames(LeverageColor(range))}>
              {range.toFixed(2)}x
            </Typography>
          </div>
          <div className="flex justify-between gap-4">
            <Typography variant="xs">{i18n._(t`Position Leverage`)}</Typography>
            <Typography variant="xs" weight={700} className={classNames(LeverageColor(range))}>
              {liquidationPrice?.toSignificant(6)} {liquidationPrice?.currency.symbol}
            </Typography>
          </div>
        </div>
      </Transition>
    </div>
  )
}

export default KashiMarketBorrowLeverageView
