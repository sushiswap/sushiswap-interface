import { FC } from 'react'
import { useRecoilValue } from 'recoil'
import { currentLiquidityValueSelector, currentPoolShareSelector, poolBalanceAtom } from '../../context/atoms'
import { t } from '@lingui/macro'
import ListPanel from '../../../../components/ListPanel'
import SumUSDCValues from '../../SumUSDCValues'
import { useLingui } from '@lingui/react'
import { formatPercent } from '../../../../functions'

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
              value={amount ? `${amount.toSignificant(6)}` : '$0.000'}
              subValue={`${poolBalance?.toSignificant(6)} ${poolBalance?.currency?.symbol}`}
            />
          )}
        </SumUSDCValues>
      }
      items={currentLiquidityValue.map((amount, index) => (
        <ListPanel.CurrencyAmountItem amount={amount} key={index} />
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
