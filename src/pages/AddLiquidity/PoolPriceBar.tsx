import { Currency, Percent, Price } from '@sushiswap/sdk'
import React, { useContext } from 'react'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { AutoRow } from '../../components/Row'
import { ONE_BIPS } from '../../constants'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { Field } from '../../state/mint/actions'
import { TYPE } from '../../theme'
import { t } from '@lingui/macro'

export function PoolPriceBar({
    currencies,
    noLiquidity,
    poolTokenPercentage,
    price
}: {
    currencies: { [field in Field]?: Currency }
    noLiquidity?: boolean
    poolTokenPercentage?: Percent
    price?: Price
}) {
    const { chainId } = useActiveWeb3React()
    const theme = useContext(ThemeContext)
    return (
        <AutoColumn gap="md">
            <AutoRow justify="space-around" gap="4px">
                <AutoColumn justify="center">
                    <TYPE.black>{price?.toSignificant(6) ?? '-'}</TYPE.black>
                    <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
                        {t`${currencies[Field.CURRENCY_B]?.getSymbol(chainId)} per ${currencies[
                            Field.CURRENCY_A
                        ]?.getSymbol(chainId)}`}
                    </Text>
                </AutoColumn>
                <AutoColumn justify="center">
                    <TYPE.black>{price?.invert()?.toSignificant(6) ?? '-'}</TYPE.black>
                    <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
                        {t`${currencies[Field.CURRENCY_A]?.getSymbol(chainId)} per ${currencies[
                            Field.CURRENCY_B
                        ]?.getSymbol(chainId)}`}
                    </Text>
                </AutoColumn>
                <AutoColumn justify="center">
                    <TYPE.black>
                        {noLiquidity && price
                            ? '100'
                            : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ??
                              '0'}
                        %
                    </TYPE.black>
                    <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
                        {t`Share of Pool`}
                    </Text>
                </AutoColumn>
            </AutoRow>
        </AutoColumn>
    )
}
