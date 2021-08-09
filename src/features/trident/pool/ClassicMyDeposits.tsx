import { FC } from 'react'
import Typography from '../../../components/Typography'
import { t } from '@lingui/macro'
import ListPanel from '../../../components/ListPanel'
import { useLingui } from '@lingui/react'
import { useTridentPoolPageContext } from './context'

const ClassicMyDeposits: FC = () => {
  const { i18n } = useLingui()
  const { pool } = useTridentPoolPageContext()

  return (
    <div className="flex flex-col px-5 gap-5 mt-12">
      <Typography variant="h3" className="text-high-emphesis" weight={700}>
        {i18n._(t`My Deposits`)}
      </Typography>
      <ListPanel
        header={<ListPanel.Header title={i18n._(t`Assets`)} value="$16,720.00" subValue="54.32134 SLP" />}
        items={pool.amounts.map((amount, index) => (
          <ListPanel.Item
            key={index}
            left={<ListPanel.Item.Left amount={amount} />}
            right={<ListPanel.Item.Right>$8,360.00</ListPanel.Item.Right>}
          />
        ))}
        footer={<ListPanel.Footer title={i18n._(t`Share of Pool`)} value="0.05%" />}
      />
    </div>
  )
}

export default ClassicMyDeposits
