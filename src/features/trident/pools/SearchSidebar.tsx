import { Fee } from '@sushiswap/trident-sdk'
import Checkbox from 'app/components/Checkbox'
import Typography from 'app/components/Typography'
import {
  selectTridentPools,
  setPoolsFeeTiers,
  setPoolsPoolTypes,
  setPoolsTWAPOnly,
} from 'app/features/trident/pools/poolsSlice'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import React, { FC } from 'react'

import { POOL_TYPES } from '../constants'
import { AllPoolType, UsedPoolType } from '../types'

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
    <div className="flex items-center gap-2">
      <Checkbox checked={checked} set={setter} />
      <span className="text-xs">{title}</span>
    </div>
  )
}

export const removeOrAddFeeTier = (tier: Fee, currentSelection: Fee[], setter: (x: Fee[]) => void) => {
  if (currentSelection.includes(tier)) {
    setter(currentSelection.filter((t) => t !== tier))
  } else {
    setter([...currentSelection, tier])
  }
}

export const removeOrAddPoolType = (
  type: AllPoolType,
  currentSelection: AllPoolType[],
  setter: (x: AllPoolType[]) => void
) => {
  if (currentSelection.includes(type)) {
    setter(currentSelection.filter((t) => t !== type))
  } else {
    setter([...currentSelection, type])
  }
}

const FeeTiers: FC = () => {
  const { feeTiers } = useAppSelector(selectTridentPools)
  const dispatch = useAppDispatch()

  return (
    <Section title="Fee Tiers">
      {[Fee.HIGH, Fee.DEFAULT, Fee.MEDIUM, Fee.LOW].map((fee) => {
        return (
          <Selection
            key={fee}
            title={`${fee / 100}%`}
            checked={feeTiers.includes(fee)}
            setter={() => removeOrAddFeeTier(fee, feeTiers, (feeTiers) => dispatch(setPoolsFeeTiers(feeTiers)))}
          />
        )
      })}
    </Section>
  )
}

const PoolTypes: FC = () => {
  const { poolTypes } = useAppSelector(selectTridentPools)
  const dispatch = useAppDispatch()

  return (
    <Section title="Pool Types">
      {Object.values(UsedPoolType).map((poolType) => {
        return (
          <Selection
            key={poolType}
            title={POOL_TYPES[poolType].label}
            checked={poolTypes.includes(poolType)}
            setter={() =>
              removeOrAddPoolType(poolType, poolTypes, (poolTypes) => dispatch(setPoolsPoolTypes(poolTypes)))
            }
          />
        )
      })}
    </Section>
  )
}

export const SearchSidebar: FC = () => {
  const { showTWAPOnly } = useAppSelector(selectTridentPools)
  const dispatch = useAppDispatch()

  return (
    <div className="flex-col hidden gap-6 pt-2 lg:flex w-52">
      <Section title="TWAP Oracles">
        <Selection
          title="Show oracle pairs only"
          checked={showTWAPOnly}
          setter={() => dispatch(setPoolsTWAPOnly(!showTWAPOnly))}
        />
      </Section>
      <FeeTiers />
      <PoolTypes />
    </div>
  )
}
