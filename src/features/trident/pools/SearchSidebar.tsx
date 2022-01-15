import { Fee } from '@sushiswap/trident-sdk'
import Checkbox from 'app/components/Checkbox'
import Typography from 'app/components/Typography'
import React, { FC } from 'react'
import { SetterOrUpdater, useRecoilState } from 'recoil'

import { feeTiersFilterAtom, showTWAPOnlyAtom } from './context/atoms'

const Section: FC<{ title: string }> = ({ children, title }) => {
  return (
    <div className="flex flex-col gap-2">
      <Typography variant="sm" weight={700}>
        {title}
      </Typography>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
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
      <Checkbox checked={checked} set={setter} />
      <span className="text-xs">{title}</span>
    </div>
  )
}

export const removeOrAddFeeTier = (tier: Fee, currentSelection: Fee[], setter: SetterOrUpdater<Fee[]>) => {
  if (currentSelection.includes(tier)) {
    setter(currentSelection.filter((t) => t !== tier))
  } else {
    setter([...currentSelection, tier])
  }
}

const FeeTiers: FC = () => {
  const [selectedFeeTiers, setSelectedFeeTiers] = useRecoilState(feeTiersFilterAtom)

  return (
    <Section title="Fee Tiers">
      {[Fee.HIGH, Fee.DEFAULT, Fee.MEDIUM, Fee.LOW].map((fee) => {
        return (
          <Selection
            key={fee}
            title={`${fee / 100}%`}
            checked={selectedFeeTiers.includes(fee)}
            setter={() => removeOrAddFeeTier(fee, selectedFeeTiers, setSelectedFeeTiers)}
          />
        )
      })}
    </Section>
  )
}

export const SearchSidebar: FC = () => {
  const [twapOnly, setTwapOnly] = useRecoilState(showTWAPOnlyAtom)

  return (
    <div className="hidden lg:flex flex-col gap-6 w-52 pt-2">
      <Section title="TWAP Oracles">
        <Selection title="Show oracle pairs only" checked={twapOnly} setter={() => setTwapOnly(!twapOnly)} />
      </Section>
      <FeeTiers />
    </div>
  )
}
