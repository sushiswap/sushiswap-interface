import { useActiveWeb3React } from 'hooks'
import getTokenIcon from 'kashi/functions/getTokenIcon'
import React from 'react'
import { Link } from 'react-router-dom'
import { formattedNum, formattedPercent } from 'utils'

function Positions({ pairs }: any): JSX.Element | null {
    const { chainId } = useActiveWeb3React()
    return (
        <div>
            <div className="grid gap-4 grid-flow-col grid-cols-4 md:grid-cols-6 lg:grid-cols-7 pb-4 px-4 text-sm text-secondary">
                <div className="">
                    <span className="hidden md:inline-block">Your</span> Positions
                </div>
                <div className="hidden md:block hover:text-secondary cursor-pointer">
                    <div className="flex items-center">
                        <div>Lending</div>
                    </div>
                </div>
                <div className="hidden md:block hover:text-secondary cursor-pointer">
                    <div className="flex items-center">
                        <div>Collateral</div>
                    </div>
                </div>
                <div className="hidden lg:block hover:text-secondary cursor-pointer">
                    <div className="flex items-center">
                        <div className="flex">Oracle</div>
                    </div>
                </div>
                <div className="text-right hover:text-secondary">Lent</div>
                <div className="text-right hover:text-secondary">Borrowed</div>
                <div className="text-right hover:text-secondary">APR</div>
            </div>
            <div className="flex-col space-y-2">
                {pairs.map((pair: any) => {
                    return (
                        <div key={pair.address}>
                            <Link to={'/bento/kashi/lend/' + pair.address} className="block text-high-emphesis">
                                <div className="grid gap-4 grid-flow-col grid-cols-4 md:grid-cols-6 lg:grid-cols-7 py-4 px-4 items-center align-center text-sm  rounded bg-dark-800 hover:bg-dark-blue">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center">
                                        <div className="hidden space-x-2 md:flex">
                                            <img
                                                src={getTokenIcon(pair.asset.address, chainId)}
                                                className="block w-5 h-5 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg"
                                                alt=""
                                            />
                                            <img
                                                src={getTokenIcon(pair.collateral.address, chainId)}
                                                className="block w-5 h-5 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg"
                                                alt=""
                                            />
                                        </div>
                                        <div className="sm:items-end md:hidden">
                                            <div>
                                                <strong>{pair.asset.symbol}</strong> / {pair.collateral.symbol}
                                            </div>
                                            <div className="mt-0 text-left text-white-500 text-xs block lg:hidden">
                                                {pair.oracle.name}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-white hidden md:block">
                                        <strong>{pair.asset.symbol}</strong>
                                    </div>
                                    <div className="hidden md:block">{pair.collateral.symbol}</div>
                                    <div className="hidden lg:block">{pair.oracle.name}</div>
                                    <div className="text-right">
                                        <div>
                                            {formattedNum(pair.currentUserAssetAmount.string, false)}{' '}
                                            {pair.asset.symbol}
                                        </div>
                                        <div className="text-secondary text-sm">
                                            {formattedNum(pair.currentUserAssetAmount.usd, true)}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div>{formattedPercent(pair.utilization.string)}</div>
                                        <div className="text-secondary">
                                            {formattedNum(pair.currentUserLentAmount.usd, true)}
                                        </div>
                                    </div>
                                    <div className="text-right">{formattedPercent(pair.supplyAPR.string)}</div>
                                </div>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Positions
