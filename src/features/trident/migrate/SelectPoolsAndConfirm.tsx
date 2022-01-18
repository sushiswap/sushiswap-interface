import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { LoadingSpinner } from 'app/components/LoadingSpinner'
import { SelectTridentPoolPanel } from 'app/components/Migrate/SelectTridentPoolPanel'
import { migrateGridLayoutCss } from 'app/features/trident/migrate/AvailableToMigrate'
import {
  editMigration,
  MigrationSource,
  selectLeftToChoose,
  selectTridentMigrations,
  v2Migration,
} from 'app/features/trident/migrate/context/migrateSlice'
import { useGetAllTridentPools } from 'app/services/graph/hooks/pools'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

import Typography from '../../../components/Typography'

const mockExecute = (selectedMigrations: v2Migration[]) => () => {
  alert(
    selectedMigrations
      .map((m) => {
        if (m.poolToCreate) return `Creating pool: {fee: ${m.poolToCreate.fee}, twap: ${m.poolToCreate.twap}}`
        if (m.matchingTridentPool)
          return `Migrating ${m.v2Pair.token0.symbol}-${m.v2Pair.token1.symbol} to existing pool: ${m.matchingTridentPool.address}`
      })
      .join(', ')
  )
}

export const SelectPoolsAndConfirm: FC = () => {
  const { i18n } = useLingui()
  const router = useRouter()

  const dispatch = useAppDispatch()
  const selectedMigrations = useAppSelector<v2Migration[]>(selectTridentMigrations)
  const leftToSelect = useAppSelector(selectLeftToChoose)

  const { data, error, isValidating } = useGetAllTridentPools()

  if (selectedMigrations.length === 0) {
    /* Need to select pools on previous page */
    router.push('/trident/migrate')
  }

  return (
    <div>
      <div className="flex gap-3 items-center">
        <Typography variant="h3" className="text-high-emphesis" weight={700}>
          {leftToSelect === 0
            ? i18n._(t`All set ✅`)
            : leftToSelect === 1
            ? i18n._(t`One pool left to select`)
            : i18n._(t`${leftToSelect} pools left to select`)}
        </Typography>
        <LoadingSpinner active={isValidating} />
        {error && <span className="text-red">⚠️ Loading Error</span>}
      </div>
      {selectedMigrations.length > 0 && (
        <div className="flex flex-col">
          <div className={migrateGridLayoutCss}>
            {selectedMigrations.map((migration, i) => (
              <SelectTridentPoolPanel
                key={i}
                migration={migration}
                tridentPools={data ?? []}
                source={MigrationSource.SUSHI_V2}
                setFunc={(migration) => dispatch(editMigration({ indexToReplace: i, migration }))}
              />
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center mt-10">
        <Button color="gradient" disabled={leftToSelect !== 0} onClick={mockExecute(selectedMigrations)}>
          {leftToSelect === 0 ? i18n._(t`Confirm Migration`) : i18n._(t`Select Pools`)}
        </Button>
        <div
          className="cursor-pointer text-blue text-center md:text-left"
          onClick={() => router.push('/trident/migrate')}
        >
          {i18n._(t`← Previous Step`)}
        </div>
      </div>
    </div>
  )
}
