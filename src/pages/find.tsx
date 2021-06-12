import { Currency, JSBI, TokenAmount } from '@sushiswap/sdk'
import { PairState, usePair } from '../hooks/usePairs'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Trans, t } from '@lingui/macro'

import Alert from '../components/Alert'
import { AutoColumn } from '../components/Column'
import { AutoRow } from '../components/Row'
import CurrencySelectPanel from '../components/CurrencySelectPanel'
import { DefaultLayout } from '../layouts'
import Dots from '../components/Dots'
import { FindPoolTabs } from '../components/NavigationTabs'
import Head from 'next/head'
import { LightCard } from '../components/CardLegacy'
import Link from 'next/link'
import { MinimalPositionCard } from '../components/PositionCard'
import { Plus } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { currencyId } from '../functions/currency'
import { useActiveWeb3React } from '../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'
import { usePairAdder } from '../state/user/hooks'
import { useTokenBalance } from '../state/wallet/hooks'

enum Fields {
    TOKEN0 = 0,
    TOKEN1 = 1,
}

export default function PoolFinder() {
    const { i18n } = useLingui()
    const { account, chainId } = useActiveWeb3React()
    const theme = useContext(ThemeContext)

    const [showSearch, setShowSearch] = useState<boolean>(false)
    const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)

    const [currency0, setCurrency0] = useState<Currency | null>(Currency.getNativeCurrency(chainId))
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

    const switchTokens = useCallback(() => {
        setCurrency0(currency1)
        setCurrency1(currency0)
    }, [currency0, currency1])

    const handleCurrencySelect = useCallback(
        (currency: Currency) => {
            if (activeField === Fields.TOKEN0) {
                if (currency === currency1) switchTokens()
                else setCurrency0(currency)
            } else {
                if (currency === currency0) switchTokens()
                else setCurrency1(currency)
            }
        },
        [activeField]
    )

    const prerequisiteMessage = (
        <LightCard padding="45px 10px">
            <Text textAlign="center">
                {!account
                    ? i18n._(t`Connect to a wallet to find pools`)
                    : i18n._(t`Select a token to find your liquidity`)}
            </Text>
        </LightCard>
    )

    return (
        <DefaultLayout>
            <Head>
                <title>{i18n._(t`Find Pool`)} | Sushi</title>
                <meta name="description" content="Find pool" />
            </Head>
            <div className="relative w-full max-w-2xl rounded bg-dark-900 shadow-liquidity">
                <FindPoolTabs />
                <AutoColumn style={{ padding: '1rem' }} gap="md">
                    <Alert
                        showIcon={false}
                        message={
                            <Trans>
                                <b>Tip:</b> Use this tool to find pairs that don&apos;t automatically appear in the
                                interface
                            </Trans>
                        }
                        type="information"
                    />

                    <AutoColumn gap={'md'}>
                        <CurrencySelectPanel
                            currency={currency0}
                            onClick={() => setActiveField(Fields.TOKEN0)}
                            onCurrencySelect={handleCurrencySelect}
                            otherCurrency={currency1}
                            id="pool-currency-input"
                        />
                        <AutoColumn justify="space-between">
                            <AutoRow justify={'flex-start'} style={{ padding: '0 1rem' }}>
                                <button className="z-10 -mt-6 -mb-6 rounded-full bg-dark-900 p-3px">
                                    <div className="p-3 rounded-full bg-dark-800 hover:bg-dark-700">
                                        <Plus size="32" />
                                    </div>
                                </button>
                            </AutoRow>
                        </AutoColumn>
                        <CurrencySelectPanel
                            currency={currency1}
                            onClick={() => setActiveField(Fields.TOKEN1)}
                            onCurrencySelect={handleCurrencySelect}
                            otherCurrency={currency0}
                            id="pool-currency-output"
                        />
                    </AutoColumn>

                    {hasPosition && (
                        <AutoRow
                            style={{
                                justifyItems: 'center',
                                backgroundColor: '',
                                padding: '12px 0px',
                                borderRadius: '12px',
                            }}
                            justify={'center'}
                            gap={'0 3px'}
                        >
                            <Text textAlign="center" fontWeight={500}>
                                {i18n._(t`Pool Found!`)}
                            </Text>
                            <Link href={`/pool`}>
                                <a className="text-center">{i18n._(t`Manage this pool`)}</a>
                            </Link>
                        </AutoRow>
                    )}

                    {currency0 && currency1 ? (
                        pairState === PairState.EXISTS ? (
                            hasPosition && pair ? (
                                <MinimalPositionCard pair={pair} border="1px solid #CED0D9" />
                            ) : (
                                <LightCard padding="45px 10px">
                                    <AutoColumn gap="sm" justify="center">
                                        <Text textAlign="center">
                                            {i18n._(t`You don’t have liquidity in this pool yet`)}
                                        </Text>
                                        <Link
                                            href={`/add/${currencyId(currency0, chainId)}/${currencyId(
                                                currency1,
                                                chainId
                                            )}`}
                                        >
                                            <a className="text-center text-blue text-opacity-80 hover:text-opacity-100">
                                                {i18n._(t`Add liquidity`)}
                                            </a>
                                        </Link>
                                    </AutoColumn>
                                </LightCard>
                            )
                        ) : validPairNoLiquidity ? (
                            <LightCard padding="45px 10px">
                                <AutoColumn gap="sm" justify="center">
                                    <Text textAlign="center">{i18n._(t`No pool found`)}</Text>
                                    <Link
                                        href={`/add/${currencyId(currency0, chainId)}/${currencyId(
                                            currency1,
                                            chainId
                                        )}`}
                                    >
                                        <a className="text-center">{i18n._(t`Create pool`)}</a>
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
            </div>
        </DefaultLayout>
    )
}
