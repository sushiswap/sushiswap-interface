import { Contract } from '@ethersproject/contracts'
import { ChainId } from '@figswap/core-sdk'
import stringify from 'fast-json-stable-stringify'
import useSWR from 'swr'

// @ts-ignore TYPE NEEDS FIXING
async function queryFilter(contract: Contract, event, fromBlockOrBlockHash, toBlock) {
  return contract.queryFilter(event, fromBlockOrBlockHash, toBlock)
}

// TODO (amiller68): #Research What is this? Do we have to set it to Wallaby?
export function useQueryFilter({
  chainId = ChainId.WALLABY,
  shouldFetch = true,
  // @ts-ignore TYPE NEEDS FIXING
  contract,
  // @ts-ignore TYPE NEEDS FIXING
  event,
  fromBlockOrBlockHash = undefined,
  toBlock = undefined,
}) {
  return useSWR(
    shouldFetch ? () => ['queryFilter', chainId, stringify(event), fromBlockOrBlockHash, toBlock] : null,
    () => queryFilter(contract, event, fromBlockOrBlockHash, toBlock)
  )
}
