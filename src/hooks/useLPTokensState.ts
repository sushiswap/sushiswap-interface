import { ChainId, Token, TokenAmount } from '@sushiswap/sdk'
import { useDashboardContract, useDashboard2Contract, useQuickSwapFactoryContract } from 'hooks/useContract'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useActiveWeb3React } from '../hooks'
import LPToken from '../types/LPToken'
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
    const dashboardContract = useDashboardContract()
    const dashboard2Contract = useDashboard2Contract()
    const quickSwapFactoryContract = useQuickSwapFactoryContract()
    const [lpTokens, setLPTokens] = useState<LPToken[]>([])
    const [selectedLPToken, setSelectedLPToken] = useState<LPToken>()
    const [selectedLPTokenAllowed, setSelectedLPTokenAllowed] = useState(false)
    const [loading, setLoading] = useState(true)
    const updatingLPTokens = useRef(false)

    const updateLPTokens = useCallback(async () => {
        console.log('Update tokens')
        updatingLPTokens.current = true
        try {
            if (!chainId || ![ChainId.MAINNET, ChainId.BSC].includes(chainId)) {
                return
                // MATIC
            } else if (ChainId.MATIC === chainId) {
                const LP_TOKENS_LIMIT = 300
                const length = await quickSwapFactoryContract?.allPairsLength()
                const pages: number[] = []
                for (let i = 0; i < length; i += LP_TOKENS_LIMIT) pages.push(i)
                const userLP = (
                    await Promise.all(
                        pages.map(page =>
                            dashboardContract?.findPairs(
                                account,
                                '0xBCfCcbde45cE874adCB698cC183deBcF17952812', // Factory address
                                page,
                                Math.min(page + LP_TOKENS_LIMIT, length.toNumber())
                            )
                        )
                    )
                ).flat()
                const tokenDetails = (
                    await dashboardContract?.getTokenInfo(
                        Array.from(
                            new Set(userLP.reduce((a: any, b: any) => a.push(b.token, b.token0, b.token1) && a, []))
                        )
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
                )
                if (data) setLPTokens(data)

                // MAINNET, BSC
            } else if ([ChainId.MAINNET, ChainId.BSC].includes(chainId)) {
                const requests: any = {
                    [ChainId.MAINNET]: [
                        `https://api.covalenthq.com/v1/${ChainId.MAINNET}/address/${String(
                            account
                        ).toLowerCase()}/stacks/uniswap_v2/balances/?key=ckey_cba3674f2ce5450f9d5dd290589`
                    ],
                    [ChainId.BSC]: [
                        `https://api.covalenthq.com/v1/${ChainId.BSC}/address/${String(
                            account
                        ).toLowerCase()}/stacks/pancakeswap/balances/?key=ckey_cba3674f2ce5450f9d5dd290589`,
                        `https://api.covalenthq.com/v1/${ChainId.BSC}/address/${String(
                            account
                        ).toLowerCase()}/stacks/pancakeswap_v2/balances/?key=ckey_cba3674f2ce5450f9d5dd290589`
                    ]
                }

                const responses: any = await Promise.all(requests[chainId].map((request: any) => fetch(request)))

                let userLP = []

                if (chainId === ChainId.MAINNET) {
                    const { data } = await responses[0].json()
                    userLP = data?.['uniswap_v2']?.balances
                        ?.filter((balance: any) => balance.pool_token.balance !== '0')
                        .map((balance: any) => ({
                            ...balance,
                            version: 'v2'
                        }))
                } else if (chainId === ChainId.BSC) {
                    const { data: dataV1 } = await responses[0].json()
                    const { data: dataV2 } = await responses[1].json()

                    userLP = [
                        ...dataV1?.['pancakeswap']?.balances
                            ?.filter((balance: any) => balance.pool_token.balance !== '0')
                            .map((balance: any) => ({
                                ...balance,
                                version: 'v1'
                            })),
                        ...dataV2?.['pancakeswap']?.balances
                            ?.filter((balance: any) => balance.pool_token.balance !== '0')
                            .map((balance: any) => ({
                                ...balance,
                                version: 'v2'
                            }))
                    ]
                }

                const tokenDetails = (
                    await dashboardContract?.getTokenInfo(
                        Array.from(
                            new Set(
                                userLP.reduce(
                                    (a: any, b: any) =>
                                        a.push(
                                            b.pool_token.contract_address,
                                            b.token_0.contract_address,
                                            b.token_1.contract_address
                                        ) && a,
                                    []
                                )
                            )
                        )
                    )
                )?.reduce((acc: any, cur: any) => {
                    acc[cur[0]] = cur
                    return acc
                }, {})

                console.log({ tokenDetails })

                const lpTokens = userLP.map((pair: any, index: number) => {
                    const token = new Token(
                        chainId as ChainId,
                        getAddress(pair.pool_token.contract_address),
                        tokenDetails[getAddress(pair.pool_token.contract_address)].decimals,
                        tokenDetails[getAddress(pair.pool_token.contract_address)].symbol,
                        tokenDetails[getAddress(pair.pool_token.contract_address)].name
                    )
                    const tokenA = tokenDetails[getAddress(pair.token_0.contract_address)]
                    const tokenB = tokenDetails[getAddress(pair.token_1.contract_address)]

                    console.log({ tokenA, tokenB })

                    return {
                        address: getAddress(pair.pool_token.contract_address),
                        decimals: token.decimals,
                        name: `${tokenA.symbol}-${tokenB.symbol} LP Token`,
                        symbol: `${tokenA.symbol}-${tokenB.symbol}`,
                        balance: new TokenAmount(token, pair.pool_token.balance),
                        totalSupply: pair.pool_token.total_supply,
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
                        ),
                        version: pair.version
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
    }, [chainId, account, dashboardContract])

    useEffect(() => {
        if (chainId && account && dashboardContract && !updatingLPTokens.current) {
            updateLPTokens()
        }
    }, [account, chainId, dashboardContract, updateLPTokens])

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
