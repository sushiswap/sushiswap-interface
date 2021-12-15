import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Auction } from 'app/features/miso/context/Auction'
import { classNames } from 'app/functions'
import useInterval from 'app/hooks/useInterval'
import useTextWidth from 'app/hooks/useTextWidth'
import { FC, useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

interface AuctionChartDutchProps {
  auction: Auction
  prices: boolean
}

const AuctionChartDutch: FC<AuctionChartDutchProps> = ({ auction, prices }) => {
  const { i18n } = useLingui()
  const endPriceLabelWidth = useTextWidth({
    text: `Ending Price`,
    font: '14px DM Sans',
  })
  const endPriceWidth = useTextWidth({
    text: `${auction?.minimumPrice?.toSignificant(6)} ${auction?.minimumPrice?.quoteCurrency.symbol}`,
    font: '18px DM Sans',
  })

  const startTime = auction.auctionInfo.startTime.mul('1000').toNumber()
  const endTime = auction.auctionInfo.endTime.mul('1000').toNumber()
  const now = Date.now()
  const [progression, setState] = useState<number>(Math.min(1, Math.max((now - startTime) / (endTime - startTime), 0)))
  useInterval(() => {
    setState(Math.min(1, Math.max((now - startTime) / (endTime - startTime), 0)))
  }, 1000)

  const bottomHeight = 60
  const padding = 28
  const topPadding = 20
  const minHeight = prices ? 'min-h-[234px]' : 'min-h-[94px]'

  return (
    <div className={classNames('relative w-full h-full', minHeight)}>
      <AutoSizer>
        {({ width, height }) => {
          const remainingHeight = prices ? height - bottomHeight : height
          return (
            <div className="relative">
              <svg
                className="text-green"
                width={width}
                height={remainingHeight}
                viewBox={`0 0 ${width} ${remainingHeight}`}
              >
                <circle r="4" cx={padding} cy={padding} fill="currentColor" />
                <line
                  x1={padding}
                  y1={padding}
                  x2={width - padding}
                  y2={remainingHeight - padding}
                  stroke="currentColor"
                  strokeWidth="2"
                  opacity={0.2}
                />
                <line
                  x1={padding}
                  y1={padding}
                  x2={padding + (width - 2 * padding) * progression}
                  y2={padding + (remainingHeight - 2 * padding) * progression}
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle r="4" cx={width - padding} cy={remainingHeight - padding} fill="currentColor" />
              </svg>
              {prices && (
                <svg
                  className="text-green"
                  width={width}
                  height={bottomHeight}
                  viewBox={`0 0 ${width} ${bottomHeight}`}
                >
                  <text x={topPadding} y={bottomHeight - 46} fill="#7f7f7f" fontSize="14px">
                    {i18n._(t`Starting price`)}
                  </text>
                  <text x={topPadding} y={bottomHeight - topPadding} fill="#FFFFFF" fontSize="18px" fontWeight={700}>
                    {auction?.startPrice?.toSignificant(6)} {auction?.startPrice?.quoteCurrency.symbol}
                  </text>
                  <text
                    x={width - topPadding - endPriceLabelWidth}
                    y={bottomHeight - 46}
                    fill="#7f7f7f"
                    fontSize="14px"
                    textAnchor="right"
                  >
                    {i18n._(t`Ending price`)}
                  </text>
                  <text
                    x={width - topPadding - endPriceWidth}
                    y={bottomHeight - topPadding}
                    fill="#FFFFFF"
                    fontSize="18px"
                    fontWeight={700}
                    textAnchor="right"
                  >
                    {auction?.minimumPrice?.toSignificant(6)} {auction?.minimumPrice?.quoteCurrency.symbol}
                  </text>
                </svg>
              )}
            </div>
          )
        }}
      </AutoSizer>
    </div>
  )
}

export default AuctionChartDutch
