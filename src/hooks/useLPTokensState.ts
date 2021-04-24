import { ChainId, Token, TokenAmount } from '@sushiswap/sdk'
import { FACTORY_ADDRESS as UNI_FACTORY_ADDRESS } from '@uniswap/sdk'
import {
    useDashboard2Contract,
    useDashboardContract,
    usePancakeV1FactoryContract,
    useUniV2FactoryContract
} from 'hooks/useContract'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { NEVER_RELOAD, useSingleCallResult, useSingleContractMultipleData } from 'state/multicall/hooks'
import { useActiveWeb3React } from '../hooks'
import LPToken from '../types/LPToken'

import axios from 'axios'
import { isAddressString } from 'utils'
import { getAddress } from '@ethersproject/address'

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
    const uniswapFactoryContract = useUniV2FactoryContract()
    const pancakeFactoryContract = usePancakeV1FactoryContract()
    const dashboardContract = useDashboardContract()
    const dashboard2Contract = useDashboard2Contract()
    const [lpTokens, setLPTokens] = useState<LPToken[]>([])
    const [selectedLPToken, setSelectedLPToken] = useState<LPToken>()
    const [selectedLPTokenAllowed, setSelectedLPTokenAllowed] = useState(false)
    const [loading, setLoading] = useState(true)
    const updatingLPTokens = useRef(false)

    const updateLPTokens = useCallback(async () => {
        console.log('Update tokens')
        updatingLPTokens.current = true
        try {
            const length =
                chainId !== ChainId.BSC
                    ? await uniswapFactoryContract?.allPairsLength()
                    : await pancakeFactoryContract?.allPairsLength()

            let userLP
            if (chainId === ChainId.MAINNET) {
                const LP_TOKENS_LIMIT = 300 // Mainnet likes short but can handle multiple function calls in async
                console.log('Available Pairs:', length.toNumber(), LP_TOKENS_LIMIT)

                const pages = []
                for (let i = 0; i < length.toNumber(); i += LP_TOKENS_LIMIT) pages.push(i)
                userLP = (
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
            } else if (chainId === ChainId.BSC) {
                // BSC rpc nodes are inconsistent, given array size better to fallback to covalenthq
                userLP = []
                const API_KEY = 'ckey_cba3674f2ce5450f9d5dd290589'
                const response = await fetch(
                    `https://api.covalenthq.com/v1/56/address/${String(
                        account
                    ).toLowerCase()}/stacks/pancakeswap/balances/?key=${API_KEY}`
                )
                const { data } = await response.json()
                console.log({ data })
                const activeLP: any[] = data.pancakeswap.balances
                    .filter((balance: any) => balance.pool_token.balance !== '0')
                    .map((balance: any) => {
                        return {
                            token: getAddress(balance.pool_token.contract_address),
                            token0: getAddress(balance.token_0.contract_address),
                            token1: getAddress(balance.token_1.contract_address)
                        }
                    })
                userLP = activeLP.flat()
            } else {
                userLP = []
            }
            //console.log('userLP:', userLP)

            const tokenDetails = (
                await dashboardContract?.getTokenInfo(
                    Array.from(new Set(userLP.reduce((a: any, b: any) => a.push(b.token, b.token0, b.token1) && a, [])))
                )
            ).reduce((acc: any, cur: any) => {
                acc[cur[0]] = cur
                return acc
            }, {})
            //console.log('tokenDetails:', tokenDetails)

            const balances = (
                await dashboardContract?.findBalances(
                    account,
                    userLP.map(pair => pair.token)
                )
            ).map((el: any) => el.balance)

            // console.log({ balances }, userLP.length, balances.length)

            const userLPDetails = (
                await dashboard2Contract?.getPairsFull(
                    account,
                    userLP.map(pair => pair.token)
                )
            ).reduce((acc: any, cur: any) => {
                acc[cur[0]] = cur
                return acc
            }, {})
            // console.log({ userLP })
            // console.log({ userLPDetails })

            const data =
                balances.length > 0 //  since covalent is a few blocks behind, it might return a balance, but actual actionable balance is null, therefore if null return null
                    ? userLP.map((pair, index) => {
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

                          console.log({ bal: balances[index] })

                          return {
                              address: pair.token,
                              decimals: token.decimals,
                              name: `${tokenA.symbol}-${tokenB.symbol} LP Token`,
                              symbol: `${tokenA.symbol}-${tokenB.symbol}`,
                              balance: new TokenAmount(token, balances[index]),
                              totalSupply,
                              tokenA: new Token(
                                  chainId as ChainId,
                                  tokenA.token,
                                  tokenA.decimals,
                                  tokenA.symbol,
                                  tokenA.name
                              ),
                              tokenB: new Token(
                                  chainId as ChainId,
                                  tokenB.token,
                                  tokenB.decimals,
                                  tokenB.symbol,
                                  tokenB.name
                              )
                          } as LPToken
                      })
                    : []
            if (data) {
                setLPTokens(data)
            }
        } finally {
            setLoading(false)
            updatingLPTokens.current = false
        }
    }, [chainId, account, uniswapFactoryContract, pancakeFactoryContract, dashboardContract, dashboard2Contract])

    useEffect(() => {
        if (
            chainId &&
            account &&
            uniswapFactoryContract &&
            dashboardContract &&
            dashboard2Contract &&
            pancakeFactoryContract &&
            !updatingLPTokens.current
        ) {
            updateLPTokens()
        }
    }, [
        account,
        chainId,
        dashboardContract,
        dashboard2Contract,
        uniswapFactoryContract,
        pancakeFactoryContract,
        updateLPTokens
    ])

    return {
        updateLPTokens,
        lpTokens,
        selectedLPToken,
        setSelectedLPToken,
        selectedLPTokenAllowed,
        setSelectedLPTokenAllowed,
        loading,
        updatingLPTokens: updatingLPTokens.current
    }
}

export default useLPTokensState
