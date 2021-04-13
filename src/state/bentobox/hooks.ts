import { BigNumber } from '@ethersproject/bignumber'
import { useCallback, useEffect, useState, useContext } from 'react'
import ERC20_ABI from '../../constants/abis/erc20.json'
import { useActiveWeb3React, useBentoBoxContract, useBoringHelperContract, useContract } from '../../hooks'
import { isAddress } from '../../utils'
import useTransactionStatus from '../../sushi-hooks/useTransactionStatus'
import { Currency, Token, WETH } from '@sushiswap/sdk'
import { useDefaultTokens } from 'hooks/Tokens'
import { KashiContext } from 'kashi'
import { easyAmount, ZERO, e10, toAmount } from 'kashi/functions'
import orderBy from 'lodash/orderBy'
import { useBlockNumber } from 'state/application/hooks'

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
    const { chainId, library, account } = useActiveWeb3React()
    const blockNumber = useBlockNumber()

    const boringHelperContract = useBoringHelperContract()
    const bentoBoxContract = useBentoBoxContract()

    const [balances, setBalances] = useState<any>()
    const tokens = Object.values(useDefaultTokens()).filter((token: Token) => token.chainId === chainId)

    const weth = WETH[chainId || 1].address
    const info = useContext(KashiContext).state.info

    const fetchBentoBalances = useCallback(async () => {
        const balanceData = await boringHelperContract?.getBalances(
            account,
            tokens.map((token: any) => token.address)
        )

        const balancesWithDetails = tokens
            .map((token, i) => {
                const fullToken = {
                    ...token,
                    ...balanceData[i],
                    usd: e10(token.decimals).muldiv(info?.ethRate || ZERO, balanceData[i].rate)
                }

                return {
                    address: token.address,
                    name: token.name,
                    symbol: token.address === weth ? Currency.getNativeCurrencySymbol(chainId) : token.symbol,
                    decimals: token.decimals,
                    balance: token.address === weth ? info?.ethBalance : balanceData[i].balance,
                    bentoBalance: balanceData[i].bentoBalance,
                    wallet: easyAmount(token.address === weth ? info?.ethBalance : balanceData[i].balance, fullToken),
                    bento: easyAmount(toAmount(fullToken, balanceData[i].bentoBalance), fullToken)
                }
            })
            .filter(token => token.balance.gt('0') || token.bentoBalance.gt('0'))
        setBalances(orderBy(balancesWithDetails, ['name'], ['asc']))
    }, [account, tokens, boringHelperContract])

    useEffect(() => {
        if (account && bentoBoxContract && library) {
            fetchBentoBalances()
        }
    }, [blockNumber, account, bentoBoxContract, library, info])

    return balances
}

export function useBentoBalance(tokenAddress: string): { value: BigNumber; decimals: number } {
    const { account } = useActiveWeb3React()

    const boringHelperContract = useBoringHelperContract()
    const bentoBoxContract = useBentoBoxContract()
    const tokenAddressChecksum = isAddress(tokenAddress)
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
            decimals: decimals
        })
    }, [account, tokenAddressChecksum, tokenContract, boringHelperContract])

    useEffect(() => {
        if (account && bentoBoxContract && boringHelperContract && tokenContract) {
            fetchBentoBalance()
        }
    }, [account, bentoBoxContract, currentTransactionStatus, fetchBentoBalance, tokenContract, boringHelperContract])

    return balance
}
