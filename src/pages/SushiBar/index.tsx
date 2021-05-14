import React from 'react'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { Helmet } from 'react-helmet'
import XSushiSign from '../../assets/images/xsushi-text-sign.png'
import InfoCard from './InfoCard'
import APRCard from './APRCard'
import StakeCard from './StakeCard'
import BalanceCard from './BalanceCard'
import { ChainId } from '@sushiswap/sdk'
import { SUSHI, XSUSHI } from '../../constants'
import useTokenBalance from '../../hooks/useTokenBalance'

const mockData = {
    sushiEarnings: 345.27898,
    weightedApr: 15.34
}

export default function XSushi() {
    const { account, chainId } = useActiveWeb3React()

    const sushiBalance = useTokenBalance(SUSHI[ChainId.MAINNET]?.address ?? '')
    const xSushiBalance = useTokenBalance(XSUSHI?.address ?? '')

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
                    <div className="flex flex-col max-w-xl w-full">
                        <div className="mb-4">
                            <APRCard />
                        </div>
                        <div>
                            <StakeCard sushiBalance={sushiBalance} xSushiBalance={xSushiBalance} />
                        </div>
                    </div>
                    <div className="hidden md:block w-72 ml-6">
                        <BalanceCard
                            sushiEarnings={mockData.sushiEarnings}
                            xSushiBalance={xSushiBalance}
                            sushiBalance={sushiBalance}
                            weightedApr={mockData.weightedApr}
                        />
                    </div>
                </div>
                <div className="flex justify-center w-full">
                    <div className="md:hidden flex justify-center w-full max-w-xl mt-6 mb-20">
                        <BalanceCard
                            sushiEarnings={mockData.sushiEarnings}
                            xSushiBalance={xSushiBalance}
                            sushiBalance={sushiBalance}
                            weightedApr={mockData.weightedApr}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
