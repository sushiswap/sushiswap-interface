import Chip from '../../../components/Chip'
import TridentLayout from '../../../layouts/Trident'
import Typography from '../../../components/Typography'
import Button from '../../../components/Button'
import { useState } from 'react'
import { ChevronDownIcon, SearchIcon } from '@heroicons/react/solid'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'

const Pool = () => {
  const { i18n } = useLingui()
  const [sort, setSort] = useState(true)

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex flex-col p-5 bg-dark-800 bg-auto bg-binary-pattern bg-opacity-90 gap-6">
        <div className="">
          <Typography variant="h3" className="text-high-emphesis" weight={400}>
            {i18n._(t`Provide liquidity & earn.`)}
          </Typography>
          <Typography variant="sm" weight={400}>
            {i18n._(t`Earn LP fees by depositing tokens to the platform.`)}
          </Typography>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button color="gradient" size="sm" className="text-sm font-bold text-white py-2">
            {i18n._(t`Create a New Pool`)}
          </Button>
          <Button color="gradient" variant="outlined" className="text-sm font-bold text-white py-2">
            {i18n._(t`Pool Type Info`)}
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 px-5">
        <div className="flex gap-2 items-center rounded border border-dark-800 bg-dark-900 bg-opacity-50 py-2 px-3">
          <SearchIcon strokeWidth={5} width={20} height={20} />
          <input className="bg-transparent text-high-emphesis" placeholder={i18n._(t`Search by token`)} />
        </div>
        <div className="flex justify-between items-center">
          <Typography weight={400}>{i18n._(t`Sort:`)}</Typography>
          <div className="flex gap-1 items-center" onClick={() => setSort((prevState) => !prevState)}>
            <Typography weight={400} className="text-high-emphesis">
              {i18n._(t`APY`)} {sort ? t`Highest to Lowest` : t`Lowest to Highest`}
            </Typography>
            <div className={`transform ${sort ? '' : 'rotate-180'}`}>
              <ChevronDownIcon width={20} height={20} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-5">
        <div className="rounded border border-dark-700 bg-dark-900 overflow-hidden">
          <div className="flex justify-between p-3">
            <Chip label="Classic" />
            <div className="flex gap-1.5 items-baseline">
              <Typography className="text-secondary" variant="sm" weight={400}>
                APY
              </Typography>
              <Typography className="text-high-emphesis leading-5" variant="lg" weight={700}>
                37.8%
              </Typography>
            </div>
          </div>
          <div className="flex justify-between items-center bg-dark-800 p-3">
            <Typography className="text-high-emphesis leading-5" variant="lg" weight={400}>
              WBTC-BADGER
            </Typography>
            <div className="flex gap-1">
              <Typography className="text-secondary" variant="xs" weight={700}>
                TVL:
              </Typography>
              <Typography className="text-high-emphesis" variant="xs" weight={700}>
                $1,504,320
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <div className="flex px-5 gap-2">
        <Chip color="purple" label="Classic" />
        <Chip color="yellow" label="Classic" />
        <Chip color="blue" label="Classic" />
        <Chip color="green" label="Classic" />
      </div>
    </div>
  )
}

Pool.Layout = TridentLayout(['Pools', 'Pool Types'])

export default Pool
