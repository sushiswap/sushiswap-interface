import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import ListPanel from 'app/components/ListPanel'
import Typography from 'app/components/Typography'
import { bentoboxRebasesAtom, poolAtom, totalSupplyAtom } from 'app/features/trident/context/atoms'
import { toAmountCurrencyAmount } from 'app/functions'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import { FC } from 'react'
import { useRecoilValue } from 'recoil'

import SumUSDCValues from '../../SumUSDCValues'
import ClassicTokenPrices from './ClassicTokenPrices'

const ClassicMarket: FC = () => {
  const isDesktop = useDesktopMediaQuery()
  const { i18n } = useLingui()
  const { pool } = useRecoilValue(poolAtom)
  const totalSupply = useRecoilValue(totalSupplyAtom)
  const rebases = useRecoilValue(bentoboxRebasesAtom)
  const amounts = [pool?.reserve0, pool?.reserve1]

  const reserves = amounts.map((el, index) => {
    const amount = amounts[index]
    if (el && pool && totalSupply && amount && rebases[amount.wrapped.currency.address]) {
      return toAmountCurrencyAmount(rebases[amount.wrapped.currency.address], amount.wrapped)
    }

    return undefined
  })

  return (
    <SumUSDCValues amounts={amounts}>
      {({ amount }) => (
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <Typography variant="h3" className="text-high-emphesis" weight={700}>
              {i18n._(t`Pool Composition`)}
            </Typography>
            <div className="hidden lg:flex lg:flex-col">
              <Typography variant="sm" className="text-high-emphesis">
                {i18n._(t`Total Assets`)}
              </Typography>
              <Typography weight={700} className="text-right text-high-emphesis">
                {`$${amount ? `${amount.toSignificant(6)}` : '0.000'}`}
              </Typography>
            </div>
          </div>

          <div className="block lg:hidden">
            <ClassicTokenPrices />
          </div>

          <ListPanel
            header={
              isDesktop ? (
                <div className="grid grid-cols-3 h-14 items-center pl-5 pr-4">
                  <Typography className="text-high-emphesis">{i18n._(t`Token`)}</Typography>
                  <Typography className="text-high-emphesis text-right">{i18n._(t`Amount`)}</Typography>
                  <Typography className="text-high-emphesis text-right">{i18n._(t`Value`)}</Typography>
                </div>
              ) : (
                <ListPanel.Header
                  title={i18n._(t`Assets`)}
                  value={`$${amount ? `${amount.toSignificant(6)}` : '0.00'}`}
                  subValue={`${totalSupply?.toSignificant(6)} ${pool?.liquidityToken.symbol}`}
                />
              )
            }
            items={reserves.map((amount, index) => (
              <ListPanel.CurrencyAmountItem amount={amount} key={index} displayTokenAmount={isDesktop} />
            ))}
          />
        </div>
      )}
    </SumUSDCValues>
  )
}

export default ClassicMarket
