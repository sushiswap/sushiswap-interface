import React from 'react'
import styled from 'styled-components'
import { transparentize } from 'polished'
import { DarkCard, BaseCard } from 'components/Card'
import { useKashiCounts, useKashiPairs } from 'context/kashi'
import { formattedNum } from 'utils'
import _ from 'lodash'

const StyledBaseCard = styled(BaseCard)`
  border: none
  background: ${({ theme }) => transparentize(0.6, theme.bg1)};
  position: relative;
  overflow: hidden;
`

export default function Header() {
  const counts = useKashiCounts()
  const pairs = useKashiPairs()

  const totalNetWorth = _.sumBy(pairs, function(o) {
    return o.user.pairNetWorth.usdString
  })
  //console.log('totalNetWorth:', totalNetWorth)

  return (
    <div>
      <div className="flex-col space-y-8">
        <div className="w-full md:w-2/3 m-auto">
          <StyledBaseCard>
            <div className="flex flex-col space-y-2 sm:hidden">
              <div className="flex-grow">
                <DarkCard style={{ position: 'relative', overflow: 'hidden' }} borderRadius="12px" padding="1rem">
                  <div className="items-center text-center">
                    <div className="text-2xl font-semibold">≈{formattedNum(totalNetWorth, true)}</div>
                    <div className="text-sm font-semibold" style={{ color: '#bfbfbf' }}>
                      Net Worth
                    </div>
                  </div>
                </DarkCard>
              </div>
              <div className="flex flex-row space-x-2">
                <DarkCard style={{ position: 'relative', overflow: 'hidden' }} borderRadius="12px" padding="1rem">
                  <div className="items-center text-center">
                    <div className="text-2xl font-semibold">{counts.pairsSupplied || 0}</div>
                    <div className="text-sm font-semibold" style={{ color: '#bfbfbf' }}>
                      Pairs Supplied
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-2 flex">
                    <div className="h-2 flex-1" style={{ background: '#6ca8ff' }} />
                  </div>
                </DarkCard>
                <DarkCard style={{ position: 'relative', overflow: 'hidden' }} borderRadius="12px" padding="1rem">
                  <div className="items-center text-center">
                    <div className="text-2xl font-semibold">{counts.pairsBorrowed}</div>
                    <div className="text-sm font-semibold" style={{ color: '#bfbfbf' }}>
                      Pairs Borrowed
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-2 flex">
                    <div className="h-2 flex-1" style={{ background: '#de5597' }} />
                  </div>
                </DarkCard>
              </div>
            </div>
            {/* Desktop Layout Stats */}
            <div className="hidden sm:flex sm:flex-row sm:space-x-4">
              <div className="flex-none">
                <DarkCard style={{ position: 'relative', overflow: 'hidden' }} borderRadius="12px" padding="1rem">
                  <div className="items-center text-center">
                    <div className="text-2xl font-semibold">{counts.pairsSupplied || 0}</div>
                    <div className="text-sm font-semibold" style={{ color: '#bfbfbf' }}>
                      Pairs Supplied
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-2 flex">
                    <div className="h-2 flex-1" style={{ background: '#6ca8ff' }} />
                  </div>
                </DarkCard>
              </div>
              <div className="flex-grow">
                <DarkCard style={{ position: 'relative', overflow: 'hidden' }} borderRadius="12px" padding="1rem">
                  <div className="items-center text-center">
                    <div className="text-2xl font-semibold">≈{formattedNum(totalNetWorth, true)}</div>
                    <div className="text-sm font-semibold" style={{ color: '#bfbfbf' }}>
                      Net Worth
                    </div>
                  </div>
                </DarkCard>
              </div>
              <div className="flex-none">
                <DarkCard style={{ position: 'relative', overflow: 'hidden' }} borderRadius="12px" padding="1rem">
                  <div className="items-center text-center">
                    <div className="text-2xl font-semibold">{counts.pairsBorrowed}</div>
                    <div className="text-sm font-semibold" style={{ color: '#bfbfbf' }}>
                      Pairs Borrowed
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-2 flex">
                    <div className="h-2 flex-1" style={{ background: '#de5597' }} />
                  </div>
                </DarkCard>
              </div>
            </div>
          </StyledBaseCard>
        </div>
        <div className="text-2xl md:text-3xl font-semibold text-center">{counts.markets} Kashi Markets</div>
      </div>
    </div>
  )
}
