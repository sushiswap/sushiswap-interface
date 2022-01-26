import { useCurrency } from 'app/hooks/Tokens'
import ProLayout from 'app/layouts/ProLayout'
import { useActiveWeb3React } from 'app/services/web3'
import dynamic from 'next/dynamic'
const TestNoSSR = dynamic(() => import('../../../components/TradingViewComponent/index'), { ssr: false })
import { Tab } from '@headlessui/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import CompletedOrders from 'app/features/legacy/limit-order/CompletedOrders'
import OpenOrders from 'app/features/legacy/limit-order/OpenOrders'
import RecentTrades from 'app/features/legacy/limit-order/RecentTrades'
import { LimitOrderMode } from 'app/features/legacy/limit-order/types'
import { classNames } from 'app/functions'
import { FC, Fragment } from 'react'

import LimitOrder from './[[...tokens]]'

const Box: FC<{ className?: string }> = ({ children, className }) => {
  return <div className={classNames(className)}>{children}</div>
}

const Pro = () => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const a = useCurrency('0x0da67235dd5787d67955420c84ca1cecd4e5bb3b')
  const b = useCurrency('0x130966628846bfd36ff31a822705796e8cb8c18d')
  const [token0, token1] = a && b && a.wrapped.sortsBefore(b.wrapped) ? [a, b] : [b, a]

  if (!token0 || !token1) {
    return <></>
  }

  return (
    <div className="flex divide-x divide-y divide-dark-700 flex-grow overflow-hidden">
      <div className="max-w-[340px] min-w-[340px] bg-dark-850 border-t border-dark-700">
        <Box className="scale-[90%]">
          <LimitOrder mode={LimitOrderMode.pro} />
        </Box>
      </div>
      <div className="flex flex-col flex-1 flex-grow divide-y divide-dark-700">
        <TestNoSSR
          id="tv-chart"
          symbol={`SUSHISWAP:${token0.symbol}/${
            token1.symbol
          }:${chainId}:${token0.wrapped.address.toLowerCase()}:${token1.wrapped.address.toLowerCase()}`}
        />
        <div className="bg-dark-900 h-[400px] min-h-[400px] p-2">
          <Tab.Group>
            <Tab.List className="flex gap-2 pb-2">
              <Tab as={Fragment}>
                {({ selected }) => (
                  <Typography
                    variant="sm"
                    weight={700}
                    className={classNames(
                      selected ? 'text-high-emphesis bg-dark-800' : 'text-secondary',
                      'py-2 px-4 hover:bg-dark-800 active:bg-dark-850 rounded-full'
                    )}
                  >
                    Open Orders
                  </Typography>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <Typography
                    variant="sm"
                    weight={700}
                    className={classNames(
                      selected ? 'text-high-emphesis bg-dark-800' : 'text-secondary',
                      'py-2 px-4 hover:bg-dark-800 active:bg-dark-850 rounded-full'
                    )}
                  >
                    {i18n._(t`Order History`)}
                  </Typography>
                )}
              </Tab>
            </Tab.List>
            <Tab.Panels className="px-2 bg-dark-900">
              <Tab.Panel>
                <OpenOrders mode={LimitOrderMode.pro} />
              </Tab.Panel>
              <Tab.Panel>
                <CompletedOrders mode={LimitOrderMode.pro} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
      <div className="max-w-[340px] min-w-[340px] bg-dark-900 border-t border-dark-1000 overflow-hidden h-full">
        <RecentTrades />
      </div>
    </div>
  )
}

Pro.Layout = ProLayout

export default Pro
