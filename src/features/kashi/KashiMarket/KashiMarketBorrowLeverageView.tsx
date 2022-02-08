import { Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import CloseIcon from 'app/components/CloseIcon'
import QuestionHelper from 'app/components/QuestionHelper'
import Slider from 'app/components/Slider'
import Switch from 'app/components/Switch'
import Typography from 'app/components/Typography'
import { KashiMarket } from 'app/features/kashi/types'
import { classNames } from 'app/functions'
import React, { FC, useCallback, useState } from 'react'

const LeverageColor = (x: number) => {
  if (x < 1) return 'text-green'
  if (x < 1.5) return 'text-yellow'
  return 'text-red'
}

interface KashiMarketBorrowLeverageView {
  market: KashiMarket
  borrowAmount?: string
  onChange(x: string): void
  enabled: boolean
  onSwitch(): void
}

const KashiMarketBorrowLeverageView: FC<KashiMarketBorrowLeverageView> = ({
  enabled,
  onSwitch,
  market,
  borrowAmount,
  onChange,
}) => {
  const { i18n } = useLingui()
  const [range, setRange] = useState<number>(0.5)

  const handleChange = useCallback(
    (value: number) => {
      setRange(value)
      onChange((Number(borrowAmount) * (range + 1)).toString())
    },
    [borrowAmount, onChange, range]
  )

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
              <div>
                <Typography variant="xs">
                  {i18n._(
                    t`Leverage your position by swapping the received borrowed ${market.asset.symbol} for ${market.collateral.symbol} and use that as extra collateral to borrow more ${market.asset.symbol}`
                  )}
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
            <Typography variant="xs" className="text-high-emphesis">
              {i18n._(t`Position Leverage`)}
            </Typography>
            <Typography variant="xs" className={classNames(LeverageColor(range))}>
              {range.toFixed(2)}x
            </Typography>
          </div>
          <Typography variant="xs">Insert leverage slide here</Typography>
          <Typography variant="xs">Insert liquidation price here</Typography>
        </div>
      </Transition>
    </div>
  )
}

export default KashiMarketBorrowLeverageView
