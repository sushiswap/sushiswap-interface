import React, { useEffect, useState } from 'react'

import Image from 'next/image'
import { addMinutes, format } from 'date-fns'

function MisoInfo({
  name = 'Bad Trip',
  symbol = '$LSD',
  auctionType = 'Batch Auction',
  minRaised = 1380,
  minRaisedUsd = 11040,
  tokenForSale = 20,
  auctionStartDate = 1626782400000,
}: {
  name?: any
  symbol?: any
  auctionType?: any
  minRaised?: any
  minRaisedUsd?: any
  tokenForSale?: any
  auctionStartDate?: any
}) {
  const [remainingTime, setRemainingTime] = useState('')

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date().getTime()
      // Set the date counting down to
      const countDownDate = new Date(auctionStartDate).getTime()
      // Find the distance between now and the count down time
      const distance = countDownDate - now
      // If the count down is finished, write some text
      if (distance < 0) {
        setRemainingTime('')
        clearInterval(intervalId)
        return
      }
      // Time calculations for days, hours, minutes and seconds

      const SECONDS = 1000
      const MINUTES = SECONDS * 60
      const HOURS = MINUTES * 60
      const DAYS = HOURS * 24

      const days = Math.floor(distance / DAYS)
      const hours = Math.floor((distance % DAYS) / HOURS)
      const minutes = Math.floor((distance % HOURS) / MINUTES)
      const seconds = Math.floor((distance % MINUTES) / SECONDS)

      // Update display days, hours, minutes and seconds
      const displaySeconds = seconds < 10 ? '0' + seconds : seconds
      const displayMinutes = minutes < 10 ? '0' + minutes : minutes
      const displayHours = hours < 10 ? '0' + hours : hours
      const displayDays = days < 10 ? '0' + days : days

      let remainingTime = ''
      if (days > 0) remainingTime += displayDays + 'd '
      if (remainingTime || hours > 0) remainingTime += displayHours + 'h '
      if (remainingTime || minutes > 0) remainingTime += displayMinutes + 'm '
      if (remainingTime || seconds > 0) remainingTime += displaySeconds + 's '
      setRemainingTime(remainingTime + ' Left')
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [auctionStartDate])

  const formatDate = (date) => {
    return format(addMinutes(date, date.getTimezoneOffset()), 'MMMM do yyyy, h a')
  }

  return (
    <div className="flex flex-col">
      {/* Name and Symbol */}
      <div className="flex flex-row items-end mt-6">
        <Image src="/images/miso/trident/trident-auction-icon.png" width={85} height={85} />
        <div className="flex-1 flex flex-col mx-6 items-center">
          <div>
            <div className="font-bold text-base sm:text-xl">{'Trident NFT'}</div>
            <div className="text-2xl sm:text-3xl md:text-5xl font-bold text-white">{name}</div>
          </div>
        </div>
        <div
          className="py-1 px-5"
          style={{ borderRadius: 10, backgroundColor: '#809090a0', fontSize: 20, color: 'white', fontWeight: 'bold' }}
        >
          {symbol}
        </div>
      </div>
      {/* Type, rasied, for sale */}
      <div className="gap-4 grid grid-cols-12 mt-6">
        <div className="col-span-4 flex flex-col">
          <div className="text-sm sm:text-lg">{'Auction Type'}</div>
          <div className="text-base md:text-xl font-bold text-white">{auctionType}</div>
          <div>
            <Image src="/images/miso/trident/trident_auction_type.png" width={25} height={25} />
          </div>
        </div>
        <div className="col-span-4 flex flex-col mx-auto">
          <div className="text-sm sm:text-lg">{'MIN Raised'}</div>
          <div className="text-base md:text-xl font-bold text-white">{`${minRaised} $SUSHI`}</div>
          <div className="text-sm sm:text-base">{`$${minRaisedUsd} USD`}</div>
        </div>
        <div className="col-span-4 flex flex-col ml-auto">
          <div className="text-sm sm:text-lg">{'Token For Sale'}</div>
          <div className="text-base md:text-xl font-bold text-white">{tokenForSale}</div>
          <div className="text-sm sm:text-base">{symbol}</div>
        </div>
      </div>
      <div className="flex flex-row mt-6">
        <div className="flex flex-col">
          <div className="text-sm sm:text-lg">{'Auction starts on'}</div>
          <div className="text-base md:text-xl font-bold text-white">{formatDate(new Date(auctionStartDate))} GMT</div>
          {remainingTime != '' && (
            <div className="flex flex-row items-center text-base">
              <Image src="/images/miso/trident/trident_timer.png" width={15} height={15} />
              <div className="text-sm sm:text-lg ml-2">{remainingTime}</div>
            </div>
          )}
        </div>
        <div className="ml-5 md:ml-8 cursor-pointer">
          <a
            href="https://miso.sushi.com/auctions/0x15c5E87Ce788F0dEBcAF70cF1dde69E3Bc3E6Ad1"
            target="_blank"
            rel="noreferrer noopener"
          >
            <Image src="/images/miso/trident/trident_view_auction.png" width={91} height={88} />
          </a>
        </div>
      </div>
      <div className="flex flex-col mt-6">
        <div>About</div>
        <div>
          The Trident NFT is introduced as a celebratory piece for the announcement and upcoming release of Sushi’s
          Trident AMM. This NFT can be redeemed for a 19cm x 19cm 900 tab piece of blotter paper with this Chewy Stoll
          artwork on the left printed on it.
        </div>
      </div>
    </div>
  )
}

export default MisoInfo
