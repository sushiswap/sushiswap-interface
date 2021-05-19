import { Currency, ETHER, JSBI, TokenAmount } from '@sushiswap/sdk'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Plus } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import Alert from '../../components/Alert'
import { LightCard } from '../../components/CardLegacy'
import { AutoColumn } from '../../components/Column'
import CurrencySelectPanel from '../../components/CurrencySelectPanel'
import { FindPoolTabs } from '../../components/NavigationTabs'
import { MinimalPositionCard } from '../../components/PositionCard'
import { AutoRow } from '../../components/Row'
import { PairState, usePair } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { usePairAdder } from '../../state/user/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { StyledInternalLink } from '../../theme'
import { currencyId } from '../../utils/currencyId'
import { Dots } from '../Pool/styleds'
import { Helmet } from 'react-helmet'
import { t, Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'

enum Fields {
    TOKEN0 = 0,
    TOKEN1 = 1
}

export default function PoolFinder() {
    const { i18n } = useLingui()
    const { account } = useActiveWeb3React()
    const theme = useContext(ThemeContext)

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
        <>
            <Helmet>
                <title>{i18n._(t`Find Pool`)} | Sushi</title>
            </Helmet>
            <div className="relative w-full max-w-lg rounded bg-dark-900 shadow-liquidity-purple-glow">
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
                                <button className="bg-dark-900 rounded-full p-3px -mt-6 -mb-6 z-10">
                                    <div className="bg-dark-800 hover:bg-dark-700 rounded-full p-3">
                                        <Plus size="32" color={theme.text2} />
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
                                borderRadius: '12px'
                            }}
                            justify={'center'}
                            gap={'0 3px'}
                        >
                            <Text textAlign="center" fontWeight={500}>
                                {i18n._(t`Pool Found!`)}
                            </Text>
                            <StyledInternalLink to={`/pool`}>
                                <Text textAlign="center">{i18n._(t`Manage this pool`)}</Text>
                            </StyledInternalLink>
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
                                        <StyledInternalLink
                                            to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                                        >
                                            <Text textAlign="center">{i18n._(t`Add liquidity`)}</Text>
                                        </StyledInternalLink>
                                    </AutoColumn>
                                </LightCard>
                            )
                        ) : validPairNoLiquidity ? (
                            <LightCard padding="45px 10px">
                                <AutoColumn gap="sm" justify="center">
                                    <Text textAlign="center">{i18n._(t`No pool found`)}</Text>
                                    <StyledInternalLink to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                                        {i18n._(t`Create pool`)}
                                    </StyledInternalLink>
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
        </>
    )
}
