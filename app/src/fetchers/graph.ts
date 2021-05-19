import { request } from 'graphql-request'

export default query => request('https://api.thegraph.com/subgraphs/name/matthewlilley/bar', query)
