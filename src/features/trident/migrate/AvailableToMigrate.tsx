import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { LoadingSpinner } from 'app/components/LoadingSpinner'
import { SelectPairMigratePanel } from 'app/components/Migrate/SelectPairMigratePanel'
import { MigrationSource, v2PairsToMigrateAtom } from 'app/features/trident/migrate/context/atoms'
import { useV2PairsWithLiquidity } from 'app/features/trident/migrate/context/useV2PairsWithLiquidity'
import { addOrRemoveFromSelectedList } from 'app/features/trident/migrate/context/utils'
import { useActiveWeb3React } from 'app/services/web3'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { useRecoilState } from 'recoil'

import Typography from '../../../components/Typography'

export const migrateGridLayoutCss = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'

export const AvailableToMigrate: FC = () => {
  const { i18n } = useLingui()
  const router = useRouter()
  const { account } = useActiveWeb3React()
  const { pairs, loading } = useV2PairsWithLiquidity()
  const [selectedMigrations, setSelectedMigrations] = useRecoilState(v2PairsToMigrateAtom)

  return (
    <div>
      <div className="flex gap-3 items-center">
        <Typography variant="h3" className="text-high-emphesis" weight={700}>
          {i18n._(t`Available to Migrate`)}
        </Typography>
        <LoadingSpinner active={loading} />
      </div>
      {!account && <div className="mt-3">{i18n._(t`Connect to your wallet first ↗️`)}</div>}
      {account && pairs.length === 0 && !loading && (
        <div className="mt-3">{i18n._(t`You have no pools available for migration`)}</div>
      )}
      {pairs.length > 0 && (
        <div className="flex flex-col">
          <div className={migrateGridLayoutCss}>
            {pairs.map((pair, i) => {
              return (
                <SelectPairMigratePanel
                  key={i}
                  pair={pair}
                  source={MigrationSource.SUSHI_V2} // TODO: Needs support for Uniswap, Quickswap, etc
                  setFunc={addOrRemoveFromSelectedList(selectedMigrations, setSelectedMigrations)}
                  checkedState={selectedMigrations.some(
                    (m) => m.v2Pair.liquidityToken.address === pair.liquidityToken.address
                  )}
                />
              )
            })}
          </div>
          <Button
            className="mt-6 max-w-xl self-center"
            color={selectedMigrations.length ? 'gradient' : 'gray'}
            disabled={Boolean(!selectedMigrations.length)}
            onClick={() => router.push('/trident/migrate/confirm')}
          >
            {selectedMigrations.length === 1
              ? i18n._(t`Migrate Pool`)
              : selectedMigrations.length > 1
              ? i18n._(t`Migrate Pools`)
              : i18n._(t`Select liquidity positions to migrate`)}
          </Button>
        </div>
      )}
    </div>
  )
}
