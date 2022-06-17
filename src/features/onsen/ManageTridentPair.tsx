import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import { isWrappedReturnNativeSymbol } from 'app/functions'
import { useCurrency } from 'app/hooks/Tokens'
import Link from 'next/link'
import React, { useState } from 'react'

// @ts-ignore TYPE NEEDS FIXING
const ManageTridentPair = ({ farm }) => {
  const { i18n } = useLingui()
  const [toggle, setToggle] = useState(true)

  const token0 = useCurrency(farm.pair.token0.id)
  const token1 = useCurrency(farm.pair.token1.id)

  return (
    <div className="flex flex-col gap-1">
      <Typography variant="h2" weight={700} className="text-high-emphesis">
        {i18n._(t`Add Liquidity`)}
      </Typography>
      <Typography variant="sm">
        {i18n._(t`Deposit tokens in equal amounts or deposit either one of the two tokens or in any ratio.`)}
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
    </div>
  )
}

export default ManageTridentPair
