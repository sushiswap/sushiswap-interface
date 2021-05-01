import { useCallback } from 'react'
import { Currency, CurrencyAmount } from '@sushiswap/sdk'
import { useRouterContract, useZapperContract } from '../hooks/useContract'
import { useTransactionAdder } from '../state/transactions/hooks'

import { useActiveWeb3React } from '../hooks'

const useZapper = (currency?: Currency) => {
    const { chainId, account } = useActiveWeb3React()
    const zapperContract = useZapperContract(true)
    const routerContract = useRouterContract()
    const addTransaction = useTransactionAdder()

    const zapIn = useCallback(
        async (
            fromTokenContractAddress,
            pairAddress,
            amount: CurrencyAmount | undefined,
            minPoolTokens,
            swapTarget,
            swapData
        ) => {
            try {
                const tx = await zapperContract?.ZapIn(
                    fromTokenContractAddress,
                    pairAddress,
                    amount?.raw.toString(),
                    minPoolTokens,
                    swapTarget,
                    // Unknown byte data param (swapData), is maybe something to do with routing for non native lp tokens?
                    swapData,
                    // Affiliate
                    '0x0000000000000000000000000000000000000000',
                    // Transfer residual (Can save gas if set to false but unsure about math right now)
                    true,
                    {
                        // Value for transfer should be 0 unless it's an ETH transfer
                        value:
                            fromTokenContractAddress === '0x0000000000000000000000000000000000000000'
                                ? amount?.raw.toString()
                                : 0
                    }
                )
                return addTransaction(tx, { summary: `Zap ${amount?.toSignificant(6)} ${currency?.symbol}` })
            } catch (e) {
                console.log(e)
            }
        },
        [currency, chainId]
    )

    const swap = useCallback(
        async path => {
            const tx = await routerContract?.swapExactTokensForTokens(
                1000000,
                0,
                path,
                // bestTrade?.route.path.map(t => t.address),
                account,
                1622582801
            )
            return addTransaction(tx, { summary: `Swap test` })
        },
        [currency, chainId, account]
    )

    return { zapIn, swap }
}

export default useZapper
