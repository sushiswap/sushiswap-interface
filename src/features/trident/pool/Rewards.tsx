import React, { FC } from 'react'
import { useLingui } from '@lingui/react'
import ListPanel from '../../../components/ListPanel'
import { SUSHI } from '../../../config/tokens'
import { ChainId } from '@sushiswap/core-sdk'
import { tryParseAmount } from '../../../functions'
import { t } from '@lingui/macro'
import Typography from '../../../components/Typography'
import { useRecoilValue } from 'recoil'
import { poolAtom } from './classic/context/atoms'

const Rewards: FC = () => {
  const { i18n } = useLingui()
  const [, pool] = useRecoilValue(poolAtom)

  return (
    <ListPanel
      className="px-5 mt-5"
      header={<ListPanel.Header title={i18n._(t`Rewards`)} />}
      items={[
        <ListPanel.Item
          left={<ListPanel.Item.Left amount={tryParseAmount('401.34', SUSHI[ChainId.MAINNET])} />}
          right={
            <div className="flex flex-row gap-1 justify-end">
              <Typography variant="sm" weight={700}>
                SUSHI
              </Typography>
              <Typography variant="sm" className="text-secondary" weight={700}>
                {i18n._(t`PER DAY`)}
              </Typography>
            </div>
          }
          key={0}
        />,
      ]}
    />
  )
}

export default Rewards
