import { FC } from 'react'
import Typography from '../../../../components/Typography'
import { t } from '@lingui/macro'
import ListPanel from '../../../../components/ListPanel'
import { useLingui } from '@lingui/react'
import { useRecoilValue } from 'recoil'
import { poolAtom, totalSupplyAtom } from '../../context/atoms'
import SumUSDCValues from '../../SumUSDCValues'

const ClassicMarket: FC = () => {
  const { i18n } = useLingui()
  const [, pool] = useRecoilValue(poolAtom)
  const totalSupply = useRecoilValue(totalSupplyAtom)

  const amounts = [pool?.reserve0, pool?.reserve1]

  return (
    <SumUSDCValues amounts={amounts}>
      {({ amount }) => (
        <div className="flex flex-col gap-3">
          <div className="flex flex-row justify-between">
            <Typography variant="h3" className="text-high-emphesis" weight={700}>
              {i18n._(t`Pool Composition`)}
            </Typography>
            <div className="hidden lg:flex lg:flex-col">
              <Typography variant="sm" className="text-high-emphesis">
                Total Assets
              </Typography>
              <Typography weight={700} className="text-high-emphesis text-right">
                {amount ? `${amount.toSignificant(6)}` : '$0.000'}
              </Typography>
            </div>
          </div>

          <ListPanel
            header={
              <ListPanel.Header
                title={i18n._(t`Assets`)}
                value={amount ? `${amount.toSignificant(6)}` : '$0.000'}
                subValue={`${totalSupply?.toSignificant(6)} ${pool?.liquidityToken.symbol}`}
              />
            }
            items={[pool?.reserve0, pool?.reserve1].map((amount, index) => (
              <ListPanel.CurrencyAmountItem amount={amount} key={index} />
            ))}
          />
        </div>
      )}
    </SumUSDCValues>
  )
}

export default ClassicMarket
