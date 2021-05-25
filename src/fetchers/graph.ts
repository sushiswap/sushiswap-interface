import { request } from 'graphql-request'

export const exchange = query => request('https://api.thegraph.com/subgraphs/name/sushiswap/exchange', query)

export const bar = query => request('https://api.thegraph.com/subgraphs/name/matthewlilley/bar', query)

export const bentobox = query => request('https://api.thegraph.com/subgraphs/name/sushiswap/bentobox', query)

export default query => request('https://api.thegraph.com/subgraphs/name/matthewlilley/bar', query)
