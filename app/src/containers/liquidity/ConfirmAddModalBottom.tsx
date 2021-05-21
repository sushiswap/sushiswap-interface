import { Currency, CurrencyAmount, Fraction, Percent } from '@sushiswap/sdk'
import { RowBetween, RowFixed } from '../../components/Row'

import { ButtonPrimary } from '../../components/ButtonLegacy'
import CurrencyLogo from '../../components/CurrencyLogo'
import { Field } from '../../state/mint/actions'
import React from 'react'
import { Text } from 'rebass'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'

export function ConfirmAddModalBottom({
    noLiquidity,
    price,
    currencies,
    parsedAmounts,
    poolTokenPercentage,
    onAdd
}: {
    noLiquidity?: boolean
    price?: Fraction
    currencies: { [field in Field]?: Currency }
    parsedAmounts: { [field in Field]?: CurrencyAmount }
    poolTokenPercentage?: Percent
    onAdd: () => void
}) {
    const { i18n } = useLingui()
    const { chainId } = useActiveWeb3React()
    return (
        <>
            <RowBetween>
                <div>{i18n._(t`${currencies[Field.CURRENCY_A]?.getSymbol(chainId)} Deposited`)}</div>
                <RowFixed>
                    <CurrencyLogo currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} />
                    <div>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</div>
                </RowFixed>
            </RowBetween>
            <RowBetween>
                <div>{i18n._(t`${currencies[Field.CURRENCY_B]?.getSymbol(chainId)} Deposited`)}</div>
                <RowFixed>
                    <CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
                    <div>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</div>
                </RowFixed>
            </RowBetween>
            <RowBetween>
                <div>{i18n._(t`Rates`)}</div>
                <div>
                    {`1 ${currencies[Field.CURRENCY_A]?.getSymbol(chainId)} = ${price?.toSignificant(4)} ${currencies[
                        Field.CURRENCY_B
                    ]?.getSymbol(chainId)}`}
                </div>
            </RowBetween>
            <RowBetween style={{ justifyContent: 'flex-end' }}>
                <div>
                    {`1 ${currencies[Field.CURRENCY_B]?.getSymbol(chainId)} = ${price
                        ?.invert()
                        .toSignificant(4)} ${currencies[Field.CURRENCY_A]?.getSymbol(chainId)}`}
                </div>
            </RowBetween>
            <RowBetween>
                <div>{i18n._(t`Share of Pool:`)}</div>
                <div>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</div>
            </RowBetween>
            <ButtonPrimary style={{ margin: '20px 0 0 0' }} onClick={onAdd}>
                <Text className="text-lg font-medium">
                    {noLiquidity ? i18n._(t`Create Pool & Supply`) : i18n._(t`Confirm Supply`)}
                </Text>
            </ButtonPrimary>
        </>
    )
}

export default ConfirmAddModalBottom
