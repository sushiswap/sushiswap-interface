import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { ACTION_ACCRUE } from '@sushiswap/sdk'
import React from 'react'

import Button from '../../components/Button'
import { KashiCooker } from '../../entities'
import { ZERO } from '../../functions/math'
import useKashiApproveCallback from '../../hooks/useKashiApproveCallback'

export default function PairTools({ pair }) {
  const [, , , , onCook] = useKashiApproveCallback()

  async function onUpdatePrice(cooker: KashiCooker): Promise<string> {
    cooker.updateExchangeRate(false, ZERO, ZERO)
    return `${i18n._(t`Update Price`)} ${pair.asset.tokenInfo.symbol}/${pair.collateral.tokenInfo.symbol}`
  }

  async function onAccrue(cooker: KashiCooker): Promise<string> {
    cooker.add(ACTION_ACCRUE, '0x00')
    return `${i18n._(t`Accrue`)} ${pair.asset.tokenInfo.symbol}/${pair.collateral.tokenInfo.symbol}`
  }

  return (
    <div className="flex flex-row space-x-2">
      <Button color="gradient" variant="outlined" size="xs" className="w-full" onClick={() => onCook(pair, onAccrue)}>
        Accrue
      </Button>
      <Button
        color="gradient"
        variant="outlined"
        size="xs"
        className="w-full"
        onClick={() => onCook(pair, onUpdatePrice)}
      >
        Update Price
      </Button>
    </div>
  )
}
