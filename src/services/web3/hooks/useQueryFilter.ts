import { ChainId } from '@sushiswap/core-sdk'
import { Contract } from '@ethersproject/contracts'
import useSWR from 'swr'
import stringify from 'fast-json-stable-stringify'

async function queryFilter(contract: Contract, event, fromBlockOrBlockHash, toBlock) {
  return await contract.queryFilter(event, fromBlockOrBlockHash, toBlock)
}

export function useQueryFilter({
  chainId = ChainId.ETHEREUM,
  shouldFetch = true,
  contract,
  event,
  fromBlockOrBlockHash = undefined,
  toBlock = undefined,
}) {
  const { data } = useSWR(
    shouldFetch ? () => ['queryFilter', chainId, stringify(event), fromBlockOrBlockHash, toBlock] : null,
    () => queryFilter(contract, event, fromBlockOrBlockHash, toBlock)
  )
  return data
}
