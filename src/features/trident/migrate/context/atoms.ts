import { Pair } from '@sushiswap/core-sdk'
import { AvailablePoolConfig } from 'app/components/Migrate/migrate-utils'
import { TridentPool } from 'app/services/graph'
import { atom } from 'recoil'

export enum MigrationSource {
  SUSHI_V2 = 'Sushi v2',
}

export interface v2Migration {
  v2Pair: Pair
  matchingTridentPool?: TridentPool
  poolToCreate?: AvailablePoolConfig
}

export const v2PairsToMigrateAtom = atom<v2Migration[]>({
  key: 'v2PairsToMigrateAtom',
  default: [],
})
