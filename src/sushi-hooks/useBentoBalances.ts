import { useCallback, useContext, useEffect, useState } from 'react'
import { useActiveWeb3React } from 'hooks'
import { useBentoBoxContract } from './useContract'
import { useDefaultTokens } from 'hooks/Tokens'
import orderBy from 'lodash/orderBy'
import { Currency, Token, WETH } from '@sushiswap/sdk'

import { useBoringHelperContract } from 'hooks/useContract'
import { KashiContext } from 'kashi'
import { easyAmount } from 'kashi/functions/kashi'
import { toAmount } from 'kashi/functions/bentobox'
import { e10, ZERO } from 'kashi/functions'
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

function useBentoBalances(): BentoBalance[] {
    const { chainId, library, account } = useActiveWeb3React()
    const blockNumber = useBlockNumber()

    const boringHelperContract = useBoringHelperContract()
    const bentoBoxContract = useBentoBoxContract()

    const [balances, setBalances] = useState<any>()
    const tokens = Object.values(useDefaultTokens()).filter((token: Token) => token.chainId === chainId)

    const weth = WETH[chainId || 1].address
    const info = useContext(KashiContext).state.info

    const fetchBentoBalances = useCallback(async () => {
        console.log("Loading balances")
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
                    name: token.name || 'AAA',
                    symbol: token.address === weth ? Currency.getNativeCurrencySymbol(chainId) : token.symbol,
                    decimals: token.decimals || 'AAA',
                    balance: balanceData[i].balance,
                    bentoBalance: balanceData[i].bentoBalance,
                    wallet: easyAmount(balanceData[i].balance, fullToken),
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
    }, [blockNumber, account, bentoBoxContract, library])

    return balances
}

export default useBentoBalances
