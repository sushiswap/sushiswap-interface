import { Pair } from '@sushiswap/core-sdk'
import SumUSDCValues from 'app/features/trident/SumUSDCValues'
import { classNames } from 'app/functions'
import React, { FC } from 'react'

interface PoolValueProps {
  pair: Pair
  roundedBottom?: boolean
}

export const PoolValueEstimation: FC<PoolValueProps> = ({ pair, roundedBottom }) => (
  <div className={classNames('flex items-center justify-between p-3 bg-dark-800', roundedBottom && 'rounded-b')}>
    <div>
      <div>
        {pair.reserve0.toFixed(2)} {pair.token0.symbol}
      </div>
      <div>
        {pair.reserve1.toFixed(2)} {pair.token1.symbol}
      </div>
    </div>
    <SumUSDCValues amounts={[pair.reserve0, pair.reserve1]}>
      {({ amount }) => {
        return <div className="text-high-emphesis font-bold">≈ ${amount?.toFixed(2)}</div>
      }}
    </SumUSDCValues>
  </div>
)
