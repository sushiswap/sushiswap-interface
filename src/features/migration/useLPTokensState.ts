import { getAddress } from '@ethersproject/address'
import { ChainId, CurrencyAmount, Token } from '@sushiswap/core-sdk'
import { useAllTokens } from 'app/hooks/Tokens'
import { useBoringHelperContract, useDashboardContract, useQuickSwapFactoryContract } from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import { useCallback, useEffect, useRef, useState } from 'react'

import LPToken from './LPToken'

export interface LPTokensState {
  updateLPTokens: () => Promise<void>
  lpTokens: LPToken[]
  selectedLPToken?: LPToken
  setSelectedLPToken: (token?: LPToken) => void
  selectedLPTokenAllowed: boolean
  setSelectedLPTokenAllowed: (allowed: boolean) => void
  loading: boolean
  updatingLPTokens: boolean
}

const useLPTokensState = () => {
  const { account, chainId } = useActiveWeb3React()
  const boringHelperContract = useBoringHelperContract()
  const dashboardContract = useDashboardContract()
  const quickSwapFactoryContract = useQuickSwapFactoryContract()
  const [lpTokens, setLPTokens] = useState<LPToken[]>([])
  const [selectedLPToken, setSelectedLPToken] = useState<LPToken>()
  const [selectedLPTokenAllowed, setSelectedLPTokenAllowed] = useState(false)
  const [loading, setLoading] = useState(true)
  const tokens = useAllTokens()
  const updatingLPTokens = useRef(false)
  const updateLPTokens = useCallback(async () => {
    try {
      updatingLPTokens.current = true
      if (ChainId.MATIC === chainId) {
        const LP_TOKENS_LIMIT = 500
        const length = await quickSwapFactoryContract?.allPairsLength()
        const pages: number[] = []
        for (let i = 0; i < length; i += LP_TOKENS_LIMIT) pages.push(i)
        const pairs = (
          await Promise.all(
            pages.map((page) =>
              boringHelperContract?.getPairs(
                '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32', // Factory address
                page,
                Math.min(page + LP_TOKENS_LIMIT, length.toNumber())
              )
            )
          )
        )
          .flat()
          .filter((pair) => pair.token0 !== '0x1f6c3E047f529f82f743a7378A212a3d62fAA390')

        const pairAddresses = pairs.map((pair) => pair[0])
        const pollPairs = await boringHelperContract?.pollPairs(account, pairAddresses)
        const tokenAddresses = Array.from(
          new Set(pairs.reduce((a: any, b: any) => a.push(b.token, b.token0, b.token1) && a, []))
        ).flat()
        const tokenDetails = (await boringHelperContract?.getTokenInfo(tokenAddresses)).reduce((acc: any, cur: any) => {
          acc[cur[0]] = cur
          return acc
        }, {})

        const data = pairs.map((pair, index) => {
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
            address: token.address,
            decimals: token.decimals,
            name: token.name,
            symbol: token.symbol,
            balance: CurrencyAmount.fromRawAmount(token, pollPairs[index].balance),
            totalSupply: pair.totalSupply,
            tokenA: new Token(chainId as ChainId, tokenA.token, tokenA.decimals, tokenA.symbol, tokenA.name),
            tokenB: new Token(chainId as ChainId, tokenB.token, tokenB.decimals, tokenB.symbol, tokenB.name),
          } as LPToken
        })

        if (data) setLPTokens(data)

        // MAINNET, BSC
      } else if (chainId && [ChainId.ETHEREUM, ChainId.BSC].includes(chainId)) {
        const requests: any = {
          [ChainId.ETHEREUM]: [
            `https://api.covalenthq.com/v1/${ChainId.ETHEREUM}/address/${String(
              account
            ).toLowerCase()}/stacks/uniswap_v2/balances/?key=ckey_cba3674f2ce5450f9d5dd290589&page-size=1000`,
          ],
          [ChainId.BSC]: [
            `https://api.covalenthq.com/v1/${ChainId.BSC}/address/${String(
              account
            ).toLowerCase()}/stacks/pancakeswap/balances/?key=ckey_cba3674f2ce5450f9d5dd290589&page-size=1000`,
            `https://api.covalenthq.com/v1/${ChainId.BSC}/address/${String(
              account
            ).toLowerCase()}/stacks/pancakeswap_v2/balances/?key=ckey_cba3674f2ce5450f9d5dd290589&page-size=1000`,
          ],
        }

        const responses: any = await Promise.all(requests[chainId].map((request: any) => fetch(request)))

        console.log({ responses })

        let userLP = []

        if (chainId === ChainId.ETHEREUM) {
          const { data } = await responses[0].json()
          userLP = data?.['uniswap_v2']?.balances
            ?.filter((balance: any) => balance.pool_token.balance !== '0')
            .map((balance: any) => ({
              ...balance,
              version: 'v2',
            }))
        } else if (chainId === ChainId.BSC) {
          const { data: dataV1 } = await responses[0].json()
          const { data: dataV2 } = await responses[1].json()

          userLP = [
            // ...dataV1?.['pancakeswap']?.balances
            //   ?.filter((balance: any) => balance.pool_token.balance !== '0')
            //   .map((balance: any) => ({
            //     ...balance,
            //     version: 'v1',
            //   })),
            ...dataV2?.['pancakeswap']?.balances
              ?.filter((balance: any) => balance.pool_token.balance !== '0')
              .map((balance: any) => ({
                ...balance,
                version: 'v2',
              })),
          ]
        }

        const tokenDetails = (
          await dashboardContract?.getTokenInfo(
            Array.from(
              new Set(
                userLP?.reduce(
                  (a: any, b: any) =>
                    a.push(b.pool_token.contract_address, b.token_0.contract_address, b.token_1.contract_address) && a,
                  []
                )
              )
            )
          )
        )?.reduce((acc: any, cur: any) => {
          acc[cur[0]] = { ...cur }
          acc[cur[0]].decimals = acc[cur[0]].decimals.toNumber()
          return acc
        }, {})

        const lpTokens = userLP?.map((pair: any) => {
          const token = new Token(
            chainId as ChainId,
            getAddress(pair.pool_token.contract_address),
            tokenDetails[getAddress(pair.pool_token.contract_address)].decimals,
            tokenDetails[getAddress(pair.pool_token.contract_address)].symbol,
            tokenDetails[getAddress(pair.pool_token.contract_address)].name
          )
          const tokenA = tokenDetails[getAddress(pair.token_0.contract_address)]
          const tokenB = tokenDetails[getAddress(pair.token_1.contract_address)]

          return {
            address: getAddress(pair.pool_token.contract_address),
            decimals: token.decimals,
            name: `${tokenA.symbol}-${tokenB.symbol} LP Token`,
            symbol: `${tokenA.symbol}-${tokenB.symbol}`,
            balance: CurrencyAmount.fromRawAmount(token, pair.pool_token.balance),
            totalSupply: pair.pool_token.total_supply,
            tokenA:
              tokens[getAddress(pair.token_0.contract_address)] ||
              new Token(
                chainId as ChainId,
                tokenA.address || tokenA.token,
                tokenA.decimals,
                tokenA.symbol,
                tokenA.name
              ),
            tokenB:
              tokens[getAddress(pair.token_1.contract_address)] ||
              new Token(
                chainId as ChainId,
                tokenB.address || tokenB.token,
                tokenB.decimals,
                tokenB.symbol,
                tokenB.name
              ),
            version: pair.version,
          } as LPToken
        })
        if (lpTokens) {
          setLPTokens(lpTokens)
        }
      }
    } finally {
      setLoading(false)
      updatingLPTokens.current = false
    }
  }, [chainId, quickSwapFactoryContract, boringHelperContract, account, dashboardContract, tokens])

  useEffect(() => {
    if (chainId && account && boringHelperContract && !updatingLPTokens.current) {
      updateLPTokens()
    }
  }, [account, chainId, boringHelperContract, updateLPTokens])

  return {
    updateLPTokens,
    lpTokens,
    selectedLPToken,
    setSelectedLPToken,
    selectedLPTokenAllowed,
    setSelectedLPTokenAllowed,
    loading,
    updatingLPTokens: updatingLPTokens.current,
  }
}

export default useLPTokensState
