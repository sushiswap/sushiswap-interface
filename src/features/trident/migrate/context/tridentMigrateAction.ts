import { Contract } from '@ethersproject/contracts'
import { CurrencyAmount, Token } from '@sushiswap/core-sdk'
import { v2Migration } from 'app/features/trident/migrate/context/migrateSlice'

// Because twap setting is a boolean, a few more checks are necessary
const getTwapSelection = (migration: v2Migration): boolean | undefined => {
  const tridentTwapSelection = migration.matchingTridentPool?.twapEnabled
  if (tridentTwapSelection !== undefined) return tridentTwapSelection
  return migration.poolToCreate?.twap
}

export const tridentMigrateAction = (
  contract: Contract,
  migration: v2Migration,
  lpTokenAmount: CurrencyAmount<Token>
): string => {
  const swapFee = migration.matchingTridentPool?.swapFee || migration.poolToCreate?.fee
  const twapEnabled = getTwapSelection(migration)

  if (swapFee === undefined || twapEnabled === undefined)
    throw new Error('Missing required swapFee or twapEnabled field')

  return contract.interface.encodeFunctionData('migrate', [
    migration.v2Pair.liquidityToken.address,
    lpTokenAmount.quotient.toString(),
    swapFee,
    twapEnabled,
    '1', // TODO: Need to simulate
  ])
}
