import OpenOrders from 'app/features/legacy/limit-order/OpenOrders'
import { useCurrency } from 'app/hooks/Tokens'
import ProLayout from 'app/layouts/ProLayout'
import { useActiveWeb3React } from 'app/services/web3'
import dynamic from 'next/dynamic'
import { Responsive, WidthProvider } from 'react-grid-layout'
const ResponsiveGridLayout = WidthProvider(Responsive)
const TestNoSSR = dynamic(() => import('../../../components/TradingViewComponent/index'), { ssr: false })
import { LimitOrderMode } from 'app/features/legacy/limit-order/types'
import { classNames } from 'app/functions'
import { FC } from 'react'

import LimitOrder from './[[...tokens]]'

const Box: FC<{ className?: string }> = ({ children, className }) => {
  return <div className={classNames('bg-dark-1000', className)}>{children}</div>
}

const layouts = {
  lg: [
    { i: 'chart', x: 0, y: 0, w: 9, h: 6 },
    { i: 'order', x: 9, y: 0, w: 3, h: 6 },
    { i: 'openOrders', x: 0, y: 3, w: 9, h: 2 },
  ],
  md: [
    { i: 'chart', x: 0, y: 0, w: 7, h: 9, static: true },
    { i: 'order', x: 5, y: 0, w: 4, h: 3 },
    { i: 'openOrders', x: 4, y: 0, w: 1, h: 2 },
  ],
  sm: [
    { i: 'chart', x: 0, y: 0, w: 9, h: 9, static: true },
    { i: 'order', x: 3, y: 0, w: 3, h: 3 },
    { i: 'openOrders', x: 4, y: 0, w: 1, h: 2 },
  ],
  xs: [
    { i: 'chart', x: 0, y: 0, w: 9, h: 9, static: true },
    { i: 'order', x: 3, y: 0, w: 3, h: 3 },
    { i: 'openOrders', x: 4, y: 0, w: 1, h: 2 },
  ],
  xxs: [
    { i: 'chart', x: 0, y: 0, w: 9, h: 9, static: true },
    { i: 'order', x: 3, y: 0, w: 3, h: 3 },
    { i: 'openOrders', x: 4, y: 0, w: 1, h: 2 },
  ],
}

const Pro = () => {
  const { chainId } = useActiveWeb3React()
  const a = useCurrency('0x0da67235dd5787d67955420c84ca1cecd4e5bb3b')
  const b = useCurrency('0x130966628846bfd36ff31a822705796e8cb8c18d')
  const [token0, token1] = a && b && a.wrapped.sortsBefore(b.wrapped) ? [a, b] : [b, a]

  if (!token0 || !token1) {
    return <></>
  }

  return (
    <div className="m-0 min-w-0 place-items-stretch w-full h-full">
      <ResponsiveGridLayout
        className="relative transition-[height] bg-dark-800"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        containerPadding={[0, 0]}
        margin={[1, 1]}
      >
        <div key="chart">
          <Box>
            <TestNoSSR
              id="tv-chart"
              symbol={`SUSHISWAP:${token0.symbol}/${
                token1.symbol
              }:${chainId}:${token0.wrapped.address.toLowerCase()}:${token1.wrapped.address.toLowerCase()}`}
            />
          </Box>
        </div>
        <div key="order">
          <Box className="p-4">
            <LimitOrder mode={LimitOrderMode.pro} />
          </Box>
        </div>
        <div key="openOrders">
          <Box>
            <OpenOrders mode={LimitOrderMode.pro} />
          </Box>
        </div>
      </ResponsiveGridLayout>
    </div>
  )
}

Pro.Layout = ProLayout
export default Pro
