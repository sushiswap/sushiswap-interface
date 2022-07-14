import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { CurrencyLogoArray } from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import { isWrappedReturnNativeSymbol } from 'app/functions'
import { useCurrency } from 'app/hooks/Tokens'
import { TridentHeader } from 'app/layouts/Trident'
import Link from 'next/link'
import React, { useState } from 'react'

// @ts-ignore TYPE NEEDS FIXING
const ManageTridentPair = ({ farm }) => {
  const { i18n } = useLingui()
  const [toggle, setToggle] = useState(true)

  const token0 = useCurrency(farm.pair.token0.id)
  const token1 = useCurrency(farm.pair.token1.id)

  console.log(farm)

  return (
    <div className="flex flex-col gap-1">
      <TridentHeader pattern="bg-chevron" condensed className="lg:py-[22px]">
        <div className="flex flex-col gap-3 lg:w-8/12 lg:gap-5 lg:pr-6 h-[68px] lg:h-auto">
          <CurrencyLogoArray currencies={token0 && token1 ? [token0, token1] : []} size={64} dense />
        </div>
      </TridentHeader>
      <Typography variant="h2" weight={700} className="text-high-emphesis">
        {i18n._(t`Add Liquidity`)}
      </Typography>
      <Button color="blue" variant="outlined" size="sm" className="!pl-2 !py-1 rounded-full">
        <Link
          href={{
            pathname: `/trident/add`,
            query: {
              tokens: [
                isWrappedReturnNativeSymbol(farm.chainId, farm.pair.token0.id),
                isWrappedReturnNativeSymbol(farm.chainId, farm.pair.token1.id),
              ],
              fee: farm.pair.swapFee,
              twap: farm.pair.twapEnabled,
            },
          }}
          passHref={true}
        >
          <a className="text-sm text-blue">
            Add {farm.pair.token0.symbol}/{farm.pair.token1.symbol} Liquidity
          </a>
        </Link>
      </Button>
      <Typography variant="h2" weight={700} className="text-high-emphesis">
        {i18n._(t`Remove Liquidity`)}
      </Typography>
      <Button color="blue" variant="outlined" size="sm" className="!pl-2 !py-1 rounded-full">
        <Link
          href={{
            pathname: `/trident/remove`,
            query: {
              tokens: [
                isWrappedReturnNativeSymbol(farm.chainId, farm.pair.token0.id),
                isWrappedReturnNativeSymbol(farm.chainId, farm.pair.token1.id),
              ],
              fee: farm.pair.swapFee,
              twap: farm.pair.twapEnabled,
            },
          }}
          passHref={true}
        >
          <a className="text-sm text-blue">
            Remove {farm.pair.token0.symbol}/{farm.pair.token1.symbol} Liquidity
          </a>
        </Link>
      </Button>
    </div>
  )
}

export default ManageTridentPair
