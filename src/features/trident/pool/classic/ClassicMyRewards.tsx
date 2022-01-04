import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import ListPanel from 'app/components/ListPanel'
import Typography from 'app/components/Typography'
import { currentLiquidityValueSelector } from 'app/features/trident/context/atoms'
import React, { FC } from 'react'
import { useRecoilValue } from 'recoil'

const ClassicMyRewards: FC = () => {
  const { i18n } = useLingui()

  // TODO ramin: this is incorrect
  const currentLiquidityValues = useRecoilValue(currentLiquidityValueSelector)

  return (
    <ListPanel
      header={
        <div className="flex flex-row justify-between pl-4 pr-3 py-3 items-center">
          <Typography variant="lg" className="text-high-emphesis flex-grow" weight={700}>
            {i18n._(t`My Rewards`)}
          </Typography>
          <Button color="gradient" className="w-[unset] h-[32px]" size="sm">
            {i18n._(t`Claim All`)}
          </Button>
        </div>
      }
      items={currentLiquidityValues.map((el, index) => (
        <ListPanel.CurrencyAmountItem amount={el} key={index} />
      ))}
    />
  )
}

export default ClassicMyRewards
