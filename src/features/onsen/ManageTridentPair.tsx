import { ExternalLinkIcon } from '@heroicons/react/solid'
import { useLingui } from '@lingui/react'
import { CurrencyLogoArray } from 'app/components/CurrencyLogo'
import { isWrappedReturnNativeSymbol } from 'app/functions'
import { useCurrency } from 'app/hooks/Tokens'
import React, { useState } from 'react'

// @ts-ignore TYPE NEEDS FIXING
const ManageTridentPair = ({ farm }) => {
  const { i18n } = useLingui()
  const [toggle, setToggle] = useState(true)

  const token0 = useCurrency(farm.pair.token0.id)
  const token1 = useCurrency(farm.pair.token1.id)

  // console.log(farm)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row items-center gap-3">
        <CurrencyLogoArray currencies={token0 && token1 ? [token0, token1] : []} size={36} dense />
        <div>
          <div className="text-lg font-bold text-primary">
            {farm.pair.token0.symbol}/{farm.pair.token1.symbol} {farm.pair.swapFee / 100}%
          </div>
          <div className="text-sm text-secondary">Trident Farm</div>
        </div>
      </div>
      <a
        target="_blank"
        href={`/trident/add/${isWrappedReturnNativeSymbol(
          farm.chainId,
          farm.pair.token0.id
        )}/${isWrappedReturnNativeSymbol(farm.chainId, farm.pair.token1.id)}?fee=${farm.pair.swapFee}&twap=${
          farm.pair.twapEnabled
        }`}
        className="flex items-center justify-between px-8 py-4 text-lg font-bold border rounded text-primary border-dark-700 hover:bg-dark-700"
        rel="noreferrer"
      >
        Add Liquidity <ExternalLinkIcon width={20} height={20} />
      </a>
      <a
        target="_blank"
        href={`/trident/remove/${isWrappedReturnNativeSymbol(
          farm.chainId,
          farm.pair.token0.id
        )}/${isWrappedReturnNativeSymbol(farm.chainId, farm.pair.token1.id)}?fee=${farm.pair.swapFee}&twap=${
          farm.pair.twapEnabled
        }`}
        className="flex items-center justify-between px-8 py-4 text-lg font-bold border rounded text-primary border-dark-700 hover:bg-dark-700"
        rel="noreferrer"
      >
        Remove Liquidity <ExternalLinkIcon width={20} height={20} />
      </a>
    </div>
  )
}

export default ManageTridentPair
