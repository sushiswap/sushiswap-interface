import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import ListPanel from 'app/components/ListPanel'
import Typography from 'app/components/Typography'
import { FC } from 'react'
import { useRecoilValue } from 'recoil'

import { poolAtom } from '../../context/atoms'

const StablePoolComposition: FC = () => {
  const { i18n } = useLingui()
  const { pool } = useRecoilValue(poolAtom)

  return (
    <div className="flex flex-col gap-4 px-5 mt-12">
      <Typography variant="h3" weight={700} className="text-high-emphesis">
        {i18n._(t`Pool Composition`)}
      </Typography>
      <ListPanel
        header={<ListPanel.Header title={i18n._(t`Assets`)} value="$20,000,000.00" />}
        items={[pool?.reserve0, pool?.reserve1].map((amount, index) => (
          <ListPanel.CurrencyAmountItem amount={amount} key={index} />
        ))}
      />
    </div>
  )
}

export default StablePoolComposition
