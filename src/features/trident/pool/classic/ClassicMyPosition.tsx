import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ZERO } from '@sushiswap/core-sdk'
import ListPanel from 'app/components/ListPanel'
import {
  currentLiquidityValueSelector,
  currentPoolShareSelector,
  poolBalanceAtom,
} from 'app/features/trident/context/atoms'
import SumUSDCValues from 'app/features/trident/SumUSDCValues'
import { formatPercent } from 'app/functions'
import { FC } from 'react'
import { useRecoilValue } from 'recoil'

const ClassicMyPosition: FC = () => {
  const { i18n } = useLingui()
  const poolBalance = useRecoilValue(poolBalanceAtom)
  const currentLiquidityValue = useRecoilValue(currentLiquidityValueSelector)
  const currentPoolShare = useRecoilValue(currentPoolShareSelector)

  return (
    <ListPanel
      header={
        <SumUSDCValues amounts={currentLiquidityValue}>
          {({ amount }) => (
            <ListPanel.Header
              className="bg-dark-1000"
              title={i18n._(t`My Position`)}
              value={`$${amount?.greaterThan(ZERO) ? `${amount.toSignificant(6)}` : '0.00'}`}
              subValue={`${amount?.greaterThan(ZERO) ? poolBalance?.toSignificant(6) : '0.00'} ${
                poolBalance?.currency?.symbol
              }`}
            />
          )}
        </SumUSDCValues>
      }
      items={currentLiquidityValue.map((amount, index) => (
        <ListPanel.CurrencyAmountItem id={`my-position-${index}`} amount={amount} key={index} />
      ))}
      footer={
        <ListPanel.Footer
          title={i18n._(t`Share of Pool`)}
          value={currentPoolShare ? formatPercent(currentPoolShare.toSignificant(6)) : '0.00%'}
        />
      }
    />
  )
}

export default ClassicMyPosition
