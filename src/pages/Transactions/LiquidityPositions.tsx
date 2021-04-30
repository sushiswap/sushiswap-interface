import React, { useContext } from 'react'
import { Currency } from '@sushiswap/sdk'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { ThemeContext } from 'styled-components'
import { Sliders } from 'react-feather'
import { Button } from 'components'
import { LinkStyledButton } from '../../theme'

type Props = {
    positions: string[]
}

export default function LiquidityPositions({ positions }: Props) {
    const theme = useContext(ThemeContext)
    return (
        <>
            <div className="flex justify-between mb-5">
                <div className="text-xl font-medium text-white">Your Liquidity Positions</div>
                <div className="flex items-center text-sm">
                    <span className="mr-1">Dont see a pool you joined?</span>
                    <LinkStyledButton>import it</LinkStyledButton>
                </div>
            </div>
            <div>
                {positions.map(t => (
                    <div key={t} className="flex justify-between items-center rounded bg-dark-800 px-3 py-1 mb-3">
                        <DoubleCurrencyLogo
                            currency0={Currency.ETHER}
                            currency1={Currency.BNB}
                            size={34}
                            margin={true}
                        />
                        <div className="flex-1 text-sm px-3 py-2 text-center text-primary rounded-lg text-bold bg-dark-900">
                            {t}
                        </div>
                        <div className="ml-4 self-center">
                            <Sliders strokeWidth={2} size={18} color={theme.white} />
                        </div>
                    </div>
                ))}
                <div className="flex gap-4 mt-5 mb-1">
                    <Button size="large" color="gradient">
                        Add Liquidity
                    </Button>
                    <Button size="large" className="w-full bg-dark-800 text-secondary">
                        Create a Pair
                    </Button>
                </div>
            </div>
        </>
    )
}
