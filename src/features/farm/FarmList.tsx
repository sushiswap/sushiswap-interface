import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'

import Dots from '../../components/Dots'
import FarmListItem from './FarmListItem'
import InfiniteScroll from 'react-infinite-scroll-component'
import React from 'react'
import { t } from '@lingui/macro'
import { useInfiniteScroll } from './hooks'
import { useLingui } from '@lingui/react'
import useSortableData from '../../hooks/useSortableData'

const FarmList = ({ farms, term }) => {
  const { items, requestSort, sortConfig } = useSortableData(farms, { key: 'roiPerYear' })
  const [numDisplayed, setNumDisplayed] = useInfiniteScroll(items)
  const { i18n } = useLingui()
  return items ? (
    <>
      <div className="grid grid-cols-4 text-base font-bold text-primary">
        <div
          className="flex items-center col-span-2 px-4 cursor-pointer md:col-span-1"
          onClick={() => requestSort('symbol')}
        >
          <div className="hover:text-high-emphesis">{i18n._(t`Pool`)}</div>
          {sortConfig &&
            sortConfig.key === 'symbol' &&
            ((sortConfig.direction === 'ascending' && <ChevronUpIcon width={12} height={12} />) ||
              (sortConfig.direction === 'descending' && <ChevronDownIcon width={12} height={12} />))}
        </div>
        <div
          className="flex items-center px-4 cursor-pointer hover:text-high-emphesis"
          onClick={() => requestSort('tvl')}
        >
          {i18n._(t`TVL`)}
          {sortConfig &&
            sortConfig.key === 'tvl' &&
            ((sortConfig.direction === 'ascending' && <ChevronUpIcon width={12} height={12} />) ||
              (sortConfig.direction === 'descending' && <ChevronDownIcon width={12} height={12} />))}
        </div>
        <div className="items-center justify-start hidden px-4 md:flex hover:text-high-emphesis">
          {i18n._(t`Rewards`)}
        </div>
        <div
          className="flex items-center justify-end px-4 cursor-pointer hover:text-high-emphesis"
          onClick={() => requestSort('roiPerYear')}
        >
          {i18n._(t`APR`)}
          {sortConfig &&
            sortConfig.key === 'roiPerYear' &&
            ((sortConfig.direction === 'ascending' && <ChevronUpIcon width={12} height={12} />) ||
              (sortConfig.direction === 'descending' && <ChevronDownIcon width={12} height={12} />))}
        </div>
      </div>
      <InfiniteScroll
        dataLength={numDisplayed}
        next={() => setNumDisplayed(numDisplayed + 5)}
        hasMore={true}
        loader={null}
      >
        <div className="space-y-4">
          {items.slice(0, numDisplayed).map((farm, index) => (
            <FarmListItem key={index} farm={farm} />
          ))}
        </div>
      </InfiniteScroll>
    </>
  ) : (
    <div className="w-full py-6 text-center">{term ? <span>No Results.</span> : <Dots>Loading</Dots>}</div>
  )
}

export default FarmList
