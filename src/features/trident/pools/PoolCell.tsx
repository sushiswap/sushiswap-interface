import CurrencyLogo from 'app/components/CurrencyLogo'
import { useCurrency } from 'app/hooks/Tokens'
import Image from 'next/image'
import React, { FC } from 'react'

const CurrencyLogoWrapper: FC<{ currencyId: string }> = ({ currencyId }) => {
  const currency = useCurrency(currencyId)
  return (
    <div className="-ml-2">
      <CurrencyLogo className="rounded-full" currency={currency} size={40} />
    </div>
  )
}

interface PoolCellProps {
  assets: {
    id: string
    name: string
    symbol: string
  }[]
  twapEnabled: boolean
}

export const PoolCell: FC<PoolCellProps> = ({ assets, twapEnabled }) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex ml-2">
          {assets.map((asset, i) => (
            <CurrencyLogoWrapper key={i} currencyId={asset.id} />
          ))}
        </div>
        <div className="font-bold text-high-emphesis">{assets.map((asset) => asset.symbol).join('-')}</div>
        {twapEnabled && (
          <div className="w-3.5">
            <Image src="/rss.svg" alt="rss icon" layout="responsive" />
          </div>
        )}
      </div>
    </>
  )
}
