import { request } from 'graphql-request'
import useSWR from 'swr'

const QUERY = `{
    bar(id: "0x8798249c2e607446efb7ad49ec89dd1865ff4272") {
      ratio
    }
}`

const fetcher = (query) => request('https://api.thegraph.com/subgraphs/name/matthewlilley/bar', query)

// Returns ratio of XSushi:Sushi
export default function useSushiPerXSushi() {
  const { data } = useSWR(QUERY, fetcher)
  return parseFloat(data?.bar?.ratio)
}
