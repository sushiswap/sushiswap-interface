import React, { FC } from 'react'
import Divider from '../../../components/Divider'
import Checkbox from '../../../components/Checkbox'
import { useRecoilState } from 'recoil'
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

const FeeTiers: FC = () => {
  const [feeTiers, setFeeTiers] = useRecoilState(feeTiersFilterAtom)

  const removeOrAdd = (tier: FeeTier) => {
    if (feeTiers.includes(tier)) {
      setFeeTiers(feeTiers.filter((t) => t !== tier))
    } else {
      setFeeTiers([...feeTiers, tier])
    }
  }

  return (
    <Section title="Fee Tiers">
      <Selection title="1%" checked={feeTiers.includes(1)} setter={() => removeOrAdd(1)} />
      <Selection title="0.3%" checked={feeTiers.includes(0.3)} setter={() => removeOrAdd(0.3)} />
      <Selection title="0.1%" checked={feeTiers.includes(0.1)} setter={() => removeOrAdd(0.1)} />
      <Selection title="0.05%" checked={feeTiers.includes(0.05)} setter={() => removeOrAdd(0.05)} />
    </Section>
  )
}

export const SearchSidebar: FC = () => {
  const [farmsOnly, setFarmsOnly] = useRecoilState(farmsOnlyAtom)
  const [twapOnly, setTwapOnly] = useRecoilState(showTWAPOnlyAtom)

  return (
    <div className="w-48 border-r border-gray-800 pt-8 p-4">
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
