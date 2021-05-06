import { Currency, ETHER, JSBI, TokenAmount } from '@sushiswap/sdk'
import React, { useCallback, useEffect, useState } from 'react'
import { Plus } from 'react-feather'
import { Text } from 'rebass'
import { ButtonDropdownLight } from '../../components/ButtonLegacy'
import { BlueCard, LightCard } from '../../components/CardLegacy'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import CurrencyLogo from '../../components/CurrencyLogo'
import { FindPoolTabs } from '../../components/NavigationTabs'
import { MinimalPositionCard } from '../../components/PositionCard'
import Row from '../../components/Row'
import CurrencySearchModal from '../../components/SearchModal/CurrencySearchModal'
import { PairState, usePair } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { usePairAdder } from '../../state/user/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { StyledInternalLink, TYPE } from '../../theme'
import { currencyId } from '../../utils/currencyId'
import { Dots } from '../Pool/styleds'
import { Helmet } from 'react-helmet'
import { t, Trans } from '@lingui/macro'

enum Fields {
    TOKEN0 = 0,
    TOKEN1 = 1
}

export default function PoolFinder() {
    const { account, chainId } = useActiveWeb3React()

    const [showSearch, setShowSearch] = useState<boolean>(false)
    const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)

    const [currency0, setCurrency0] = useState<Currency | null>(ETHER)
    const [currency1, setCurrency1] = useState<Currency | null>(null)

    const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined)
    const addPair = usePairAdder()
    useEffect(() => {
        if (pair) {
            addPair(pair)
        }
    }, [pair, addPair])

    const validPairNoLiquidity: boolean =
        pairState === PairState.NOT_EXISTS ||
        Boolean(
            pairState === PairState.EXISTS &&
                pair &&
                JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
                JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0))
        )

    const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken)
    const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, JSBI.BigInt(0)))

    const handleCurrencySelect = useCallback(
        (currency: Currency) => {
            if (activeField === Fields.TOKEN0) {
                setCurrency0(currency)
            } else {
                setCurrency1(currency)
            }
        },
        [activeField]
    )

    const handleSearchDismiss = useCallback(() => {
        setShowSearch(false)
    }, [setShowSearch])

    const prerequisiteMessage = (
        <LightCard padding="45px 10px">
            <Text textAlign="center">
                {!account ? t`Connect to a wallet to find pools` : t`Select a token to find your liquidity`}
            </Text>
        </LightCard>
    )

    return (
        <>
            <Helmet>
                <title>{t`Find Pool`} | Sushi</title>
            </Helmet>
            <div className="relative w-full max-w-lg rounded bg-dark-900 shadow-liquidity-purple-glow">
                <FindPoolTabs />
                <AutoColumn style={{ padding: '1rem' }} gap="md">
                    <BlueCard>
                        <AutoColumn gap="10px">
                            <TYPE.link fontWeight={400} color={'primaryText1'}>
                                <Trans>
                                    <b>Tip:</b> Use this tool to find pairs that don&apos;t automatically appear in the
                                    interface
                                </Trans>
                            </TYPE.link>
                        </AutoColumn>
                    </BlueCard>
                    <ButtonDropdownLight
                        onClick={() => {
                            setShowSearch(true)
                            setActiveField(Fields.TOKEN0)
                        }}
                    >
                        {currency0 ? (
                            <Row>
                                <CurrencyLogo currency={currency0} />
                                <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                                    {currency0.getSymbol(chainId)}
                                </Text>
                            </Row>
                        ) : (
                            <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                                {t`Select a token`}
                            </Text>
                        )}
                    </ButtonDropdownLight>

                    <ColumnCenter>
                        <Plus size="16" color="#888D9B" />
                    </ColumnCenter>

                    <ButtonDropdownLight
                        onClick={() => {
                            setShowSearch(true)
                            setActiveField(Fields.TOKEN1)
                        }}
                    >
                        {currency1 ? (
                            <Row>
                                <CurrencyLogo currency={currency1} />
                                <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                                    {currency1.getSymbol(chainId)}
                                </Text>
                            </Row>
                        ) : (
                            <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                                {t`Select a token`}
                            </Text>
                        )}
                    </ButtonDropdownLight>

                    {hasPosition && (
                        <ColumnCenter
                            style={{
                                justifyItems: 'center',
                                backgroundColor: '',
                                padding: '12px 0px',
                                borderRadius: '12px'
                            }}
                        >
                            <Text textAlign="center" fontWeight={500}>
                                {t`Pool Found!`}
                            </Text>
                            <StyledInternalLink to={`/pool`}>
                                <Text textAlign="center">{t`Manage this pool`}</Text>
                            </StyledInternalLink>
                        </ColumnCenter>
                    )}

                    {currency0 && currency1 ? (
                        pairState === PairState.EXISTS ? (
                            hasPosition && pair ? (
                                <MinimalPositionCard pair={pair} border="1px solid #CED0D9" />
                            ) : (
                                <LightCard padding="45px 10px">
                                    <AutoColumn gap="sm" justify="center">
                                        <Text textAlign="center">{t`You don’t have liquidity in this pool yet`}</Text>
                                        <StyledInternalLink
                                            to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                                        >
                                            <Text textAlign="center">{t`Add liquidity`}</Text>
                                        </StyledInternalLink>
                                    </AutoColumn>
                                </LightCard>
                            )
                        ) : validPairNoLiquidity ? (
                            <LightCard padding="45px 10px">
                                <AutoColumn gap="sm" justify="center">
                                    <Text textAlign="center">{t`No pool found`}</Text>
                                    <StyledInternalLink to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                                        {t`Create pool`}
                                    </StyledInternalLink>
                                </AutoColumn>
                            </LightCard>
                        ) : pairState === PairState.INVALID ? (
                            <LightCard padding="45px 10px">
                                <AutoColumn gap="sm" justify="center">
                                    <Text textAlign="center" fontWeight={500}>
                                        {t`Invalid pair`}
                                    </Text>
                                </AutoColumn>
                            </LightCard>
                        ) : pairState === PairState.LOADING ? (
                            <LightCard padding="45px 10px">
                                <AutoColumn gap="sm" justify="center">
                                    <Text textAlign="center">
                                        {t`Loading`}
                                        <Dots />
                                    </Text>
                                </AutoColumn>
                            </LightCard>
                        ) : null
                    ) : (
                        prerequisiteMessage
                    )}
                </AutoColumn>

                <CurrencySearchModal
                    isOpen={showSearch}
                    onCurrencySelect={handleCurrencySelect}
                    onDismiss={handleSearchDismiss}
                    showCommonBases
                    selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
                />
            </div>
        </>
    )
}
