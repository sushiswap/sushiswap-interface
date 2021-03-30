import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Card from 'components/Card'
import { useKashiCounts, useKashiPairs } from 'kashi/context'
//import { formattedNum } from 'utils'
import sumBy from 'lodash/sumBy'
import millify from 'millify'

export const BaseCard = styled(Card)`
  background-color: ${({ theme }) => theme.baseCard};
`

export default function Header() {
  const counts = useKashiCounts()
  const pairs = useKashiPairs()
  const netWorth = useMemo(() => {
    return '0.00'
    // return millify(sumBy(pairs, pair => pair.user.pairNetWorth.usdString))
  }, [pairs])
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
      <div className="flex-grow">
        <BaseCard style={{ position: 'relative', overflow: 'hidden' }} borderRadius="12px" padding="1rem">
          <div className="items-center text-center">
            <div className="text-2xl font-semibold">≈${netWorth}</div>
            <div className="text-sm font-semibold" style={{ color: '#bfbfbf' }}>
              Net Worth
            </div>
          </div>
        </BaseCard>
      </div>
      <Link className="hidden md:block flex-none text-white" to="/bento/kashi/positions/supply">
        <BaseCard style={{ position: 'relative', overflow: 'hidden' }} borderRadius="12px" padding="1rem">
          <div className="items-center text-center">
            <div className="text-2xl font-semibold">{counts.pairsSupplied || 0}</div>
            <div className="text-sm font-semibold" style={{ color: '#bfbfbf' }}>
              Pairs Supplied
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-2 flex">
            <div className="h-2 flex-1" style={{ background: '#6ca8ff' }} />
          </div>
        </BaseCard>
      </Link>
      <Link className="hidden md:block flex-none text-white" to="/bento/kashi/positions/borrow">
        <BaseCard style={{ position: 'relative', overflow: 'hidden' }} borderRadius="12px" padding="1rem">
          <div className="items-center text-center">
            <div className="text-2xl font-semibold">{counts.pairsBorrowed}</div>
            <div className="text-sm font-semibold" style={{ color: '#bfbfbf' }}>
              Pairs Borrowed
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-2 flex">
            <div className="h-2 flex-1" style={{ background: '#de5597' }} />
          </div>
        </BaseCard>
      </Link>
    </div>
  )
}
