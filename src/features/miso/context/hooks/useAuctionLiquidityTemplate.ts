import { Interface } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import MISO from '@sushiswap/miso/exports/all.json'
import BASE_AUCTION_ABI from 'app/constants/abis/base-auction.json'
import { useContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useSingleCallResult, useSingleContractMultipleMethods } from 'app/state/multicall/hooks'

const AUCTION_INTERFACE = new Interface(BASE_AUCTION_ABI)

type useAuctionLiquidityTemplate = (auction: string) => { liquidityTemplate?: BigNumber; lpTokenAddress?: string }

export const useAuctionLiquidityTemplate: useAuctionLiquidityTemplate = (auction: string) => {
  const { chainId } = useActiveWeb3React()
  const contract = useContract(auction, AUCTION_INTERFACE)
  const { result } = useSingleCallResult(contract, 'wallet')
  const palContract = useContract(
    result?.[0],
    chainId ? MISO[chainId]?.['ropsten']?.contracts.PostAuctionLauncher.abi : undefined
  )

  const results = useSingleContractMultipleMethods(palContract, [
    { methodName: 'liquidityTemplate', callInputs: [] },
    { methodName: 'getLPTokenAddress', callInputs: [] },
  ])

  if (results && Array.isArray(results) && results.length === 2) {
    const [liquidityTemplate, lpTokenAddress] = results.map((el) => {
      if (el.result && Array.isArray(el.result) && el.result.length > 0) {
        return el.result[0]
      }

      return undefined
    })

    return { liquidityTemplate, lpTokenAddress }
  }

  return {
    liquidityTemplate: undefined,
    lpTokenAddress: undefined,
  }
}

export default useAuctionLiquidityTemplate
