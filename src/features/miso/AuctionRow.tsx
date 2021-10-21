import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import useCopyClipboard from '../../hooks/useCopyClipboard'
import Typography from '../../components/Typography'
import { DuplicateIcon, ArrowSmRightIcon } from '@heroicons/react/outline'
import { classNames, e10, shortenAddress } from '../../functions'
import Image from 'next/image'
import { formatRemainingTime } from './helper/formatRemainingTime'
import { useEffect, useState } from 'react'
import { useCurrency } from '../../hooks/Tokens'
import CurrencyLogo from '../../components/CurrencyLogo'
import { useAuctionInfo } from '../../hooks/miso/useAuctionInfo'
import LendWithdrawAction from '../kashi/Withdraw'
import { formatUnits } from '@ethersproject/units'

import { clearingPrice, tokenPrice } from './helper/dutch'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { useUSDCPrice } from '../../hooks'
import NavLink from '../../components/NavLink'

export default function AuctionRow({ auction, timestamp }: any) {
  const { i18n } = useLingui()

  const [timeString, setTimeString] = useState('00D : 00H : 00M : 00S')
  const auctionToken = useCurrency(auction.tokenInfo.addr)
  const auctionInfo = useAuctionInfo(auction.addr)
  const paymentCurrency = useCurrency(
    auctionInfo['paymentCurrencyInfo']?.symbol == 'ETH' ? 'ETH' : auctionInfo['paymentCurrencyInfo']?.addr
  )
  const [auctionDetails, setAuctionData] = useState(null)
  const [auctionColor, setAuctionColor] = useState('secondary')

  const paymentCurrencyPrice = useUSDCPrice(paymentCurrency)?.toFixed(6)

  useEffect(() => {
    if (timestamp < auctionInfo['startTime']) {
      // not started

      setTimeString(formatRemainingTime(Math.floor(auction.startTime - timestamp)))
      setAuctionColor('secondary')
    } else if (timestamp > auctionInfo['endTime']) {
      // ended
      setTimeString(formatRemainingTime(0))
      setAuctionColor('secondary')
    } else {
      const remaining = Math.floor(auction.endTime - timestamp)
      setTimeString(formatRemainingTime(remaining))
      setAuctionColor(remaining > 450000 ? 'yellow' : 'green')
    }

    if (!auctionInfo || !auctionInfo[0] || !auctionToken) {
      return
    }

    let auctionType = ''
    let currentPrice = 0
    let rate = 0
    let minCommitment = 0

    const tokenValue = tokenPrice(auctionInfo)
    const totalRaised = parseFloat(
      formatUnits(auctionInfo['commitmentsTotal'], auctionInfo['paymentCurrencyInfo'].decimals)
    )
    const totalTokens = parseFloat(formatUnits(auctionInfo['totalTokens'], auctionToken.decimals))

    if (auctionInfo['marketTemplate'] == 1) {
      // crowdsale
      auctionType = 'Crowdsale'
      rate = parseFloat(formatUnits(auctionInfo['rate'], auctionInfo['paymentCurrencyInfo'].decimals))
      currentPrice = 1 / rate
      minCommitment = totalTokens / rate
    } else if (auctionInfo['marketTemplate'] == 2) {
      // dutch
      auctionType = 'Dutch Auction'
      currentPrice = clearingPrice(auctionInfo, timestamp)
      const minPrice = parseFloat(formatUnits(auctionInfo['minimumPrice'], auctionInfo['paymentCurrencyInfo'].decimals))
      minCommitment = totalTokens * minPrice
    } else if (auctionInfo['marketTemplate'] == 3) {
      // batch
      auctionType = 'Batch Auction'
      currentPrice = tokenValue
      minCommitment = parseFloat(
        formatUnits(auctionInfo['minimumCommitmentAmount'], auctionInfo['paymentCurrencyInfo'].decimals)
      )
    }

    const minTargetLeft = minCommitment > totalRaised ? minCommitment - totalRaised : 0

    setAuctionData({
      auctionType: auctionType,
      tokenValue: tokenValue,
      currentPrice: currentPrice,
      totalRaised: totalRaised,
      minTargetLeft: minTargetLeft,
    })
  }, [auctionInfo, timestamp])

  return !auctionDetails ? (
    <div></div>
  ) : (
    <div className="my-3 cursor-pointer">
      <NavLink href={`/miso/edit-auction/${auction.addr}`}>
        <div className="grid grid-cols-6 auto-cols-min">
          <div className="flex items-center space-x-2">
            <CurrencyLogo currency={auctionToken} size={'40px'} />
            <div className="flex flex-col">
              <Typography variant="base" className=" text-primary">
                {i18n._(`${auctionToken.symbol}`)}
              </Typography>
              <Typography variant="sm" className=" text-secondary">
                {i18n._(`${auctionDetails.auctionType}`)}
              </Typography>
            </div>
          </div>

          <div className="flex flex-col">
            <Typography variant="base" className="text-primary">
              {i18n._(`${auctionDetails.tokenValue.toFixed(2)} ${auctionInfo['paymentCurrencyInfo'].symbol}`)}
            </Typography>
            <Typography variant="sm" className="text-secondary">
              {i18n._(`$${paymentCurrencyPrice}`)}
            </Typography>
          </div>
          <div className="flex flex-col">
            <Typography variant="base" className="text-primary">
              {i18n._(`${auctionDetails.currentPrice.toFixed(2)} ${auctionInfo['paymentCurrencyInfo'].symbol}`)}
            </Typography>
            <Typography variant="sm" className="text-secondary">
              {i18n._(`$60.24`)}
            </Typography>
          </div>
          <div className="flex flex-col">
            <Typography variant="base" className="text-primary">
              {i18n._(`${auctionDetails.totalRaised.toFixed(2)} ${auctionInfo['paymentCurrencyInfo'].symbol}`)}
            </Typography>
            <Typography variant="sm" className="text-secondary">
              {i18n._(`$300,00.24`)}
            </Typography>
          </div>
          {auctionDetails.minTargetLeft != 0 ? (
            <div className="flex flex-col">
              <Typography variant="base" className="text-primary">
                {i18n._(`${auctionDetails.minTargetLeft.toFixed(2)}`)} ${auctionInfo['paymentCurrencyInfo'].symbol}
              </Typography>
              <Typography variant="sm" className="text-secondary">
                {i18n._(`$270,045.24`)}
              </Typography>
            </div>
          ) : (
            <div className="flex flex-col justify-center">
              <CheckCircleIcon className="text-blue" width={20} height={20} />
            </div>
          )}
          <Typography variant="base" className={classNames('my-auto', 'text-' + auctionColor)}>
            {i18n._(`${timeString}`)}
          </Typography>
        </div>
      </NavLink>
    </div>
  )
}
