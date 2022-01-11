import { Token } from '@sushiswap/core-sdk'
import { CurrencyLogoArray } from 'app/components/CurrencyLogo'
import Image from 'next/image'
import React, { FC } from 'react'

interface PoolCellProps {
  assets: Token[]
  twapEnabled: boolean
}

export const PoolCell: FC<PoolCellProps> = ({ assets, twapEnabled }) => {
  const poolId = assets.map((asset) => asset.symbol).join('-')
  return (
    <>
      <div className="flex items-center gap-2 overflow-hidden">
        <div className="flex ml-2">
          <CurrencyLogoArray currencies={assets} size={40} dense />
        </div>
        <div
          id={`pool-${poolId}`}
          className="overflow-hidden font-bold text-high-emphesis overflow-ellipsis whitespace-nowrap"
        >
          {poolId}
        </div>
        {twapEnabled && (
          <div className="w-3.5">
            <Image src="/images/rss.svg" alt="rss icon" layout="responsive" width="14" height="14" />
          </div>
        )}
      </div>
    </>
  )
}
