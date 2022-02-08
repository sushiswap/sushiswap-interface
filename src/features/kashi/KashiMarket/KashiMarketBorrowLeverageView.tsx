import { Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import CloseIcon from 'app/components/CloseIcon'
import QuestionHelper from 'app/components/QuestionHelper'
import Switch from 'app/components/Switch'
import Typography from 'app/components/Typography'
import { KashiMarket } from 'app/features/kashi/types'
import { classNames } from 'app/functions'
import React, { FC, useState } from 'react'

const LEVERAGE_OPTIONS = {
  0: {
    style: '',
    label: '0.2.5',
  },
  1: {
    style: '',
    label: '0.2.5',
  },
  2: {
    style: '',
    label: '0.2.5',
  },
  3: {
    style: '',
    label: '0.2.5',
  },
  4: {
    style: '',
    label: '0.2.5',
  },
  5: {
    style: '',
    label: '0.2.5',
  },
  6: {
    style: '',
    label: '0.2.5',
  },
}

interface KashiMarketBorrowLeverageView {
  market: KashiMarket
}

const KashiMarketBorrowLeverageView: FC<KashiMarketBorrowLeverageView> = ({ market }) => {
  const { i18n } = useLingui()
  const [leverage, setLeverage] = useState<boolean>(false)
  const [range, setRange] = useState<number>()

  return (
    <div
      className={classNames(
        leverage ? 'bg-dark-900' : '',
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
          checked={leverage}
          onChange={setLeverage}
          checkedIcon={<CheckIcon className="text-dark-700" />}
          uncheckedIcon={<CloseIcon />}
          color="gradient"
        />
      </div>
      <Transition
        show={leverage}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
      >
        <Typography variant="xs">Insert leverage slide here</Typography>
        <Typography variant="xs">Insert liquidation price here</Typography>
      </Transition>
    </div>
  )
}

export default KashiMarketBorrowLeverageView
