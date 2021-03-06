import { useDashboard2Contract, useDashboardContract, useUniV2FactoryContract } from './useContract'
import { useActiveWeb3React } from '../hooks'
import { FACTORY_ADDRESS as UNI_FACTORY_ADDRESS } from '@uniswap/sdk'
import { useCallback, useEffect, useState } from 'react'
import { ChainId, Token, TokenAmount } from '@sushiswap/sdk'
import LPToken from '../types/LPToken'

const LP_TOKENS_LIMIT = 100

export interface LPTokensState {
  lpTokens: LPToken[]
  selectedLPToken?: LPToken
  setSelectedLPToken: (token?: LPToken) => void
  selectedLPTokenAllowed: boolean
  setSelectedLPTokenAllowed: (allowed: boolean) => void
  loading: boolean
}

const useLPTokensState = () => {
  const { account, chainId } = useActiveWeb3React()
  const factoryContract = useUniV2FactoryContract()
  const dashboardContract = useDashboardContract()
  const dashboard2Contract = useDashboard2Contract()
  const [lpTokens, setLPTokens] = useState<LPToken[]>([])
  const [selectedLPToken, setSelectedLPToken] = useState<LPToken>()
  const [selectedLPTokenAllowed, setSelectedLPTokenAllowed] = useState(false)
  const [loading, setLoading] = useState(true)

  const find = useCallback(async () => {
    try {
      const length = await factoryContract?.allPairsLength()

      const pages: number[] = []
      for (let i = 0; i < length; i += LP_TOKENS_LIMIT) pages.push(i)

      const userLP = (
        await Promise.all(
          pages.map(page =>
            dashboardContract?.findPairs(
              account,
              UNI_FACTORY_ADDRESS,
              page,
              Math.min(page + LP_TOKENS_LIMIT, length.toNumber())
            )
          )
        )
      ).flat()

      const tokenDetails = (
        await dashboardContract?.getTokenInfo(
          Array.from(new Set(userLP.reduce((a: any, b: any) => a.push(b.token, b.token0, b.token1) && a, [])))
        )
      ).reduce((acc: any, cur: any) => {
        acc[cur[0]] = cur
        return acc
      }, {})

      const balances = (
        await dashboardContract?.findBalances(
          account,
          userLP.map(pair => pair.token)
        )
      ).map((el: any) => el.balance)

      const userLPDetails = (
        await dashboard2Contract?.getPairsFull(
          account,
          userLP.map(pair => pair.token)
        )
      ).reduce((acc: any, cur: any) => {
        acc[cur[0]] = cur
        return acc
      }, {})

      const data = await Promise.all(
        userLP.map(async (pair, index) => {
          const { totalSupply } = userLPDetails[pair.token]
          const token = new Token(
            chainId as ChainId,
            tokenDetails[pair.token].token,
            tokenDetails[pair.token].decimals,
            tokenDetails[pair.token].symbol,
            tokenDetails[pair.token].name
          )
          const tokenA = tokenDetails[pair.token0]
          const tokenB = tokenDetails[pair.token1]

          return {
            address: pair.token,
            decimals: token.decimals,
            name: `${tokenA.symbol}-${tokenB.symbol} LP Token`,
            symbol: `${tokenA.symbol}-${tokenB.symbol}`,
            balance: new TokenAmount(token, balances[index]),
            totalSupply,
            tokenA: new Token(chainId as ChainId, tokenA.token, tokenA.decimals, tokenA.symbol, tokenA.name),
            tokenB: new Token(chainId as ChainId, tokenA.token, tokenB.decimals, tokenB.symbol, tokenB.name)
          } as LPToken
        })
      )

      if (data) setLPTokens(data)
    } finally {
      setLoading(false)
    }
  }, [chainId, account, dashboard2Contract, dashboardContract, factoryContract])

  useEffect(() => {
    if (account && factoryContract && dashboard2Contract && dashboardContract && chainId) {
      find()
    }
  }, [account, dashboard2Contract, dashboardContract, factoryContract, find, chainId])

  return {
    lpTokens,
    selectedLPToken,
    setSelectedLPToken,
    selectedLPTokenAllowed,
    setSelectedLPTokenAllowed,
    loading
  }
}

export default useLPTokensState
