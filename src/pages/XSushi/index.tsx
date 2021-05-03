import { Paper } from 'kashi'
import React from 'react'
import { useActiveWeb3React } from '../../hooks'
import SushiDepositPanel from '../SushiBar/SushiDepositPanel'
import XSushiWithdrawlPanel from '../SushiBar/XSushiWithdrawlPanel'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import XSushiSign from '../../assets/images/xsushi-text-sign.png'
import InfoCard from './InfoCard'
import APRCard from './APRCard'
import StakeCard from './StakeCard'
import BalanceCard from './BalanceCard'

const mockData = {
    apr: 21.4,
    numSushi: 0.1,
    xSushiPerSushi: 0.8,
    sushiBalance: 123.4567,
    xSushiBalance: 8309.6,
    weightedApr: 15.34
}

export default function XSushi() {
    const { account } = useActiveWeb3React()
    return (
        <>
            <Helmet>
                <title>xSUSHI | Sushi</title>
            </Helmet>
            <div className="flex flex-col w-full">
                <div className="flex mb-6 justify-center">
                    <InfoCard />
                    <div className="hidden md:flex justify-center align-center w-72 ml-6">
                        <img src={XSushiSign} alt={'xsushi sign'} />
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="flex flex-col-reverse md:flex-col max-w-xl w-full">
                        <div className="mb-0 md:mb-4 mt-6 md:mt-0">
                            <APRCard apr={mockData.apr} numSushi={mockData.numSushi} />
                        </div>
                        <div>
                            <StakeCard
                                xSushiPerSushi={mockData.xSushiPerSushi}
                                sushiBalance={mockData.sushiBalance}
                                xSushiBalance={mockData.xSushiBalance}
                            />
                        </div>
                    </div>
                    <div className="hidden md:block w-72 ml-6">
                        <BalanceCard
                            sushiBalance={mockData.sushiBalance}
                            xSushiBalance={mockData.xSushiBalance}
                            weightedApr={mockData.weightedApr}
                        />
                    </div>
                </div>
                <div className="flex justify-center w-full">
                    <div className="md:hidden flex justify-center w-full max-w-xl h-56 mt-6">
                        <BalanceCard
                            sushiBalance={mockData.sushiBalance}
                            xSushiBalance={mockData.xSushiBalance}
                            weightedApr={mockData.weightedApr}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
