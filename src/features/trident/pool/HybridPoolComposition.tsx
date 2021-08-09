import { FC } from 'react'
import { useLingui } from '@lingui/react'
import Typography from '../../../components/Typography'
import ListPanel from '../../../components/ListPanel'
import { t } from '@lingui/macro'
import { useTridentPoolPageContext } from './context'

const HybridPoolComposition: FC = () => {
  const { i18n } = useLingui()
  const { pool } = useTridentPoolPageContext()

  return (
    <div className="flex flex-col gap-4 px-5 mt-12">
      <Typography variant="h3" weight={700} className="text-high-emphesis">
        Pool Composition
      </Typography>
      <ListPanel
        header={<ListPanel.Header title={i18n._(t`Assets`)} value="$20,000,000.00" />}
        items={pool.amounts.map((amount, index) => (
          <ListPanel.Item
            key={index}
            left={<ListPanel.Item.Left amount={amount} />}
            right={<ListPanel.Item.Right>$8,360.00</ListPanel.Item.Right>}
          />
        ))}
      />
    </div>
  )
}

export default HybridPoolComposition
