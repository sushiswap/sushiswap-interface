import React, { FC } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useTridentPoolPageContext } from '../context'
import Typography from '../../../../components/Typography'
import ListPanel from '../../../../components/ListPanel'
import Button from '../../../../components/Button'
import { SUSHI } from '../../../../config/tokens'
import { ChainId } from '@sushiswap/sdk'
import { tryParseAmount } from '../../../../functions'

const ClassicMyRewards: FC = () => {
  const { i18n } = useLingui()
  const { pool } = useTridentPoolPageContext()

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
      items={[<ListPanel.CurrencyAmountItem amount={tryParseAmount('10.2', SUSHI[ChainId.MAINNET])} key={0} />]}
    />
  )
}

export default ClassicMyRewards
