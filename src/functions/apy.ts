import { aprToApy } from './convert'
import { formatPercent } from './format'

export const getApy = (volume: number, liquidity: number) => {
  const apy = aprToApy((((volume / 7) * 365 * 0.0025) / liquidity) * 100, 3650)
  if (apy > 1000) return '>10,000%'
  return formatPercent(apy)
}
