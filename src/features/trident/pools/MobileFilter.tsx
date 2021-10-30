import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'components/Button'
import Checkbox from 'components/Checkbox'
import BottomSlideIn from 'components/Dialog/BottomSlideIn'
import Typography from 'components/Typography'
import { FC, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { farmsOnlyAtom, feeTiersFilterAtom, filterInUseSelector, showTWAPOnlyAtom } from './context/atoms'
import { removeOrAddFeeTier } from './SearchSidebar'

const YieldFarmFilter: FC = () => {
  const [farmsOnly, setFarmsOnly] = useRecoilState(farmsOnlyAtom)
  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between gap-3">
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          Yield Farms:
        </Typography>
      </div>
      <div className="flex flex-row gap-3 items-center" onClick={() => setFarmsOnly(!farmsOnly)}>
        <Checkbox checked={farmsOnly} />
        <Typography className="text-secondary">Show farms only</Typography>
      </div>
    </div>
  )
}

const TwapOnlyFilter: FC = () => {
  const [twapOnly, setTwapOnly] = useRecoilState(showTWAPOnlyAtom)

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between gap-3">
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          TWAP Oracles:
        </Typography>
      </div>
      <div className="flex flex-row gap-3 items-center" onClick={() => setTwapOnly(!twapOnly)}>
        <Checkbox checked={twapOnly} />
        <Typography className="text-secondary">Show oracle pairs only</Typography>
      </div>
    </div>
  )
}

const FeeTierFilter: FC = () => {
  const [feeTiers, setFeeTiers] = useRecoilState(feeTiersFilterAtom)

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between gap-3">
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          By Fee Tier:
        </Typography>
      </div>
      <div className="flex flex-row gap-3 items-center" onClick={() => removeOrAddFeeTier(1, feeTiers, setFeeTiers)}>
        <Checkbox checked={feeTiers.includes(1)} />
        <Typography className="text-secondary">1%</Typography>
      </div>
      <div className="flex flex-row gap-3 items-center" onClick={() => removeOrAddFeeTier(0.3, feeTiers, setFeeTiers)}>
        <Checkbox checked={feeTiers.includes(0.3)} />
        <Typography className="text-secondary">0.3%</Typography>
      </div>
      <div className="flex flex-row gap-3 items-center" onClick={() => removeOrAddFeeTier(0.05, feeTiers, setFeeTiers)}>
        <Checkbox checked={feeTiers.includes(0.05)} />
        <Typography className="text-secondary">0.05%</Typography>
      </div>
      <div className="flex flex-row gap-3 items-center" onClick={() => removeOrAddFeeTier(0.01, feeTiers, setFeeTiers)}>
        <Checkbox checked={feeTiers.includes(0.01)} />
        <Typography className="text-secondary">0.1%</Typography>
      </div>
    </div>
  )
}

export const MobileFilter: FC = () => {
  const { i18n } = useLingui()
  const [open, setOpen] = useState(false)
  const filterInUse = useRecoilValue(filterInUseSelector)

  return (
    <div className="lg:hidden">
      <div onClick={() => setOpen(true)} className="hover:cursor-pointer">
        <svg width="25" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 0a1.5 1.5 0 0 1 1.5 1.5V3h12a1.5 1.5 0 0 1 0 3h-12v1.5a1.5 1.5 0 0 1-3 0v-6A1.5 1.5 0 0 1 10 0ZM0 4.5A1.5 1.5 0 0 1 1.5 3H5a1.5 1.5 0 1 1 0 3H1.5A1.5 1.5 0 0 1 0 4.5ZM13 14H1.5a1.5 1.5 0 0 0 0 3H13a1.5 1.5 0 0 0 0-3Zm3.5 1.5v-3a1.5 1.5 0 0 1 3 0V14h4a1.5 1.5 0 0 1 0 3h-4v1.5a1.5 1.5 0 0 1-3 0v-3Z"
            fill={filterInUse ? '#f139c3' : '#E3E3E3'}
          />
        </svg>
      </div>
      <BottomSlideIn
        title={i18n._(t`Select Filters`)}
        open={open}
        onClose={() => setOpen(false)}
        closeTrigger={
          <Button color="white" size="sm" className="h-[32px]" onClick={() => setOpen(false)}>
            <span className="px-3">{i18n._(t`Apply & Close`)}</span>
          </Button>
        }
      >
        <div className="bg-dark-700 rounded-t">
          {/* To Be Built */}
          {/*<YieldFarmFilter />*/}
          <div className="bg-dark-800 rounded-t">
            <TwapOnlyFilter />
            <div className="relative bg-dark-900 rounded-t">
              <FeeTierFilter />
            </div>
          </div>
        </div>
      </BottomSlideIn>
    </div>
  )
}
