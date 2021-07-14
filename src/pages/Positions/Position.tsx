import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { JSBI, Pair, Percent, TokenAmount } from '@sushiswap/sdk'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useTotalSupply } from 'data/TotalSupply'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import styled, { ThemeContext } from 'styled-components'
import { Sliders } from 'react-feather'

import { BIG_INT_ZERO } from '../../constants'
import { currencyId } from '../../utils/currencyId'
import { Text } from 'rebass'
import { AutoColumn } from '../../components/Column'
import { RowBetween, RowFixed } from '../../components/Row'
import CurrencyLogo from '../../components/CurrencyLogo'
import { ButtonPrimaryNormal } from '../../components/ButtonLegacy'

export const FixedHeightRow = styled(RowBetween)`
    height: 24px;
`

type Props = {
    pair: Pair
    showUnwrapped?: boolean
    stakedBalance?: TokenAmount // optional balance to indicate that liquidity is deposited in mining pool
}

export default function Position({ pair, showUnwrapped = false, stakedBalance }: Props) {
    const theme = useContext(ThemeContext)
    const { account, chainId } = useActiveWeb3React()

    const [showMore, setShowMore] = useState(false)

    const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
    const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

    const userDefaultPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
    const userPoolBalance = stakedBalance ? userDefaultPoolBalance?.add(stakedBalance) : userDefaultPoolBalance
    const totalPoolTokens = useTotalSupply(pair.liquidityToken)

    const poolTokenPercentage =
        !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
            ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
            : undefined

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
        <>
            <div
                className="flex justify-between items-center rounded bg-dark-800 px-3 py-3 mt-2"
                onClick={() => setShowMore(!showMore)}
            >
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
            {showMore && (
                <AutoColumn gap="8px" className="bg-dark-800 p-4 -mt-2 mb-2 rounded-b-lg">
                    <FixedHeightRow>
                        <Text fontSize={16} fontWeight={500}>
                            Your total pool tokens:
                        </Text>
                        <Text fontSize={16} fontWeight={500}>
                            {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                        </Text>
                    </FixedHeightRow>
                    {/* {stakedBalance && (
                        <FixedHeightRow>
                            <Text fontSize={16} fontWeight={500}>
                                Pool tokens in rewards pool:
                            </Text>
                            <Text fontSize={16} fontWeight={500}>
                                {stakedBalance.toSignificant(4)}
                            </Text>
                        </FixedHeightRow>
                    )} */}
                    <FixedHeightRow>
                        <RowFixed>
                            <Text fontSize={16} fontWeight={500}>
                                Pooled {currency0?.getSymbol(chainId)}:
                            </Text>
                        </RowFixed>
                        {token0Deposited ? (
                            <RowFixed>
                                <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                                    {token0Deposited?.toSignificant(6)}
                                </Text>
                                <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency0} />
                            </RowFixed>
                        ) : (
                            '-'
                        )}
                    </FixedHeightRow>

                    <FixedHeightRow>
                        <RowFixed>
                            <Text fontSize={16} fontWeight={500}>
                                Pooled {currency1?.getSymbol(chainId)}:
                            </Text>
                        </RowFixed>
                        {token1Deposited ? (
                            <RowFixed>
                                <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                                    {token1Deposited?.toSignificant(6)}
                                </Text>
                                <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency1} />
                            </RowFixed>
                        ) : (
                            '-'
                        )}
                    </FixedHeightRow>

                    <FixedHeightRow>
                        <Text fontSize={16} fontWeight={500}>
                            Your pool share:
                        </Text>
                        <Text fontSize={16} fontWeight={500}>
                            {poolTokenPercentage
                                ? (poolTokenPercentage.toFixed(2) === '0.00'
                                      ? '<0.01'
                                      : poolTokenPercentage.toFixed(2)) + '%'
                                : '-'}
                        </Text>
                    </FixedHeightRow>
                    {userDefaultPoolBalance && JSBI.greaterThan(userDefaultPoolBalance.raw, BIG_INT_ZERO) && (
                        <RowBetween marginTop="10px">
                            <ButtonPrimaryNormal
                                padding="8px"
                                borderRadius="8px"
                                as={Link}
                                to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                                width="48%"
                            >
                                Add
                            </ButtonPrimaryNormal>
                            <ButtonPrimaryNormal
                                padding="8px"
                                borderRadius="8px"
                                as={Link}
                                width="48%"
                                to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
                            >
                                Remove
                            </ButtonPrimaryNormal>
                        </RowBetween>
                    )}
                    {/* {stakedBalance && JSBI.greaterThan(stakedBalance.raw, BIG_INT_ZERO) && (
                        <ButtonPrimary
                            padding="8px"
                            borderRadius="8px"
                            as={Link}
                            to={`/yield/${currencyId(currency0)}/${currencyId(currency1)}`}
                            width="100%"
                        >
                            Manage Liquidity in Rewards Pool
                        </ButtonPrimary>
                    )} */}
                </AutoColumn>
            )}
        </>
    )
}
