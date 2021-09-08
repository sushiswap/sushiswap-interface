import React, { FC } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from '../../../../components/Typography'
import ListPanel from '../../../../components/ListPanel'
import Button from '../../../../components/Button'
import { useRecoilValue } from 'recoil'
import { currentLiquidityValueSelector } from './context/atoms'

const ClassicMyRewards: FC = () => {
  const { i18n } = useLingui()

  // TODO ramin: this is incorrect
  const currentLiquidityValues = useRecoilValue(currentLiquidityValueSelector)

  return (
    <ListPanel
      className="px-5 mt-5"
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
