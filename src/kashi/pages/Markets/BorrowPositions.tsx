import React from 'react'
import { Link } from 'react-router-dom'
import getTokenIcon from 'kashi/functions/getTokenIcon'
import { formattedPercent, formattedNum } from 'utils'
import { GradientDot } from '../../components'

// TODO: Use table component
const BorrowPositions = (pairs: any) => {
  return (
    <>
      {pairs && pairs.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 pb-4 px-4 text-sm font-semibold text-gray-500">
          <div className="hover:text-gray-400 col-span-1 md:col-span-2">Your Positions</div>
          <div className="text-right hover:text-gray-400">Borrowing</div>
          <div className="text-right hover:text-gray-400">Collateral</div>
          <div className="hidden text-right md:block hover:text-gray-400">Limit Used</div>
          <div className="hidden text-right sm:block hover:text-gray-400">APR</div>
        </div>
      ) : null}
      {pairs &&
        pairs.length > 0 &&
        pairs.map((pair: any) => {
          return (
            <>
              <Link
                to={'/bento/kashi/pair/' + pair.address + '/borrow'}
                className="block text-high-emphesis"
                key={pair.address}
              >
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 mb-2 py-4 px-4 items-center align-center  text-sm font-semibold rounded bg-dark-800">
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
                    <div className="text-gray-500 text-sm">{formattedNum(pair.currentUserBorrowAmount.usd, true)}</div>
                  </div>
                  <div className="text-right">
                    <div>
                      {formattedNum(pair.userCollateralAmount.string, false)} {pair.collateral.symbol}
                    </div>
                    <div className="text-gray-500 text-sm">{formattedNum(pair.userCollateralAmount.usd, true)}</div>
                  </div>
                  <div className="hidden md:flex justify-end items-center">
                    {formattedPercent(pair.health.string)}
                    <GradientDot percent={pair.health.string} />
                  </div>
                  <div className="hidden sm:block text-right">
                    {formattedPercent(pair.currentInterestPerYear.string)}
                  </div>
                  {/* <div className="sm:hidden text-right col-span-3">
                    <div className="flex justify-between px-2 py-2 mt-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center">
                        <div className="text-gray-500 mr-2">Limit Used: </div>
                        <div>{formattedPercent(pair.health.string)}</div>
                        <GradientDot percent={pair.health.string} />
                      </div>
                      <div className="flex">
                        <div className="text-gray-500 mr-2">Borrow APY: </div>
                        <div>{formattedPercent(pair.currentInterestPerYear.string)}</div>
                      </div>
                    </div>
                  </div> */}
                </div>
              </Link>
            </>
          )
        })}
    </>
  )
}

export default BorrowPositions
