import { FeeTier, TridentPool } from '../../../services/graph/fetchers/pools'

type FilterSymbolsFunc<T> = (arg0: { original: TridentPool }[], arg1: string[], arg2: T) => any[]

export const filterForSearchQueryAndTWAP: FilterSymbolsFunc<{ searchQuery: string; twapEnabled: boolean }> = (
  rows,
  id,
  filterValue
) => {
  return rows.filter(({ original }) => {
    if (original.twapEnabled !== filterValue.twapEnabled) return false

    // Allow searching for symbol (LINK) or name (chainlink)
    const searchableText = original.symbols.concat(original.names).join(' ').toLowerCase()
    return !filterValue.searchQuery.length || searchableText.includes(filterValue.searchQuery.toLowerCase())
  })
}

export const feeTiersFilter: FilterSymbolsFunc<{ feeTiersSelected: FeeTier[] }> = (rows, id, filterValue) => {
  return rows.filter(({ original }) => {
    return !filterValue.feeTiersSelected.length || filterValue.feeTiersSelected.includes(original.swapFeePercent)
  })
}
