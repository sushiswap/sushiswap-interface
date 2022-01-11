import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import TridentLayout from 'app/layouts/Trident'
import Link from 'next/link'
import { RecoilRoot } from 'recoil'

const PoolType = ({ pool }) => {
  const { i18n } = useLingui()

  return (
    <div className="flex flex-col w-full gap-9 mt-px">
      <div className="flex flex-col bg-gradient-to-r from-transparent-blue to-opaque-blue">
        <div className="flex flex-col p-5 bg-dark-700 bg-opacity-80">
          <div className="flex flex-col items-start gap-5">
            <Typography variant="h3" className="text-high-emphesis" weight={700}>
              {pool.label}
            </Typography>
            <Button
              color="blue"
              variant="outlined"
              size="xs"
              className="rounded-full py-0.5 pl-0.5"
              startIcon={<ChevronLeftIcon width={16} height={16} />}
            >
              <Link href={'/trident/pool/types'}>{i18n._(t`Back`)}</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="px-5 flex flex-col gap-2.5">
        <Typography variant="h3" className="text-high-emphesis" weight={700}>
          {i18n._(t`Introduction`)}
        </Typography>
        <Typography variant="sm">{pool.long_description}</Typography>
      </div>
    </div>
  )
}

PoolType.Provider = RecoilRoot
PoolType.Layout = TridentLayout

export default PoolType
