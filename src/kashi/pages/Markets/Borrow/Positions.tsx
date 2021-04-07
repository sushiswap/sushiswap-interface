import React from 'react'
import { Link } from 'react-router-dom'
import getTokenIcon from 'kashi/functions/getTokenIcon'
import { formattedPercent, formattedNum } from 'utils'
import { GradientDot } from '../../../components'

// TODO: Use table component
function Positions({ pairs }: any): JSX.Element | null {
  return (
    <div>
      <div className="grid gap-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-6 pb-4 px-4 text-sm  text-secondary">
        <div className="hover:text-secondary col-span-1 md:col-span-2">Your Positions</div>
        <div className="text-right hover:text-secondary">Borrowing</div>
        <div className="text-right hover:text-secondary">Collateral</div>
        <div className="hidden text-right md:block hover:text-secondary">Limit Used</div>
        <div className="hidden text-right sm:block hover:text-secondary">APR</div>
      </div>
      <div className="flex-col space-y-2">
        {pairs.map((pair: any) => {
          return (
            <div key={pair.address}>
              <Link to={'/bento/kashi/pair/' + pair.address + '/borrow'} className="block text-high-emphesis">
                <div className="grid gap-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-6 py-4 px-4 items-center align-center  text-sm  rounded bg-dark-800 hover:bg-dark-pink">
                  <div className="hidden space-x-2 md:flex">
                    <img
                      src={getTokenIcon(pair.collateral.address)}
                      className="block w-5 h-5 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg"
                      alt=""
                    />
                    <img
                      src={getTokenIcon(pair.asset.address)}
                      className="block w-5 h-5 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg"
                      alt=""
                    />
                  </div>
                  <div className="sm:block">
                    <div>
                      {pair.collateral.symbol} / {pair.asset.symbol}
                    </div>
                    <div>{pair.oracle.name}</div>
                  </div>
                  <div className="text-right">
                    <div>
                      {formattedNum(pair.currentUserBorrowAmount.string, false)} {pair.asset.symbol}
                    </div>
                    <div className="text-secondary text-sm">{formattedNum(pair.currentUserBorrowAmount.usd, true)}</div>
                  </div>
                  <div className="text-right">
                    <div>
                      {formattedNum(pair.userCollateralAmount.string, false)} {pair.collateral.symbol}
                    </div>
                    <div className="text-secondary text-sm">{formattedNum(pair.userCollateralAmount.usd, true)}</div>
                  </div>
                  <div className="hidden md:flex justify-end items-center">
                    {formattedPercent(pair.health.string)}
                    <GradientDot percent={pair.health.string} />
                  </div>
                  <div className="hidden sm:block text-right">
                    {formattedPercent(pair.currentInterestPerYear.string)}
                  </div>
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
