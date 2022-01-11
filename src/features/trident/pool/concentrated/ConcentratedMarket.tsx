import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import ListPanel from 'app/components/ListPanel'
import Typography from 'app/components/Typography'
import { FC } from 'react'
import { useRecoilValue } from 'recoil'

import { poolAtom } from '../../context/atoms'

const ConcentratedMarket: FC = () => {
  const { i18n } = useLingui()
  const { pool } = useRecoilValue(poolAtom)

  return (
    <div className="flex flex-col px-5 gap-5 mt-12">
      <Typography variant="h3" className="text-high-emphesis" weight={700}>
        {i18n._(t`Market`)}
      </Typography>
      <ListPanel
        header={<ListPanel.Header title={i18n._(t`Assets`)} value="$356,227,073.45" subValue="1,837,294.56 SLP" />}
        items={[pool?.reserve0, pool?.reserve0].map((amount, index) => (
          <ListPanel.CurrencyAmountItem amount={amount} key={index} />
        ))}
      />
    </div>
  )
}

export default ConcentratedMarket
