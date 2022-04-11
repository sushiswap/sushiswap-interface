import AnalyticsContainer from 'app/features/analytics/AnalyticsContainer'
import { useRouter } from 'next/router'
import React from 'react'

export default function Pool() {
  const router = useRouter()
  const id = (router.query.id as string).toLowerCase()

  return (
    <AnalyticsContainer>
      <div>
        <button onClick={() => router.back()} className="font-bold">
          {'<'} Go Back
        </button>
      </div>
      {/* <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center space-x-4">
          <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={53} />
            {token?.symbol.length <= 6 ? (
              <div className="text-4xl font-bold">{token?.symbol}</div>
            ) : (
              <div className="hidden text-4xl font-bold sm:block">{token?.symbol}</div>
            )}
        </div>
        <div className="flex flex-row items-center space-x-4">
          <div className="text-4xl font-bold">
            {formatNumber(price, true)}
          </div>
          <div>
            <ColoredNumber number={priceChange} percent={true} />
          </div>
        </div>
      </div> */}
    </AnalyticsContainer>
  )
}
