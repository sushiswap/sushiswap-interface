import { QuestionMarkCircleIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import QuestionHelper from 'app/components/QuestionHelper'
import { Auction } from 'app/features/miso/context/Auction'
import { classNames } from 'app/functions'
import useTextWidth from 'app/hooks/useTextWidth'
import { FC } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

import { AuctionPriceHelperTextByTemplateId } from '../context/utils'

interface AuctionChartDutchProps {
  auction: Auction
  prices: boolean
}

// const PriceIndicator

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
  const currentPriceWidth = useTextWidth({
    text: `${auction?.currentPrice?.toSignificant(6)} ${auction?.minimumPrice?.quoteCurrency.symbol}`,
    font: '14px DM Sans',
  })
  const priceInfoWidth = useTextWidth({
    text: `Current Token Value`,
    font: '14px DM Sans',
  })

  const startTime = auction.auctionInfo.startTime.mul('1000').toNumber()
  const endTime = auction.auctionInfo.endTime.mul('1000').toNumber()
  const now = Date.now()
  const progression = 0.9
  // const [progression, setState] = useState(0)
  // // console.log({ currentPriceWidth })

  // useInterval(() => {
  //   setState(Math.min(1, Math.max((now - startTime) / (endTime - startTime), 0)))
  // }, 1000)

  // const orientation =   currentX + priceInfoWidth 'bottom'
  const bottomHeight = 60
  const paddingX = 20
  const paddingY = 50
  const topPadding = 20
  const minHeight = prices ? 'min-h-[234px]' : 'min-h-[94px]'
  const priceLineLength = 50
  const priceLineXOffset = 1
  const priceTextXOffset = 10
  const priceTextYOffset = 35
  const tooltipXOffset = 145
  const tooltipYOffset = 45

  // console.log({ prices, startPrice: auction.startPrice, progression })

  return (
    <div className={classNames('relative w-full h-full', minHeight)}>
      <AutoSizer>
        {({ width, height }) => {
          const remainingHeight = prices ? height - bottomHeight : height
          const currentX = paddingX + (width - 2 * paddingX) * progression
          const currentY = paddingY + (remainingHeight - 2 * paddingY) * progression
          const orientation = currentX + priceInfoWidth + 15 < width ? 'top' : 'bottom'
          const infoTextTopPositionX = currentX + priceTextXOffset
          const infoTextTopPositionY = currentY - priceTextYOffset
          const tooltipTopPositionX = currentX + tooltipXOffset
          const tooltipTopPositionY = currentY - tooltipYOffset
          const priceTextTopPositionX = currentX + 10
          const priceTextTopPositionY = currentY - 10
          const infoTextBottomPositionX = currentX - 150
          const infoTextBottomPositionY = currentY + 20
          const tooltipBottomPositionX = currentX - 17.5
          const tooltipBottomPositionY = currentY + 10
          const priceTextBottomPositionX = currentX - (currentPriceWidth + 20)
          const priceTextBottomPositionY = currentY + 45
          // const showTooltip = currentX + priceInfoWidth < width ? true : false

          return (
            <div className="relative">
              <svg
                className="text-green"
                width={width}
                height={remainingHeight}
                viewBox={`0 0 ${width} ${remainingHeight}`}
              >
                <circle r="4" cx={paddingX} cy={paddingY} fill="currentColor" />
                <line
                  x1={paddingX}
                  y1={paddingY}
                  x2={width - paddingX}
                  y2={remainingHeight - paddingY}
                  stroke="currentColor"
                  strokeWidth="2"
                  opacity={0.2}
                />
                <line x1={paddingX} y1={paddingY} x2={currentX} y2={currentY} stroke="currentColor" strokeWidth="2" />
                {true && (
                  <>
                    <line
                      x1={currentX + priceLineXOffset}
                      x2={currentX + priceLineXOffset}
                      y1={orientation === 'bottom' ? currentY + priceLineLength : currentY}
                      y2={orientation === 'bottom' ? currentY : currentY - priceLineLength}
                      stroke="currentColor"
                      strokeWidth="2"
                      opacity={0.2}
                    />
                    <text
                      x={orientation === 'bottom' ? infoTextBottomPositionX : infoTextTopPositionX}
                      y={orientation === 'bottom' ? infoTextBottomPositionY : infoTextTopPositionY}
                      fill="#7f7f7f"
                      fontSize="14px"
                    >
                      {i18n._(t`Current Token Value`)}
                    </text>
                    <foreignObject
                      width="30"
                      height="30"
                      x={orientation === 'bottom' ? tooltipBottomPositionX : tooltipTopPositionX}
                      y={orientation === 'bottom' ? tooltipBottomPositionY : tooltipTopPositionY}
                    >
                      <QuestionHelper text={AuctionPriceHelperTextByTemplateId(i18n)[auction.template]}>
                        <QuestionMarkCircleIcon
                          width={10}
                          height={10}
                          className="ml-0 text-secondary mb-[2px] text-dark-400"
                        />
                      </QuestionHelper>
                    </foreignObject>
                    <text
                      x={orientation === 'bottom' ? priceTextBottomPositionX : priceTextTopPositionX}
                      y={orientation === 'bottom' ? priceTextBottomPositionY : priceTextTopPositionY}
                      fill="#ffffff"
                    >
                      {auction.currentPrice.toSignificant(6)} {auction?.minimumPrice?.quoteCurrency.symbol}
                    </text>
                  </>
                )}
                <circle r="4" cx={width - paddingX} cy={remainingHeight - paddingY} fill="currentColor" />
              </svg>
              {prices && (
                <svg
                  className="text-green"
                  width={width}
                  height={bottomHeight}
                  viewBox={`0 0 ${width} ${bottomHeight}`}
                >
                  <text x={topPadding} y={bottomHeight - 40} fill="#7f7f7f" fontSize="14px">
                    {i18n._(t`Starting price`)}
                  </text>
                  <text x={topPadding} y={bottomHeight - topPadding} fill="#FFFFFF" fontSize="18px" fontWeight={700}>
                    {auction?.startPrice?.toSignificant(6)} {auction?.startPrice?.quoteCurrency.symbol}
                  </text>
                  <text
                    x={width - topPadding - endPriceLabelWidth}
                    y={bottomHeight - 40}
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
