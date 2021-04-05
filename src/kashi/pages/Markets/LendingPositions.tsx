import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import { BaseCard } from 'components/Card'
import getTokenIcon from 'kashi/functions/getTokenIcon'
import { formattedPercent, formattedNum } from 'utils'

import { useKashiPairs } from '../../context'

const LendingPositions = () => {
  const theme = useContext(ThemeContext)

  const pairs = useKashiPairs()

  const lendingPositions = pairs.filter(function(pair: any) {
    return pair.userAssetFraction.gt(0)
  })

  return (
    <>
      {lendingPositions && lendingPositions.length > 0 ? (
        <div className="pb-4 px-4 grid grid-cols-4 sm:grid-cols-4 text-sm font-semibold text-gray-500">
          <div className="hover:text-gray-400 col-span-2 sm:col-span-2">Your Positions</div>
          <div className="text-right pl-4 hover:text-gray-400">Lent</div>
          <div className="text-right hover:text-gray-400">APR</div>
        </div>
      ) : null}
      {lendingPositions &&
        lendingPositions.length > 0 &&
        lendingPositions.map((pair: any) => {
          return (
            <>
              <Link
                to={'/bento/kashi/pair/' + pair.address + '/lend'}
                className="block text-high-emphesis"
                key={pair.address}
              >
                <div className="mb-2 py-4 px-4 items-center align-center grid grid-cols-4 text-sm font-semibold rounded bg-dark-800">
                  <div className="hidden space-x-2 md:flex">
                    <img
                      src={getTokenIcon(pair.collateral.address)}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
                      alt=""
                    />
                    <img
                      src={getTokenIcon(pair.asset.address)}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
                      alt=""
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1 sm:block">
                    <div>
                      {pair.collateral.symbol} / {pair.asset.symbol}
                    </div>
                    <div>{pair.oracle.name}</div>
                  </div>
                  <div className="text-right">
                    <div>
                      {formattedNum(pair.currentUserAssetAmount.string, false)} {pair.asset.symbol}
                    </div>
                    <div className="text-gray-500 text-sm">{formattedNum(pair.currentUserAssetAmount.usd, true)}</div>
                  </div>
                  <div className="text-right">{formattedPercent(pair.currentSupplyAPR.string)}</div>
                </div>
              </Link>
            </>
          )
        })}
    </>
  )
}

export default LendingPositions
