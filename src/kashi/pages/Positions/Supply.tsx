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
const SupplyPositions = ({ supplyPositions }: any) => {
  const theme = useContext(ThemeContext)
  return (
    <>
      <StyledBaseCard>
        {supplyPositions && supplyPositions.length > 0 ? (
          <div className="pb-4 px-4 grid grid-cols-4 sm:grid-cols-4 text-sm font-semibold text-gray-500">
            <div className="hover:text-gray-400 col-span-2 sm:col-span-1">Market</div>
            <div className="hidden sm:block"></div>
            <div className="text-right pl-4 hover:text-gray-400">Supplying</div>
            <div className="text-right hover:text-gray-400">APR</div>
          </div>
        ) : (
          <div className="items-center text-center p-6 w-full">
            <div className="text-2xl font-semibold text-gray-400 pb-2">You have no open lending positions.</div>
            <div className="text-base font-base text-gray-400">
              Swing by once you have lent assets to various markets
            </div>
            <div className="flex mx-auto justify-center">
              <Link
                to={'/bento/kashi'}
                className="my-8 px-3 py-2 text-base font-medium rounded-md shadow-sm text-white"
                style={{ background: `${theme.primaryBlue}` }}
              >
                View Markets
              </Link>
            </div>
          </div>
        )}
        <FixedScrollable height="22rem">
          <>
            {supplyPositions &&
              supplyPositions.length > 0 &&
              supplyPositions.map((pair: any) => {
                return (
                  <>
                    <Link to={'/bento/kashi/pair/' + pair.address} className="block" key={pair.address}>
                      <div
                        className="mb-2 py-4 px-4 items-center align-center grid grid-cols-4 sm:grid-cols-4 text-sm font-semibold"
                        style={{ background: theme.mediumDarkPurple, borderRadius: '15px' }}
                      >
                        <div className="flex space-x-2 col-span-2 sm:col-span-1">
                          <img
                            src={getTokenIcon(pair.collateral.address)}
                            className="w-10 y-10 sm:w-12 sm:y-12 rounded-lg"
                          />
                          <img
                            src={getTokenIcon(pair.asset.address)}
                            className="w-10 y-10 sm:w-12 sm:y-12 rounded-lg"
                          />
                        </div>
                        <div className="text-left hidden sm:block pl-4">
                          <div>
                            {pair.collateral.symbol} / {pair.asset.symbol}
                          </div>
                          <div>{pair.oracle.name}</div>
                        </div>
                        <div className="text-right">
                          <div>
                            {formattedNum(pair.user.asset.string, false)} {pair.asset.symbol}
                          </div>
                          <div className="text-gray-500 text-sm">≈ {formattedNum(pair.user.asset.usdString, true)}</div>
                        </div>
                        <div className="text-right">{formattedPercent(pair.details.apr.currentSupplyAPR)}</div>
                      </div>
                    </Link>
                  </>
                )
              })}
          </>
        </FixedScrollable>
      </StyledBaseCard>
    </>
  )
}

export default SupplyPositions
