import React, { FC } from 'react'
import Divider from '../../../components/Divider'
import Checkbox from '../../../components/Checkbox'
import { SetterOrUpdater, useRecoilState } from 'recoil'
import { farmsOnlyAtom, feeTiersFilterAtom, showTWAPOnlyAtom } from './context/atoms'
import { FeeTier } from '../../../services/graph/fetchers/pools'

const Section: FC<{ title: string }> = ({ children, title }) => {
  return (
    <>
      <Divider />
      <div className="py-6">
        <div className="text-sm mb-3">{title}</div>
        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </>
  )
}

interface SelectionProps {
  title: string
  setter: (arg0: boolean) => void
  checked: boolean
}

const Selection: FC<SelectionProps> = ({ title, checked, setter }) => {
  return (
    <div className="flex gap-2 items-center">
      <Checkbox color="blue" checked={checked} set={setter} /> <span className="text-xs">{title}</span>
    </div>
  )
}

export const removeOrAddFeeTier = (tier: FeeTier, currentSelection: FeeTier[], setter: SetterOrUpdater<FeeTier[]>) => {
  if (currentSelection.includes(tier)) {
    setter(currentSelection.filter((t) => t !== tier))
  } else {
    setter([...currentSelection, tier])
  }
}

const FeeTiers: FC = () => {
  const [feeTiers, setFeeTiers] = useRecoilState(feeTiersFilterAtom)

  return (
    <Section title="Fee Tiers">
      <Selection
        title="1%"
        checked={feeTiers.includes(1)}
        setter={() => removeOrAddFeeTier(1, feeTiers, setFeeTiers)}
      />
      <Selection
        title="0.3%"
        checked={feeTiers.includes(0.3)}
        setter={() => removeOrAddFeeTier(0.3, feeTiers, setFeeTiers)}
      />
      <Selection
        title="0.1%"
        checked={feeTiers.includes(0.1)}
        setter={() => removeOrAddFeeTier(0.1, feeTiers, setFeeTiers)}
      />
      <Selection
        title="0.05%"
        checked={feeTiers.includes(0.05)}
        setter={() => removeOrAddFeeTier(0.05, feeTiers, setFeeTiers)}
      />
    </Section>
  )
}

export const SearchSidebar: FC = () => {
  const [farmsOnly, setFarmsOnly] = useRecoilState(farmsOnlyAtom)
  const [twapOnly, setTwapOnly] = useRecoilState(showTWAPOnlyAtom)

  return (
    <div className="flex-none w-48 border-r border-gray-800 pt-8 p-4 hidden lg:block">
      <div className="pb-6">Search Settings</div>

      <Section title="Yield Farms">
        <Selection title="Show farms only" checked={farmsOnly} setter={() => setFarmsOnly(!farmsOnly)} />
      </Section>
      <Section title="TWAP Oracles">
        <Selection title="Show oracle pairs only" checked={twapOnly} setter={() => setTwapOnly(!twapOnly)} />
      </Section>
      <FeeTiers />
    </div>
  )
}
