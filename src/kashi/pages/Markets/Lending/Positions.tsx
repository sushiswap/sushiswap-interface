import React from 'react'
import { Link } from 'react-router-dom'
import getTokenIcon from 'kashi/functions/getTokenIcon'
import { formattedPercent, formattedNum } from 'utils'
import { useActiveWeb3React } from 'hooks'

function Positions({ pairs }: any): JSX.Element | null {
    const { chainId } = useActiveWeb3React()
    return (
        <div>
            <div className="grid gap-4 grid-cols-4 md:grid-cols-5 pb-4 px-4 text-sm  text-secondary">
                <div className="hover:text-secondary col-span-1 md:col-span-2">Your Positions</div>
                <div className="text-right hover:text-secondary">Lent</div>
                <div className="text-right hover:text-secondary">Borrowed</div>
                <div className="text-right hover:text-secondary">APR</div>
            </div>
            <div className="flex-col space-y-2">
                {pairs.map((pair: any) => {
                    return (
                        <div key={pair.address}>
                            <Link to={'/bento/kashi/lend/' + pair.address} className="block text-high-emphesis">
                                <div className="grid gap-4 grid-cols-4 md:grid-cols-5 py-4 px-4 items-center align-center text-sm  rounded bg-dark-800 hover:bg-dark-blue">
                                    <div className="hidden space-x-2 md:flex">
                                        <img
                                            src={getTokenIcon(pair.asset.address, chainId)}
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
                                            alt=""
                                        />
                                        <img
                                            src={getTokenIcon(pair.collateral.address, chainId)}
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
                                            alt=""
                                        />
                                    </div>
                                    <div className="col-span-1 sm:block md:col-span-1">
                                        <div>
                                        <strong>{pair.asset.symbol}</strong> / {pair.collateral.symbol}
                                        </div>
                                        <div>{pair.oracle.name}</div>
                                    </div>
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
