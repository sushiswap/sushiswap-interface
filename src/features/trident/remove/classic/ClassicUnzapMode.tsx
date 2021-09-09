import React, { FC } from 'react'
import Typography from '../../../../components/Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import ListPanel from '../../../../components/ListPanel'
import PercentInput from '../../../../components/Input/Percent'
import Button from '../../../../components/Button'
import ToggleButtonGroup from '../../../../components/ToggleButton'
import AssetSelect from '../../../../components/AssetSelect'
import { useUSDCValue } from '../../../../hooks/useUSDCPrice'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  currentLiquidityValueSelector,
  selectedZapCurrencyAtom,
  percentageAmountAtom,
  parsedZapAmountSelector,
} from './context/atoms'
import { showReviewAtom } from '../../context/atoms'

const ClassicUnzapMode: FC = () => {
  const { i18n } = useLingui()
  const [percentageAmount, setPercentageAmount] = useRecoilState(percentageAmountAtom)
  const [liquidityA, liquidityB] = useRecoilValue(currentLiquidityValueSelector)
  const [selectedZapCurrency, setSelectedZapCurrency] = useRecoilState(selectedZapCurrencyAtom)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const usdcAValue = useUSDCValue(liquidityA)
  const usdcBValue = useUSDCValue(liquidityB)
  const liquidityValueInUsdc = usdcAValue?.add(usdcBValue)
  const parsedZapAmount = useRecoilValue(parsedZapAmountSelector)

  return (
    <div className="px-5 mt-5">
      <div className="flex flex-col gap-8">
        <AssetSelect value={selectedZapCurrency} onSelect={setSelectedZapCurrency} />
        <div className="flex flex-col gap-3">
          <Typography variant="h3" weight={700} className="text-high-emphesis">
            Amount to Remove:
          </Typography>
          <ListPanel
            header={<ListPanel.Header title={i18n._(t`Balances`)} value="$16,720.00" subValue="54.32134 SLP" />}
            items={[
              <ListPanel.CurrencyAmountItem amount={liquidityA} key={0} />,
              <ListPanel.CurrencyAmountItem amount={liquidityB} key={1} />,
            ]}
            footer={
              <div className="flex justify-between items-center px-4 py-5 gap-3">
                <PercentInput
                  value={percentageAmount}
                  onUserInput={(value: string) => setPercentageAmount(value)}
                  placeholder="0%"
                  className="bg-transparent text-3xl leading-7 tracking-[-0.01em] flex-grow after:content-['%']"
                />
                <Typography variant="sm" className="text-low-emphesis">
                  ≈${liquidityValueInUsdc?.greaterThan('0') ? liquidityValueInUsdc?.toSignificant(6) : '0.0000'}
                </Typography>
              </div>
            }
          />
          <ToggleButtonGroup
            value={percentageAmount}
            onChange={(value: string) => setPercentageAmount(value)}
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
            <ListPanel items={[<ListPanel.CurrencyAmountItem amount={parsedZapAmount} key={0} />]} />
            <Button color="gradient" disabled={!percentageAmount} onClick={() => setShowReview(true)}>
              {percentageAmount ? i18n._(t`Confirm Withdrawal`) : i18n._(t`Tap amount or type amount to continue`)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClassicUnzapMode
