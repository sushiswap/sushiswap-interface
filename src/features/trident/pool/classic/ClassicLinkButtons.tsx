import { FC } from 'react'
import Button from '../../../../components/Button'
import Link from 'next/link'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useRecoilValue } from 'recoil'
import { poolAtom } from '../../context/atoms'

const ClassicLinkButtons: FC = () => {
  const { i18n } = useLingui()
  const [, pool] = useRecoilValue(poolAtom)

  // TODO ramin: make dynamic
  const isFarm = true

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button variant="outlined" color="gradient" className="text-high-emphesis">
        <Link href={`/trident/add/classic/${pool?.token0.address}/${pool?.token1.address}`}>
          {isFarm ? i18n._(t`Deposit / Stake`) : i18n._(t`Deposit`)}
        </Link>
      </Button>
      <Button variant="outlined" color="gradient" className="text-high-emphesis">
        <Link href={`/trident/remove/classic/${pool?.token0.address}/${pool?.token1.address}`}>
          {i18n._(t`Withdraw`)}
        </Link>
      </Button>
      <Button variant="outlined" color="gray" className="w-full col-span-2 text-high-emphesis py-3" size="xs">
        {i18n._(t`View Analytics`)}
      </Button>
    </div>
  )
}

export default ClassicLinkButtons
