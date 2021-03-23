import React, { useMemo } from 'react'
import styled from 'styled-components'
import Card from 'components/Card'
import { useKashiCounts, useKashiPairs } from 'kashi/context'
import { formattedNum } from 'utils'
import sumBy from 'lodash/sumBy'
import millify from 'millify'

export const BaseCard = styled(Card)`
  background-color: ${({ theme }) => theme.baseCard};
`

export default function Header() {
  const counts = useKashiCounts()
  const pairs = useKashiPairs()
  const netWorth = useMemo(() => {
    return millify(sumBy(pairs, pair => pair.user.pairNetWorth.usdString))
  }, [pairs])
  return (
    <div className="flex flex-row space-x-4">
      <div className="flex-grow">
        <BaseCard style={{ position: 'relative', overflow: 'hidden' }} borderRadius="12px" padding="1rem">
          <div className="items-center text-center">
            <div className="text-2xl font-semibold">≈ {formattedNum(netWorth, true)}</div>
            <div className="text-sm font-semibold" style={{ color: '#bfbfbf' }}>
              Net Worth
            </div>
          </div>
        </BaseCard>
      </div>
      <div className="flex-none">
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
      </div>
      <div className="flex-none">
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
      </div>
    </div>
  )
}
