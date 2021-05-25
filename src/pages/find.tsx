import { AutoColumn, ColumnCenter } from '../components/Column'
import { Currency, JSBI, NATIVE, TokenAmount } from '@sushiswap/sdk'
import React, { useCallback, useEffect, useState } from 'react'

import Alert from '../components/Alert'
import { ButtonDropdownLight } from '../components/ButtonLegacy'
import CurrencyLogo from '../components/CurrencyLogo'
import CurrencySearchModal from '../components/SearchModal/CurrencySearchModal'
import Dots from '../components/Dots'
import { FindPoolTabs } from '../components/NavigationTabs'
import Head from 'next/head'
import Layout from '../components/Layout'
import { LightCard } from '../components/CardLegacy'
import Link from 'next/link'
import { MinimalPositionCard } from '../components/PositionCard'
import { PairState } from '../hooks/usePairs'
import { Plus } from 'react-feather'
import Row from '../components/Row'
import { Text } from 'rebass'
import { currencyId } from '../functions/currency'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'
import { usePair } from '../hooks/usePair'
import { usePairAdder } from '../state/user/hooks'
import { useTokenBalance } from '../state/wallet/hooks'

enum Fields {
    TOKEN0 = 0,
    TOKEN1 = 1,
}

export default function PoolFinder() {
    const { i18n } = useLingui()
    const { account, chainId } = useActiveWeb3React()

    const [showSearch, setShowSearch] = useState<boolean>(false)
    const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)

    const [currency0, setCurrency0] = useState<Currency | null>(NATIVE)
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

    const prerequisiteMessage = !account
        ? i18n._(t`Connect to a wallet to find pools`)
        : i18n._(t`Select a token to find your liquidity`)

    return (
        <Layout>
            <Head>
                <title>{i18n._(t`Find Pool`)} | Sushi</title>
                <meta name="description" content="Find pool" />
            </Head>
            <div className="relative w-full max-w-2xl rounded bg-dark-900 shadow-liquidity-purple-glow">
                <FindPoolTabs />
                {/* <ExchangeHeader /> */}
                <AutoColumn style={{ padding: '1rem' }} gap="md">
                    <Alert
                        type="information"
                        message={i18n._(t`Tip: Use this tool to find pairs that don't automatically appear in the
                            interface`)}
                    ></Alert>
                    <ButtonDropdownLight
                        onClick={() => {
                            setShowSearch(true)
                            setActiveField(Fields.TOKEN0)
                        }}
                    >
                        {currency0 ? (
                            <Row>
                                <CurrencyLogo currency={currency0} />
                                <Text className="ml-3 text-lg font-bold">{currency0.getSymbol(chainId)}</Text>
                            </Row>
                        ) : (
                            <Text className="ml-3 text-lg font-bold">{i18n._(t`Select a token`)}</Text>
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
                                <Text className="ml-3 text-lg font-bold">{currency1.getSymbol(chainId)}</Text>
                            </Row>
                        ) : (
                            <Text className="ml-3 text-lg font-bold">{i18n._(t`Select a token`)}</Text>
                        )}
                    </ButtonDropdownLight>

                    {hasPosition && (
                        <ColumnCenter
                            style={{
                                justifyItems: 'center',
                                backgroundColor: '',
                                padding: '12px 0px',
                                borderRadius: '12px',
                            }}
                        >
                            <div className="font-semibold text-center">{i18n._(t`Pool Found!`)}</div>
                            <Link href={`/pool`}>
                                <a className="text-center">{i18n._(t`Manage this pool`)}</a>
                            </Link>
                        </ColumnCenter>
                    )}

                    {currency0 && currency1 ? (
                        pairState === PairState.EXISTS ? (
                            hasPosition && pair ? (
                                <MinimalPositionCard pair={pair} border="1px solid #CED0D9" />
                            ) : (
                                <LightCard padding="45px 10px">
                                    <AutoColumn gap="sm" justify="center">
                                        <div className="text-center">
                                            {i18n._(t`You don’t have liquidity in this pool yet`)}
                                        </div>
                                        <Link href={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                                            <a className="text-center">{i18n._(t`Add liquidity`)}</a>
                                        </Link>
                                    </AutoColumn>
                                </LightCard>
                            )
                        ) : validPairNoLiquidity ? (
                            <LightCard padding="45px 10px">
                                <AutoColumn gap="sm" justify="center">
                                    <div className="text-center">{i18n._(t`No pool found`)}</div>
                                    <Link href={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                                        <a>{i18n._(t`Create pool`)}</a>
                                    </Link>
                                </AutoColumn>
                            </LightCard>
                        ) : pairState === PairState.INVALID ? (
                            <LightCard padding="45px 10px">
                                <AutoColumn gap="sm" justify="center">
                                    <Text textAlign="center" fontWeight={500}>
                                        {i18n._(t`Invalid pair`)}
                                    </Text>
                                </AutoColumn>
                            </LightCard>
                        ) : pairState === PairState.LOADING ? (
                            <LightCard padding="45px 10px">
                                <AutoColumn gap="sm" justify="center">
                                    <Text textAlign="center">
                                        {i18n._(t`Loading`)}
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
        </Layout>
    )
}
