import React, { useMemo } from 'react'
import Button from '../../components/Button'
import { KashiCooker } from '../../entities'
import useKashiApproveCallback from '../../hooks/useKashiApproveCallback'
import { ZERO, e10 } from '../../functions/math'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { ACTION_ACCRUE } from '../../constants/kashi'
import QuestionHelper from '../../components/QuestionHelper'
import { formatPercent } from '../../functions'

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

  const priceChange = useMemo(() => {
    const currentPrice = pair?.currentExchangeRate / 1e18
    const oraclePrice = pair?.oracleExchangeRate / 1e18

    const difference = Math.abs(currentPrice - oraclePrice)

    return (difference / currentPrice) * 100
  }, [pair])

  return (
    <div className="flex flex-row flex-shrink space-x-2">
      <QuestionHelper width="100%" text={'Sync Market APR to Supply APR'}>
        <Button color="gradient" variant="outlined" size="xs" className="w-full" onClick={() => onCook(pair, onAccrue)}>
          Accrue
        </Button>
      </QuestionHelper>
      <QuestionHelper
        width="100%"
        text={
          <div>
            <div>Update the exchange rate</div>
            <div>Current deviation: {formatPercent(priceChange)}</div>
          </div>
        }
      >
        <Button
          color="gradient"
          variant="outlined"
          size="xs"
          className="w-full"
          onClick={() => onCook(pair, onUpdatePrice)}
        >
          Update Price
        </Button>
      </QuestionHelper>
    </div>
  )
}
