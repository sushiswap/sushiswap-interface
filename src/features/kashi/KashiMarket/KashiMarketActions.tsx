import { Menu, Transition } from '@headlessui/react'
import { DotsVerticalIcon } from '@heroicons/react/solid'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { JSBI, Percent } from '@sushiswap/core-sdk'
import { ACTION_ACCRUE } from '@sushiswap/kashi-sdk'
import QuestionHelper from 'app/components/QuestionHelper'
import Typography from 'app/components/Typography'
import { KashiCooker } from 'app/entities'
import { useKashiMarket } from 'app/features/kashi/KashiMarket/KashiMarketContext'
import { ZERO } from 'app/functions'
import useKashiApproveCallback from 'app/hooks/useKashiApproveCallback'
import React, { FC, Fragment, useCallback, useMemo } from 'react'

export const KashiMarketActions: FC = () => {
  const { market } = useKashiMarket()
  const [, , , , onCook] = useKashiApproveCallback()

  const onUpdatePrice = useCallback(async (cooker: KashiCooker) => {
    cooker.updateExchangeRate(false, ZERO, ZERO)
    return i18n._(t`Update Price`)
  }, [])

  const onAccrue = useCallback(async (cooker: KashiCooker) => {
    cooker.add(ACTION_ACCRUE, '0x00')
    return i18n._(t`Accrue`)
  }, [])

  const priceChange = useMemo(() => {
    const currentPrice = JSBI.divide(market.exchangeRate, JSBI.BigInt(1e18))
    const oraclePrice = JSBI.divide(market.oracleExchangeRate, JSBI.BigInt(1e18))
    return new Percent(JSBI.subtract(currentPrice, oraclePrice), oraclePrice)?.toSignificant(2)
  }, [market])

  return (
    <Menu as="div">
      <div>
        <Menu.Button>
          <div className="rounded-full hover:bg-dark-700 flex items-center justify-center p-3 cursor-pointer hover:text-white">
            <DotsVerticalIcon width={18} height={18} />
          </div>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          static
          className="shadow-md absolute max-h-[240px] overflow-auto border mt-2 divide-y rounded focus:outline-none border-dark-600 bg-dark-700 divide-dark-600"
        >
          <Menu.Item onClick={() => onCook(market, onAccrue)}>
            <Typography variant="sm" weight={700} className="flex px-3 py-2 cursor-pointer hover:bg-dark-900/40">
              {i18n._(t`Accrue`)}
              <QuestionHelper
                text={
                  <div className="flex flex-col gap-2">
                    <Typography variant="xs" className="text-white">
                      {i18n._(t`Accrue the interest rate on borrowed tokens and update the interest rate`)}
                    </Typography>
                  </div>
                }
              />
            </Typography>
          </Menu.Item>
          <Menu.Item onClick={() => onCook(market, onUpdatePrice)}>
            <Typography variant="sm" weight={700} className="flex px-3 py-2 cursor-pointer hover:bg-dark-900/40">
              {i18n._(t`Update Price`)}
              <QuestionHelper
                text={
                  <div className="flex flex-col gap-2">
                    <Typography variant="xs" className="text-white">
                      {i18n._(t`Update the oracle exchange rate`)}
                    </Typography>
                    <Typography variant="xs" className="italic">
                      {i18n._(t`Current deviation: ${priceChange}%`)}
                    </Typography>
                  </div>
                }
              />
            </Typography>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
