import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Auction } from 'app/features/miso/context/Auction'
import useInterval from 'app/hooks/useInterval'
import { FC, useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

interface AuctionChartCrowdsaleProps {
  auction: Auction
}

const AuctionChartCrowdsale: FC<AuctionChartCrowdsaleProps> = ({ auction }) => {
  const { i18n } = useLingui()
  const startTime = auction.auctionInfo.startTime.mul('1000').toNumber()
  const endTime = auction.auctionInfo.endTime.mul('1000').toNumber()
  const now = Date.now()
  const [progression, setState] = useState<number>((now - startTime) / (endTime - startTime))

  useInterval(() => {
    setState((now - startTime) / (endTime - startTime))
  }, 1000)

  const bottomHeight = 60
  const padding = 28
  const topPadding = 20

  return (
    <div className="relative w-full h-full min-h-[234px]">
      <AutoSizer>
        {({ width, height }) => {
          const remainingHeight = height - bottomHeight
          return (
            <div className="relative">
              <svg
                className="text-green"
                width={width}
                height={remainingHeight}
                viewBox={`0 0 ${width} ${remainingHeight}`}
              >
                <circle r="6" cx={padding} cy={remainingHeight / 2} fill="currentColor" />
                <line
                  x1={padding}
                  y1={remainingHeight / 2}
                  x2={width - padding}
                  y2={remainingHeight / 2}
                  stroke="currentColor"
                  strokeWidth="2"
                  opacity={0.2}
                />
                <line
                  x1={padding}
                  y1={remainingHeight / 2}
                  x2={padding + (width - 2 * padding) * progression}
                  y2={remainingHeight / 2}
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle r="6" cx={width - padding} cy={remainingHeight / 2} fill="currentColor" />
              </svg>
              <svg className="text-green" width={width} height={bottomHeight} viewBox={`0 0 ${width} ${bottomHeight}`}>
                <text x={topPadding} y={bottomHeight - 46} fill="#7f7f7f" fontSize="14px">
                  {i18n._(t`Price`)}
                </text>
                <text x={topPadding} y={bottomHeight - topPadding} fill="#FFFFFF" fontSize="18px" fontWeight={700}>
                  {auction?.startPrice?.toSignificant(6)} {auction?.startPrice?.quoteCurrency.symbol}
                </text>
              </svg>
            </div>
          )
        }}
      </AutoSizer>
    </div>
  )
}

export default AuctionChartCrowdsale
