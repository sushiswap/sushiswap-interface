import { AutoRow, RowBetween, RowFixed } from '../Row'
import { ButtonEmpty, ButtonPrimary, ButtonPrimaryNormal } from '../ButtonLegacy'
import Card, { LightCard } from '../CardLegacy'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Fraction, JSBI, Pair, Percent, TokenAmount } from '@sushiswap/sdk'
import React, { useState } from 'react'
import { currencyId, unwrappedToken } from '../../functions/currency'
import { darken, transparentize } from 'polished'

import { AutoColumn } from '../Column'
import { BIG_INT_ZERO } from '../../constants'
import CurrencyLogo from '../CurrencyLogo'
import Dots from '../Dots'
import DoubleCurrencyLogo from '../DoubleLogo'
import { Text } from 'rebass'
import { shortenString } from '../../functions/format'
import styled from 'styled-components'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useColor } from '../../hooks/useColor'
import { useLingui } from '@lingui/react'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useTotalSupply } from '../../hooks/useTotalSupply'

export const FixedHeightRow = styled(RowBetween)`
    height: 24px;
`

export const HoverCard = styled(Card)`
    border: 1px solid transparent;
    :hover {
        border: 1px solid ${({ theme }) => darken(0.06, theme.bg2)};
    }
`
const StyledPositionCard = styled(LightCard)<{ bgColor: any }>`
  /* border: 1px solid ${({ theme }) => theme.text4}; */
  border: none
//   background: ${({ theme }) => transparentize(0.6, theme.bg1)};
  /* background: ${({ theme, bgColor }) =>
      `radial-gradient(91.85% 100% at 1.84% 0%, ${transparentize(0.8, bgColor)} 0%, ${theme.bg3} 100%) `}; */
  position: relative;
  overflow: hidden;
`

interface PositionCardProps {
    pair: Pair
    showUnwrapped?: boolean
    border?: string
    stakedBalance?: TokenAmount // optional balance to indicate that liquidity is deposited in mining pool
}

export function MinimalPositionCard({ pair, showUnwrapped = false, border }: PositionCardProps) {
    const { i18n } = useLingui()
    const { account, chainId } = useActiveWeb3React()

    const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
    const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

    const [showMore, setShowMore] = useState(false)

    const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
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
                  pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
              ]
            : [undefined, undefined]

    const formatBalance = () => {
        if (userPoolBalance?.divide('10000000000').lessThan(new Fraction('1', '100000'))) return '<0.00001'
        return userPoolBalance?.toSignificant(4)
    }

    return (
        <>
            {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, JSBI.BigInt(0)) ? (
                <div className="p-5 rounded bg-dark-800">
                    <AutoColumn gap={'md'}>
                        <Text fontWeight={400} fontSize={18}>
                            Your Position
                        </Text>
                        <div className="flex flex-col md:flex-row md:justify-between">
                            <div className="flex items-center">
                                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={42} />
                                <Text fontWeight={500} fontSize={24} className={'ml-3'}>
                                    {shortenString(
                                        `${pair.token0.getSymbol(chainId)}/${pair.token1.getSymbol(chainId)}`,
                                        8
                                    )}
                                </Text>
                            </div>
                            <div className="flex items-center mt-3 md:mt-0">
                                <Text fontSize={16} fontWeight={400}>
                                    {userPoolBalance ? formatBalance() : '-'}
                                </Text>
                                <Text fontSize={16} fontWeight={400} color={'#7F7F7F'}>
                                    &nbsp;
                                    {i18n._(t`Pool Tokens`)}
                                </Text>
                            </div>
                        </div>
                        <div className="flex flex-col w-full p-3 mt-3 space-y-1 rounded bg-dark-900 text-high-emphesis">
                            <RowBetween>
                                <Text fontSize={14} fontWeight={400}>
                                    {i18n._(t`Your pool share`)}
                                </Text>
                                <Text fontSize={14} fontWeight={700}>
                                    {poolTokenPercentage ? poolTokenPercentage.toFixed(6) + '%' : '-'}
                                </Text>
                            </RowBetween>
                            <RowBetween>
                                <Text fontSize={14} fontWeight={400}>
                                    Supplied {currency0.getSymbol(chainId)}:
                                </Text>
                                {token0Deposited ? (
                                    <RowFixed>
                                        <Text fontSize={16} fontWeight={400}>
                                            {token0Deposited?.toSignificant(6)}
                                        </Text>
                                        <Text
                                            fontSize={14}
                                            fontWeight={700}
                                            marginLeft={'3px'}
                                            className={'text-secondary'}
                                        >
                                            {currency0.getSymbol(chainId)}
                                        </Text>
                                    </RowFixed>
                                ) : (
                                    '-'
                                )}
                            </RowBetween>
                            <RowBetween>
                                <Text fontSize={14} fontWeight={400}>
                                    Supplied {currency1.getSymbol(chainId)}:
                                </Text>
                                {token1Deposited ? (
                                    <RowFixed>
                                        <Text fontSize={16} fontWeight={400}>
                                            {token1Deposited?.toSignificant(6)}
                                        </Text>
                                        <Text
                                            fontSize={14}
                                            fontWeight={700}
                                            marginLeft={'3px'}
                                            className={'text-secondary'}
                                        >
                                            {currency1.getSymbol(chainId)}
                                        </Text>
                                    </RowFixed>
                                ) : (
                                    '-'
                                )}
                            </RowBetween>
                        </div>
                    </AutoColumn>
                </div>
            ) : (
                <div className="w-full p-4 mt-4 rounded bg-purple bg-opacity-20">
                    <p>
                        <span role="img" aria-label="wizard-icon">
                            ⭐️
                        </span>{' '}
                        {t`By adding liquidity you'll earn 0.25% of all trades on this pair proportional to your share
                        of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing
                        your liquidity.`}
                    </p>
                </div>
            )}
        </>
    )
}

export default function FullPositionCard({ pair, border, stakedBalance }: PositionCardProps) {
    const { i18n } = useLingui()
    const { account, chainId } = useActiveWeb3React()

    const currency0 = unwrappedToken(pair.token0)
    const currency1 = unwrappedToken(pair.token1)

    const [showMore, setShowMore] = useState(false)

    const userDefaultPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
    const totalPoolTokens = useTotalSupply(pair.liquidityToken)

    // if staked balance balance provided, add to standard liquidity amount
    const userPoolBalance = stakedBalance ? userDefaultPoolBalance?.add(stakedBalance) : userDefaultPoolBalance

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
                  pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
              ]
            : [undefined, undefined]

    const backgroundColor = useColor(pair?.token0)

    return (
        <StyledPositionCard border={border} bgColor={backgroundColor}>
            <AutoColumn gap="12px">
                <FixedHeightRow>
                    <AutoRow gap="8px">
                        <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
                        <Text fontWeight={500} fontSize={20}>
                            {!currency0 || !currency1 ? (
                                <Dots>{i18n._(t`Loading`)}</Dots>
                            ) : (
                                `${currency0.getSymbol(chainId)}/${currency1.getSymbol(chainId)}`
                            )}
                        </Text>
                    </AutoRow>
                    <RowFixed gap="8px">
                        <ButtonEmpty
                            padding="6px 8px"
                            borderRadius="20px"
                            width="fit-content"
                            onClick={() => setShowMore(!showMore)}
                        >
                            {showMore ? (
                                <>
                                    {i18n._(t`Manage`)}
                                    <ChevronUp size="20" style={{ marginLeft: '10px' }} />
                                </>
                            ) : (
                                <>
                                    {i18n._(t`Manage`)}
                                    <ChevronDown size="20" style={{ marginLeft: '10px' }} />
                                </>
                            )}
                        </ButtonEmpty>
                    </RowFixed>
                </FixedHeightRow>

                {showMore && (
                    <AutoColumn gap="8px">
                        <FixedHeightRow>
                            <Text fontSize={16} fontWeight={500}>
                                {i18n._(t`Your total pool tokens`)}:
                            </Text>
                            <Text fontSize={16} fontWeight={500}>
                                {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                            </Text>
                        </FixedHeightRow>
                        {stakedBalance && (
                            <FixedHeightRow>
                                <Text fontSize={16} fontWeight={500}>
                                    {i18n._(t`Pool tokens in rewards pool`)}:
                                </Text>
                                <Text fontSize={16} fontWeight={500}>
                                    {stakedBalance.toSignificant(4)}
                                </Text>
                            </FixedHeightRow>
                        )}
                        <FixedHeightRow>
                            <RowFixed>
                                <Text fontSize={16} fontWeight={500}>
                                    {i18n._(t`Pooled ${currency0?.getSymbol(chainId)}`)}:
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
                                    {i18n._(t`Pooled ${currency1?.getSymbol(chainId)}`)}:
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
                                {i18n._(t`Your pool share`)}:
                            </Text>
                            <Text fontSize={16} fontWeight={500}>
                                {poolTokenPercentage
                                    ? (poolTokenPercentage.toFixed(2) === '0.00'
                                          ? '<0.01'
                                          : poolTokenPercentage.toFixed(2)) + '%'
                                    : '-'}
                            </Text>
                        </FixedHeightRow>

                        {/* <ButtonSecondary padding="8px" borderRadius="8px">
              <ExternalLink
                style={{ width: '100%', textAlign: 'center' }}
                href={`https://uniswap.info/account/${account}`}
              >
                View accrued fees and analytics<span style={{ fontSize: '11px' }}>↗</span>
              </ExternalLink>
            </ButtonSecondary> */}
                        {userDefaultPoolBalance && JSBI.greaterThan(userDefaultPoolBalance.raw, BIG_INT_ZERO) && (
                            <RowBetween marginTop="10px">
                                <ButtonPrimaryNormal
                                    padding="8px"
                                    borderRadius="8px"
                                    as={Link}
                                    to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                                    width="48%"
                                >
                                    {i18n._(t`Add`)}
                                </ButtonPrimaryNormal>
                                <ButtonPrimaryNormal
                                    padding="8px"
                                    borderRadius="8px"
                                    as={Link}
                                    width="48%"
                                    to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
                                >
                                    {i18n._(t`Remove`)}
                                </ButtonPrimaryNormal>
                            </RowBetween>
                        )}
                        {stakedBalance && JSBI.greaterThan(stakedBalance.raw, BIG_INT_ZERO) && (
                            <ButtonPrimary
                                padding="8px"
                                borderRadius="8px"
                                as={Link}
                                to={`/uni/${currencyId(currency0)}/${currencyId(currency1)}`}
                                width="100%"
                            >
                                {i18n._(t`Manage Liquidity in Rewards Pool`)}
                            </ButtonPrimary>
                        )}
                    </AutoColumn>
                )}
            </AutoColumn>
        </StyledPositionCard>
    )
}
