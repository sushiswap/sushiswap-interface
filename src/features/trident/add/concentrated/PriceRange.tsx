import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { FC } from 'react'

const PriceRange: FC = () => {
  const { i18n } = useLingui()

  return (
    <div className="flex flex-col px-5">
      <Typography variant="lg" weight={700} className="text-high-emphesis">
        {i18n._(t`Set Price Range`)}
      </Typography>
      <div className="h-[144px] flex flex-col justify-center items-center">
        <Typography variant="sm" weight={700} className="text-secondary">
          Insert price range chart here
        </Typography>
      </div>
      <Typography variant="xs" className="text-center">
        {i18n._(t`Tap on any bar to view stats of that specific cluster of liquidity`)}
      </Typography>
    </div>
  )
}

export default PriceRange
