// import { Fee } from '@sushiswap/trident-sdk'

type FilterSymbolsFunc<T> = (arg0: { original: { name: string; symbol: string } }[], arg1: string[], arg2: T) => any[]

export const filterForSearchQuery: FilterSymbolsFunc<{ searchQuery: string }> = (rows, id, filterValue) => {
  console.log('filter', rows, filterValue)
  return rows.filter(({ original }) => {
    // Allow searching for symbol (LINK) or name (chainlink)
    const searchableText = original?.name?.concat(original?.symbol)?.toLowerCase()
    // return true
    return !filterValue.searchQuery.length || searchableText.includes(filterValue.searchQuery.toLowerCase())
  })
}
