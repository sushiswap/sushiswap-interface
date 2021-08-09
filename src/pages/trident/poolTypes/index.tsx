import TridentLayout from '../../../layouts/Trident'
import Typography from '../../../components/Typography'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from '../../../components/Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { POOLS_ROUTE, POOL_TYPES_ROUTE } from '../../../constants/routes'
import PoolTypesList from '../../../features/trident/types/PoolTypesList'

export const getStaticProps = async () => ({
  props: {
    breadcrumbs: [POOLS_ROUTE, POOL_TYPES_ROUTE],
  },
})

const PoolTypes = () => {
  const { i18n } = useLingui()

  return (
    <div className="flex flex-col w-full gap-9 mt-px">
      <div className="flex flex-col p-5 bg-dark-800 bg-auto bg-binary-pattern bg-opacity-90">
        <div className="flex flex-row items-start gap-3">
          <Typography variant="h3" className="text-high-emphesis" weight={700}>
            {i18n._(t`Pool Types`)}
          </Typography>
          <Button
            color="blue"
            variant="outlined"
            size="xs"
            className="rounded-full py-0.5 pl-0.5"
            startIcon={<ChevronLeftIcon width={16} height={16} />}
          >
            <Link href={'/trident/pool'}>{i18n._(t`Back`)}</Link>
          </Button>
        </div>
        <Typography variant="sm" weight={400}>
          {i18n._(t`Learn more about the power of Sushi's AMM and Tines routing engine.`)}
        </Typography>
      </div>
      <div className="px-5 flex flex-col gap-4">
        <Typography variant="h3" className="text-high-emphesis" weight={700}>
          {i18n._(t`What kinds of liquidity pools are supported on Sushi?`)}
        </Typography>
        <Typography variant="sm">
          {i18n._(
            t`Currently, there are four pool types on the platform.  However, our infrastructure has been built in a way to support more and more pool types as they emerge.`
          )}
        </Typography>
      </div>
      <div className="px-5">
        <Typography
          variant="lg"
          className="bg-gradient-to-r from-blue to-pink bg-clip-text text-transparent"
          weight={700}
        >
          {i18n._(t`CURRENT POOL TYPES`)}
        </Typography>
        <Typography variant="sm">{i18n._(t`Tap any to learn more`)}</Typography>
      </div>
      <PoolTypesList />
    </div>
  )
}

PoolTypes.Layout = TridentLayout

export default PoolTypes
