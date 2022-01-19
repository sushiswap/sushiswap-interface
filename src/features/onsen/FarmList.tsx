import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Dots from 'app/components/Dots'
import { HeadlessUiModal } from 'app/components/Modal'
import Typography from 'app/components/Typography'
import FarmListItemDetails from 'app/features/onsen/FarmListItemDetails'
import { OnsenModalView, selectOnsen, setOnsenModalView } from 'app/features/onsen/onsenSlice'
import { TABLE_TR_TH_CLASSNAME, TABLE_WRAPPER_DIV_CLASSNAME } from 'app/features/trident/constants'
import { classNames } from 'app/functions'
import { useInfiniteScroll } from 'app/hooks/useInfiniteScroll'
import useSortableData from 'app/hooks/useSortableData'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import React, { FC, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import FarmListItem from './FarmListItem'

const SortIcon: FC<{ id?: string; direction?: 'ascending' | 'descending'; active: boolean }> = ({
  id,
  active,
  direction,
}) => {
  if (!id || !direction || !active) return <></>
  if (direction === 'ascending') return <ChevronUpIcon width={12} height={12} />
  if (direction === 'descending') return <ChevronDownIcon width={12} height={12} />
  return <></>
}

const FarmList = ({ farms, term }) => {
  const { items, requestSort, sortConfig } = useSortableData(farms, { key: 'tvl', direction: 'descending' })
  const { i18n } = useLingui()
  const [numDisplayed, setNumDisplayed] = useInfiniteScroll(items)
  const [selectedFarm, setSelectedFarm] = useState<any>()
  const { view } = useAppSelector(selectOnsen)
  const dispatch = useAppDispatch()

  return items ? (
    <>
      <div className={classNames(TABLE_WRAPPER_DIV_CLASSNAME)}>
        <div className="grid grid-cols-4">
          <div
            className={classNames('flex gap-1 items-center cursor-pointer', TABLE_TR_TH_CLASSNAME(0, 4))}
            onClick={() => requestSort('symbol')}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`Pool`)}
            </Typography>
            <SortIcon id={sortConfig.key} direction={sortConfig.direction} active={sortConfig.key === 'symbol'} />
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(1, 4))}
            onClick={() => requestSort('tvl')}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`TVL`)}
            </Typography>
            <SortIcon id={sortConfig.key} direction={sortConfig.direction} active={sortConfig.key === 'tvl'} />
          </div>
          <div className={classNames(TABLE_TR_TH_CLASSNAME(2, 4))}>
            <Typography variant="sm" weight={700}>
              {i18n._(t`Rewards`)}
            </Typography>
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(3, 4))}
            onClick={() => requestSort('roiPerYear')}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`APR`)}
            </Typography>
            <SortIcon id={sortConfig.key} direction={sortConfig.direction} active={sortConfig.key === 'roiPerYear'} />
          </div>
        </div>
        <div className="divide-y divide-dark-900">
          <InfiniteScroll
            dataLength={numDisplayed}
            next={() => setNumDisplayed(numDisplayed + 5)}
            hasMore={true}
            loader={null}
          >
            {items.slice(0, numDisplayed).map((farm, index) => (
              <FarmListItem
                key={index}
                farm={farm}
                onClick={() => {
                  setSelectedFarm(farm)
                  dispatch(setOnsenModalView(OnsenModalView.Liquidity))
                }}
              />
            ))}
          </InfiniteScroll>
        </div>
      </div>
      <HeadlessUiModal.Controlled
        isOpen={typeof view !== 'undefined'}
        onDismiss={() => dispatch(setOnsenModalView(undefined))}
        afterLeave={() => setSelectedFarm(undefined)}
      >
        {selectedFarm && (
          <FarmListItemDetails farm={selectedFarm} onDismiss={() => dispatch(setOnsenModalView(undefined))} />
        )}
      </HeadlessUiModal.Controlled>
    </>
  ) : (
    <div className="w-full py-6 text-center">{term ? <span>No Results.</span> : <Dots>Loading</Dots>}</div>
  )
}

export default FarmList
