import { Currency, Token, WETH } from '@sushiswap/sdk'
import { useBentoBoxContract, useBoringHelperContract, useContract } from '../../hooks/useContract'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import ERC20_ABI from '../../constants/abis/erc20.json'
import { KashiContext } from '../../context'
import { WrappedTokenInfo } from '../lists/hooks'
import { Zero } from '@ethersproject/constants'
import { e10 } from '../../functions/math'
import { easyAmount } from '../../functions/kashi'
import { getAddress } from '@ethersproject/address'
import { toAmount } from '../../functions/bentobox'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useAllTokens } from '../../hooks/Tokens'
import { useSingleCallResult } from '../multicall/hooks'
import useTransactionStatus from '../../hooks/useTransactionStatus'

export interface BentoBalance {
    address: string
    name: string
    symbol: string
    decimals: number | string
    balance: any
    bentoBalance: any
    wallet: any
    bento: any
}

export function useBentoBalances(): BentoBalance[] {
    const { chainId, account } = useActiveWeb3React()

    const boringHelperContract = useBoringHelperContract()

    const tokens = useAllTokens()

    const weth = WETH[chainId || 1].address
    const info = useContext(KashiContext).state.info

    const call = useSingleCallResult(boringHelperContract, 'getBalances', [
        account,
        Object.values(tokens).map((token: Token) => token.address),
    ])

    return useMemo(() => {
        if (call.loading || call.error || !call.result) return []
        return Object.values(tokens)
            .map((token: WrappedTokenInfo, i) => {
                const fullToken = {
                    ...token,
                    ...call.result[0][i],
                    usd: e10(token.decimals).muldiv(info?.ethRate || Zero, call.result[0][i].rate),
                }
                return {
                    address: token.address,
                    name: token.name,
                    symbol: token.address === weth ? Currency.getNativeCurrencySymbol(chainId) : token.symbol,
                    decimals: token.decimals,
                    tokenInfo: token.tokenInfo,
                    balance: token.address === weth ? info?.ethBalance : call.result[0][i].balance,
                    bentoBalance: call.result[0][i].bentoBalance,
                    wallet: easyAmount(
                        token.address === weth ? info?.ethBalance : call.result[0][i].balance,
                        fullToken
                    ),
                    bento: easyAmount(toAmount(fullToken, call.result[0][i].bentoBalance), fullToken),
                }
            })
            .filter((token) => token.balance.gt('0') || token.bentoBalance.gt('0'))
    }, [call])
}

export function useBentoBalance(tokenAddress: string): { value: BigNumber; decimals: number } {
    const { account } = useActiveWeb3React()

    const boringHelperContract = useBoringHelperContract()
    const bentoBoxContract = useBentoBoxContract()
    const tokenAddressChecksum = getAddress(tokenAddress)
    const tokenContract = useContract(tokenAddressChecksum ? tokenAddressChecksum : undefined, ERC20_ABI)

    const currentTransactionStatus = useTransactionStatus()

    const [balance, setBalance] = useState<any>()

    const fetchBentoBalance = useCallback(async () => {
        const balances = await boringHelperContract?.getBalances(account, [tokenAddressChecksum])
        const decimals = await tokenContract?.decimals()

        const amount = BigNumber.from(balances[0].bentoShare).isZero()
            ? BigNumber.from(0)
            : BigNumber.from(balances[0].bentoBalance)
                  .mul(BigNumber.from(balances[0].bentoAmount))
                  .div(BigNumber.from(balances[0].bentoShare))

        setBalance({
            value: amount,
            decimals: decimals,
        })
    }, [account, tokenAddressChecksum, tokenContract, boringHelperContract])

    useEffect(() => {
        if (account && bentoBoxContract && boringHelperContract && tokenContract) {
            fetchBentoBalance()
        }
    }, [account, bentoBoxContract, currentTransactionStatus, fetchBentoBalance, tokenContract, boringHelperContract])

    return balance
}

export function useBentoMasterContractAllowed(masterContract?: string, user?: string): boolean | undefined {
    const contract = useBentoBoxContract()

    const inputs = useMemo(() => [masterContract, user], [masterContract, user])
    const allowed = useSingleCallResult(contract, 'masterContractApproved', inputs).result

    return useMemo(() => (allowed ? allowed[0] : undefined), [allowed])
}
