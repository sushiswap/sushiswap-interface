import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import { transparentize } from 'polished'
import { BaseCard } from '../../../components/Card'
import { FixedScrollable } from '../../components'
import getTokenIcon from '../../../sushi-hooks/queries/getTokenIcons'
import { formattedPercent, formattedNum } from '../../../utils'

const StyledBaseCard = styled(BaseCard)`
  border: none;
  background: ${({ theme }) => theme.baseCard};
  position: relative;
  overflow: hidden;
  border-radius: 0 0 15px 15px;
`
// TODO: Use table component
const BorrowPositions = ({ borrowPositions }: any) => {
  const theme = useContext(ThemeContext)
  return (
    <>
      <StyledBaseCard>
        {borrowPositions && borrowPositions.length > 0 ? (
          <div className="pb-4 px-4 grid grid-cols-3 sm:grid-cols-6 text-sm font-semibold text-gray-500">
            <div className="hover:text-gray-400 col-span-1 md:col-span-1">Market</div>
            <div className="hidden sm:block"></div>
            <div className="text-right pl-4 hover:text-gray-400">Borrowing</div>
            <div className="text-right hover:text-gray-400">Collateral</div>
            <div className="hidden sm:block text-right hover:text-gray-400">Limit Used</div>
            <div className="hidden sm:block text-right hover:text-gray-400">Borrow APR</div>
          </div>
        ) : (
          <div className="items-center text-center p-6 w-full">
            <div className="text-2xl font-semibold text-gray-400 pb-2">You have no open borrow positions.</div>
            <div className="text-base font-base text-gray-400">
              Swing by once you have borrowed assets from various markets
            </div>
            <div className="flex mx-auto justify-center">
              <Link
                to={'/bento/kashi'}
                className="my-8 px-3 py-2 text-base font-medium rounded-md shadow-sm text-white"
                style={{ background: `${theme.primaryPink}` }}
              >
                View Markets
              </Link>
            </div>
          </div>
        )}

        <FixedScrollable height="22rem">
          {borrowPositions &&
            borrowPositions.length > 0 &&
            borrowPositions.map((pair: any) => {
              return (
                <>
                  <Link to={'/bento/kashi/pair/' + pair.address + '?tab=borrow'} className="block" key={pair.address}>
                    <div
                      className="mb-2 py-4 px-4 items-center align-center grid grid-cols-3 sm:grid-cols-6 text-sm font-semibold"
                      style={{ background: theme.mediumDarkPurple, borderRadius: '15px' }}
                    >
                      <div className="flex space-x-2 col-span-1">
                        <img
                          src={getTokenIcon(pair.collateral.address)}
                          className="w-10 y-10 sm:w-12 sm:y-12 rounded-lg"
                        />
                        <img src={getTokenIcon(pair.asset.address)} className="w-10 y-10 sm:w-12 sm:y-12 rounded-lg" />
                      </div>
                      <div className="text-left hidden sm:block pl-4">
                        <div>
                          {pair.collateral.symbol} / {pair.asset.symbol}
                        </div>
                        <div>{pair.oracle.name}</div>
                      </div>
                      <div className="text-right">
                        <div>
                          {formattedNum(pair.user.borrow.string, false)} {pair.asset.symbol}
                        </div>
                        <div className="text-gray-500 text-sm">≈ {formattedNum(pair.user.borrow.usdString, true)}</div>
                      </div>
                      <div className="text-right">
                        <div>
                          {formattedNum(pair.user.collateral.string, false)} {pair.collateral.symbol}
                        </div>
                        <div className="text-gray-500 text-sm">
                          ≈ {formattedNum(pair.user.collateral.usdString, true)}
                        </div>
                      </div>
                      <div className="hidden sm:block text-right">{formattedPercent(pair.user.health.percentage)}</div>
                      <div className="hidden sm:block text-right">
                        {formattedPercent(pair.details.apr.currentInterestPerYear)}
                      </div>
                      <div className="sm:hidden text-right col-span-3">
                        <div className="flex justify-between px-2 py-2 mt-4 bg-gray-800 rounded-lg">
                          <div className="flex">
                            <div className="text-gray-500 mr-2">Limit Used: </div>
                            <div>{formattedPercent(pair.user.health.percentage)}</div>
                          </div>
                          <div className="flex">
                            <div className="text-gray-500 mr-2">Borrow APY: </div>
                            <div>{formattedPercent(pair.details.apr.currentInterestPerYear)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </>
              )
            })}
        </FixedScrollable>
      </StyledBaseCard>
    </>
  )
}

export default BorrowPositions
