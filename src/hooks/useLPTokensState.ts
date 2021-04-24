import { ChainId, Token, TokenAmount } from '@sushiswap/sdk'
import { useDashboardContract } from 'hooks/useContract'
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
            }

            const stack: any = {
                [ChainId.MAINNET]: 'uniswap',
                [ChainId.BSC]: 'pancakeswap'
            }

            const response = await fetch(
                `https://api.covalenthq.com/v1/${chainId}/address/${String(account).toLowerCase()}/stacks/${
                    stack[chainId]
                }/balances/?key=ckey_cba3674f2ce5450f9d5dd290589`
            )
            const { data } = await response.json()

            console.log({ data })

            const userLP: any[] = data.pancakeswap.balances.filter((balance: any) => balance.pool_token.balance !== '0')

            console.log('userLP:', userLP)

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
            ).reduce((acc: any, cur: any) => {
                acc[cur[0]] = cur
                return acc
            }, {})

            console.log({ tokenDetails })

            const lpTokens = userLP.map((pair, index) => {
                const token = new Token(
                    chainId as ChainId,
                    pair.pool_token.contract_address,
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
                    tokenA: new Token(chainId as ChainId, tokenA.token, tokenA.decimals, tokenA.symbol, tokenA.name),
                    tokenB: new Token(chainId as ChainId, tokenB.token, tokenB.decimals, tokenB.symbol, tokenB.name)
                } as LPToken
            })
            if (lpTokens) {
                setLPTokens(lpTokens)
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
