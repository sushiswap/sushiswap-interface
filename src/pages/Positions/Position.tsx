import React, { useContext } from 'react'
import { JSBI, Pair } from '@sushiswap/sdk'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useTotalSupply } from 'data/TotalSupply'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { ThemeContext } from 'styled-components'
import { Sliders } from 'react-feather'

type Props = {
    pair: Pair
    showUnwrapped?: boolean
}

export default function Position({ pair, showUnwrapped = false }: Props) {
    const theme = useContext(ThemeContext)
    const { account, chainId } = useActiveWeb3React()

    const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
    const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

    const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
    const totalPoolTokens = useTotalSupply(pair.liquidityToken)

    const [token0Deposited, token1Deposited] =
        !!pair &&
        !!totalPoolTokens &&
        !!userPoolBalance &&
        // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
        JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
            ? [
                  pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
                  pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
              ]
            : [undefined, undefined]

    return (
        <div className="flex justify-between items-center rounded bg-dark-800 px-3 py-1 mb-3">
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={30} margin={true} />
            <div className="flex-1 mr-2 py-2 rounded-lg text-xs md:text-sm md:text-bold text-white">
                {currency0.getSymbol(chainId)} / {currency1.getSymbol(chainId)}
            </div>
            <div className="flex flex-col md:flex-row justify-between flex-1 text-xs md:text-sm px-3 py-2 text-primary rounded-lg md:text-bold bg-dark-900">
                <div>
                    <span className="text-white">{token0Deposited ? token0Deposited?.toSignificant(6) : '-'}</span>
                    <span className="ml-1">{currency0.getSymbol(chainId)}</span>
                </div>
                <div>
                    <span className="text-white">{token1Deposited ? token1Deposited?.toSignificant(6) : '-'}</span>
                    <span className="ml-1">{currency1.getSymbol(chainId)}</span>
                </div>
            </div>
            <div className="ml-2 md:ml-4 md:mr-1 self-center">
                <Sliders strokeWidth={2} size={18} color={theme.white} />
            </div>
        </div>
    )
}
