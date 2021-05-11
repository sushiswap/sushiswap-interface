import React from 'react'
import { Link } from 'react-router-dom'
import SushiImage from '../../assets/images/sushi.png'
import XSushiImage from '../../assets/images/xsushi.png'
import MoreInfoSymbol from '../../assets/images/more-info.svg'
import { BalanceProps } from '../../hooks/useTokenBalance'
import { formatFromBalance } from '../../utils'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'

interface BalanceCardProps {
    sushiEarnings: number
    xSushiBalance: BalanceProps
    sushiBalance: BalanceProps
    weightedApr: number
}

export default function BalanceCard({ sushiEarnings, xSushiBalance, sushiBalance, weightedApr }: BalanceCardProps) {
    const { account } = useActiveWeb3React()
    return (
        <div className="flex flex-col w-full h-full bg-dark-900 rounded px-4 md:px-8 pt-6 pb-5 md:pt-7 md:pb-9">
            <div className="flex flex-wrap">
                <div className="flex flex-col flex-grow md:mb-14">
                    <p className="mb-3 text-lg font-bold md:text-h5 md:font-medium text-high-emphesis">Balance</p>
                    <div className="flex items-center">
                        <img className="w-10 md:w-16 -ml-1 mr-1 md:mr-2 -mb-1.5" src={XSushiImage} alt="sushi" />
                        <div className="flex flex-col justify-center">
                            <p className="text-caption2 md:text-lg font-bold text-high-emphesis">
                                {formatFromBalance(xSushiBalance.value)}
                            </p>
                            <p className="text-caption2 md:text-caption text-primary">xSUSHI</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col flex-grow">
                    <div className="flex flex-nowrap mb-3 ml-8 md:ml-0">
                        <p className="text-lg font-bold md:text-h5 md:font-medium text-high-emphesis">Unstaked</p>
                        {/* <img className="cursor-pointer ml-2 w-4" src={MoreInfoSymbol} alt={'more info'} /> */}
                    </div>
                    <div className="flex items-center ml-8 md:ml-0">
                        <img className="w-10 md:w-16 -ml-1 mr-1 md:mr-2 -mb-1.5" src={SushiImage} alt="sushi" />
                        <div className="flex flex-col justify-center">
                            <p className="text-caption2 md:text-lg font-bold text-high-emphesis">
                                {formatFromBalance(sushiBalance.value)}
                                {/* {sushiEarnings.toPrecision(7)} */}
                            </p>
                            <p className="text-caption2 md:text-caption text-primary">SUSHI</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-full mt-7 mb-24 md:mb-0">
                    {/* <div className="flex justify-between items-center">
                        <div className="flex flex-nowrap items-center flex-1">
                            <p className="text-caption md:text-lg font-bold text-high-emphesis">Weighted APR</p>
                            <img className="cursor-pointer ml-2 w-4" src={MoreInfoSymbol} alt={'more info'} />
                        </div>
                        <div className="flex flex-1 md:flex-initial">
                            <p className="text-caption text-primary ml-5 md:ml-0">{`${weightedApr}%`}</p>
                        </div>
                    </div> */}
                    {account && (
                        <a
                            href={`https://analytics.sushi.com/users/${account}`}
                            target="_blank"
                            rel="noreferrer noopener"
                            className={`
                            flex flex-grow justify-center items-center
                            h-14 mt-6 rounded
                            bg-dark-700 text-high-emphesis
                            focus:outline-none focus:ring hover:bg-opacity-80
                            text-caption2 font-bold cursor-pointer
                        `}
                        >
                            Your SushiBar Stats
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}
