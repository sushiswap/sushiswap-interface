import Typography from '../../../../components/Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import CurrencyLogo from '../../../../components/CurrencyLogo'
import { useUSDCValue } from '../../../../hooks/useUSDCPrice'
import usePercentageInput from '../../context/hooks/usePercentageInput'
import Divider from '../../../../components/Divider'
import SumUSDCValues from '../../SumUSDCValues'
import TransactionDetails from '../TransactionDetails'

const ClassicStandardAside = () => {
  const { i18n } = useLingui()
  const { parsedAmounts, error } = usePercentageInput()
  const usdcValues = [useUSDCValue(parsedAmounts?.[0]), useUSDCValue(parsedAmounts?.[1])]

  return (
    <div className="flex flex-col p-10 rounded bg-dark-1000 shadow-lg gap-20">
      <div className="flex flex-col gap-3">
        <Typography variant="h3" className="text-high-emphesis">
          {i18n._(t`Standard Mode`)}
        </Typography>
        <Typography variant="sm">
          {i18n._(
            t`You can withdraw to one or both of these assets, in any amount.  If you would like to receive your investment as another token (e.g. in USDC), then withdraw using Zap mode.`
          )}
        </Typography>
      </div>
      <div className="flex flex-col gap-5">
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          {i18n._(t`You'll Receive:`)}
        </Typography>
        {parsedAmounts.map((el, index) => (
          <div className="flex justify-between items-center" key={index}>
            <div className="flex gap-1.5 items-center">
              <CurrencyLogo currency={el?.currency} size={20} />
              <Typography variant="sm" weight={700} className="text-secondary">
                {el?.greaterThan(0) ? el.toSignificant(6) : '0.00'}
              </Typography>
              <Typography variant="sm" weight={700} className="text-high-emphesis">
                {el?.currency.symbol}
              </Typography>
            </div>
            <Typography variant="sm" weight={700} className="text-low-emphesis">
              ≈${usdcValues[index]?.greaterThan(0) ? usdcValues[index].toSignificant(2) : '0.00'}
            </Typography>
          </div>
        ))}
        <Divider className="mt-5 border-dark-700" />
        <div className="flex justify-between">
          <Typography variant="lg" weight={700} className="text-high-emphesis">
            {i18n._(t`Total Amount`)}
          </Typography>
          <Typography weight={700} className="text-low-emphesis">
            <SumUSDCValues amounts={parsedAmounts}>
              {({ amount }) => (amount ? `≈$${amount?.toSignificant(2)}` : '')}
            </SumUSDCValues>
          </Typography>
        </div>
      </div>
      <div className={error ? 'opacity-50' : 'opacity-100'}>
        <TransactionDetails />
      </div>
    </div>
  )
}

export default ClassicStandardAside
