import { Pair } from '@sushiswap/core-sdk'
import { FeeTier, TridentPool } from 'app/services/graph'

export const deDupe = (value: any, i: number, arr: any[]) => arr.indexOf(value) === i

const tridentPoolMatches = (pair: Pair, tridentPools: TridentPool[]) => {
  return tridentPools.filter((pool) => {
    /* Cannot transfer to pools with more than two assets */
    if (pool.assets.length !== 2) return false

    const tridentAddress0 = pool.assets[0].id.toLowerCase()
    const tridentAddress1 = pool.assets[1].id.toLowerCase()
    const v2Address0 = pair.token0.address.toLowerCase()
    const v2Address1 = pair.token1.address.toLowerCase()
    return (
      (tridentAddress0 === v2Address0 && tridentAddress1 === v2Address1) ||
      (tridentAddress0 === v2Address1 && tridentAddress1 === v2Address0)
    )
  })
}

export type AvailablePoolConfig = { fee: FeeTier; twap: boolean }

/* This feels clumsy, but used to ensure ALL FeeTiers are represented and type enforced */
const rec: Record<FeeTier, undefined> = { [0.01]: undefined, [0.05]: undefined, [0.3]: undefined, [1]: undefined }
const feeTiers: (keyof typeof rec)[] = [0.01, 0.05, 0.3, 1]

const getAvailablePoolOptions = (matches: TridentPool[]): AvailablePoolConfig[] => {
  const configs: AvailablePoolConfig[] = []

  for (const fee of feeTiers) {
    const twapMatches = matches
      .filter((pool) => pool.swapFeePercent === fee)
      .map((pool) => pool.twapEnabled)
      .filter(deDupe)

    /* both TWAP values represented already */
    if (twapMatches.length === 2) continue

    /* need to represent the opposite twap option */
    if (twapMatches.length === 1) {
      configs.push({ fee, twap: !twapMatches[0] })
    }

    /* both twap options for this fee tier are available */
    if (!twapMatches.length) {
      configs.push({ fee, twap: true })
      configs.push({ fee, twap: false })
    }
  }

  return configs
}

export const matchV2PairWithTridentPools = (pair: Pair, tridentPools: TridentPool[]) => {
  const matches = tridentPoolMatches(pair, tridentPools)
  return {
    matches,
    availableToCreate: getAvailablePoolOptions(matches),
  }
}
