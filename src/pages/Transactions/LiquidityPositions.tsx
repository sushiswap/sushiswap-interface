import React, { useContext } from 'react'
import { Currency } from '@sushiswap/sdk'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { ThemeContext } from 'styled-components'
import { Sliders } from 'react-feather'
import { Button } from 'components'
import { LinkStyledButton } from '../../theme'

type Position = {
    pairs: string
    pair1: {
        name: string
        amount: string
    }
    pair2: {
        name: string
        amount: string
    }
}

type Props = {
    positions: Position[]
}

export default function LiquidityPositions({ positions }: Props) {
    const theme = useContext(ThemeContext)
    return (
        <>
            <div className="flex flex-col md:flex-row justify-start md:justify-between mb-6">
                <div className="text-xl font-medium text-white">Your Liquidity Positions</div>
                <div className="flex items-center text-sm">
                    <span className="mr-1">Dont see a pool you joined?</span>
                    <LinkStyledButton>import it</LinkStyledButton>
                </div>
            </div>
            <div>
                {positions.map((t, i) => (
                    <div key={i} className="flex justify-between items-center rounded bg-dark-800 px-3 py-1 mb-3">
                        <DoubleCurrencyLogo
                            currency0={Currency.ETHER}
                            currency1={Currency.BNB}
                            size={30}
                            margin={true}
                        />
                        <div className="flex-1 mr-2 py-2 rounded-lg text-xs md:text-sm md:text-bold text-white">{t.pairs}</div>
                        <div className="flex flex-col md:flex-row justify-between flex-1 text-xs md:text-sm px-3 py-2 text-primary rounded-lg md:text-bold bg-dark-900">
                            <div>
                                <span className="text-white">{t.pair1.amount}</span>
                                <span className="ml-1">{t.pair1.name}</span>
                            </div>
                            <div>
                                <span className="text-white">{t.pair2.amount}</span>
                                <span className="ml-1">{t.pair2.name}</span>
                            </div>
                        </div>
                        <div className="ml-2 md:ml-4 md:mr-1 self-center">
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
