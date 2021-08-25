import React, { FC } from 'react'
import Typography from '../../../../components/Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import ListPanel from '../../../../components/ListPanel'
import PercentInput from '../../../../components/Input/Percent'
import Button from '../../../../components/Button'
import ToggleButtonGroup from '../../../../components/ToggleButton'
import { useUSDCValue } from '../../../../hooks/useUSDCPrice'
import { useTridentRemoveWeightedContext, useTridentRemoveWeightedState } from './context'

const WeightedUnzapMode: FC = () => {
  const { i18n } = useLingui()
  const { percentageAmount, outputTokenAddress } = useTridentRemoveWeightedState()
  const { currencies, handlePercentageAmount, parsedInputAmounts, parsedOutputAmounts, showReview } =
    useTridentRemoveWeightedContext()

  // TODO this value is incorrect
  const usdcValue = useUSDCValue(parsedInputAmounts[outputTokenAddress])

  // TODO Fixture
  const [addressA, addressB] = Object.keys(currencies)
  const weights = {
    [addressA]: '70%',
    [addressB]: '30%',
  }

  return (
    <div className="px-5 mt-5">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 mt-4">
          <Typography variant="h3" weight={700} className="text-high-emphesis">
            Amount to Remove:
          </Typography>
          <ListPanel
            header={<ListPanel.Header title={i18n._(t`Balances`)} value="$16,720.00" subValue="54.32134 SLP" />}
            items={Object.keys(currencies).map((address, index) => (
              <ListPanel.CurrencyAmountItem amount={parsedInputAmounts[address]} key={index} />
            ))}
            footer={
              <div className="flex justify-between items-center px-4 py-5 gap-3">
                <PercentInput
                  value={percentageAmount}
                  onUserInput={(value: string) => handlePercentageAmount(value)}
                  placeholder="0%"
                  className="bg-transparent text-3xl leading-7 tracking-[-0.01em] flex-grow after:content-['%']"
                />
                <Typography variant="sm" className="text-low-emphesis">
                  ≈${usdcValue?.greaterThan('0') ? usdcValue?.toSignificant(6) : '0.0000'}
                </Typography>
              </div>
            }
          />
          <ToggleButtonGroup
            value={percentageAmount}
            onChange={(value: string) => handlePercentageAmount(value)}
            variant="outlined"
          >
            <ToggleButtonGroup.Button value="100">Max</ToggleButtonGroup.Button>
            <ToggleButtonGroup.Button value="75">75%</ToggleButtonGroup.Button>
            <ToggleButtonGroup.Button value="50">50%</ToggleButtonGroup.Button>
            <ToggleButtonGroup.Button value="25">25%</ToggleButtonGroup.Button>
          </ToggleButtonGroup>
        </div>
        <div className="flex flex-col gap-5">
          <Typography variant="h3" weight={700} className="text-high-emphesis">
            {i18n._(t`Receive:`)}
          </Typography>
          <div className="flex flex-col gap-4">
            <ListPanel
              items={Object.values(parsedOutputAmounts).map((amount, index) => (
                <ListPanel.CurrencyAmountItem
                  amount={amount}
                  key={index}
                  weight={weights[amount?.currency?.wrapped.address]}
                />
              ))}
            />
            <Button color="gradient" disabled={!percentageAmount} onClick={() => showReview(true)}>
              {percentageAmount ? i18n._(t`Confirm Withdrawal`) : i18n._(t`Tap amount or type amount to continue`)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeightedUnzapMode
