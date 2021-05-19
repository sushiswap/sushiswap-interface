import { AutoRow, RowBetween, RowFixed } from '../Row'
import { ButtonEmpty, ButtonPrimary, ButtonPrimaryNormal } from '../ButtonLegacy'
import Card, { LightCard } from '../CardLegacy'
import { ChevronDown, ChevronUp } from 'react-feather'
import { JSBI, Pair, Percent, TokenAmount } from '@sushiswap/sdk'
import React, { useState } from 'react'
import { darken, transparentize } from 'polished'

import { AutoColumn } from '../Column'
import { BIG_INT_ZERO } from '../../constants'
import CurrencyLogo from '../CurrencyLogo'
import { Dots } from '../Swap/styleds'
import DoubleCurrencyLogo from '../DoubleLogo'
import ExternalLink from '../ExternalLink'
import Link from 'next/link'
import { Text } from 'rebass'
import { currencyId } from '../../functions/currency'
import styled from 'styled-components'
import { t } from '@lingui/macro'
import { unwrappedToken } from '../../functions/currency/wrappedCurrency'
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
`
const StyledPositionCard = styled(LightCard)<{ bgColor: any }>`
  border: none
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
                  pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
              ]
            : [undefined, undefined]

    return (
        <>
            {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, JSBI.BigInt(0)) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-purple rounded p-4 bg-opacity-20 w-full mt-4 whitespace-nowrap">
                    <div className="flex justify-between">
                        <div className="text-high-emphesis">{i18n._(t`Your Pool Tokens`)}</div>
                        <div className="text-primary font-bold">
                            {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-high-emphesis">{i18n._(t`Pooled ${currency0.getSymbol(chainId)}`)}</div>
                        <div className="text-primary font-bold">{token0Deposited?.toSignificant(6)}</div>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-high-emphesis">{i18n._(t`Your Pool Share`)}</div>
                        <div className="text-primary font-bold">
                            {poolTokenPercentage ? poolTokenPercentage.toFixed(6) + '%' : '-'}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-high-emphesis">{i18n._(t`Pooled ${currency1.getSymbol(chainId)}`)}</div>
                        <div className="text-primary font-bold">{token1Deposited?.toSignificant(6)}</div>
                    </div>
                </div>
            ) : (
                <div className="bg-purple rounded p-4 bg-opacity-20 w-full mt-4">
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
                  pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
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

                        <ExternalLink
                            style={{ width: '100%', textAlign: 'center' }}
                            href={`https://analytics.sushi.com/user/${account}`}
                        >
                            View accrued fees and analytics <span style={{ fontSize: '11px' }}>↗</span>
                        </ExternalLink>

                        {userDefaultPoolBalance && JSBI.greaterThan(userDefaultPoolBalance.raw, BIG_INT_ZERO) && (
                            <RowBetween marginTop="10px">
                                <ButtonPrimaryNormal
                                    padding="8px"
                                    borderRadius="8px"
                                    as={Link}
                                    href={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                                    width="48%"
                                >
                                    <a>{i18n._(t`Add`)}</a>
                                </ButtonPrimaryNormal>
                                <ButtonPrimaryNormal
                                    padding="8px"
                                    borderRadius="8px"
                                    as={Link}
                                    width="48%"
                                    href={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
                                >
                                    <a>{i18n._(t`Remove`)}</a>
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
