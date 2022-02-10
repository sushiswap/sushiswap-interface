import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Search from 'app/components/Search'
import Typography from 'app/components/Typography'
import KashiMarketListItem from 'app/features/kashi/KashiMarketListItem'
import { TABLE_TR_TH_CLASSNAME, TABLE_WRAPPER_DIV_CLASSNAME } from 'app/features/trident/constants'
import { classNames } from 'app/functions'
import { useFuse } from 'app/hooks'
import { useInfiniteScroll } from 'app/hooks/useInfiniteScroll'
import React, { FC, memo } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import KashiMediumRiskLendingPair from './KashiMediumRiskLendingPair'

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

interface KashiMarketList {
  markets: KashiMediumRiskLendingPair[]
}

const KashiMarketList: FC<KashiMarketList> = ({ markets }) => {
  const { i18n } = useLingui()
  const { result, term, search } = useFuse<KashiMediumRiskLendingPair>({
    data: markets,
    options: {
      keys: ['asset.token.symbol', 'collateral.token.symbol'],
      threshold: 0,
      shouldSort: false,
      useExtendedSearch: false,
    },
  })

  const [numDisplayed, setNumDisplayed] = useInfiniteScroll(result)

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Search search={(val) => search(val.toUpperCase())} term={term} />
      </div>
      <div className={classNames(TABLE_WRAPPER_DIV_CLASSNAME)}>
        <div className="grid grid-cols-6 min-w-[768px]">
          <div
            className={classNames('flex gap-1 items-center cursor-pointer', TABLE_TR_TH_CLASSNAME(0, 6))}
            // onClick={() => requestSort('pair.token0.symbol')}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`Asset / Collateral`)}
            </Typography>
            {/*<SortIcon id={sortConfig.key} direction={sortConfig.direction} active={sortConfig.key === 'symbol'} />*/}
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(1, 6))}
            // onClick={() => requestSort('tvl')}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`Market Size`)}
            </Typography>
            {/*<SortIcon id={sortConfig.key} direction={sortConfig.direction} active={sortConfig.key === 'tvl'} />*/}
          </div>
          <div className={classNames(TABLE_TR_TH_CLASSNAME(2, 6))}>
            <Typography variant="sm" weight={700}>
              {i18n._(t`Total Borrowed`)}
            </Typography>
          </div>
          <div className={classNames(TABLE_TR_TH_CLASSNAME(3, 6))}>
            <Typography variant="sm" weight={700}>
              {i18n._(t`Available`)}
            </Typography>
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(4, 6))}
            // onClick={() => requestSort('roiPerYear')}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`Deposit APR`)}
            </Typography>
            {/*<SortIcon id={sortConfig.key} direction={sortConfig.direction} active={sortConfig.key === 'roiPerYear'} />*/}
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(5, 6))}
            // onClick={() => requestSort('roiPerYear')}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`Borrow APR`)}
            </Typography>
            {/*<SortIcon id={sortConfig.key} direction={sortConfig.direction} active={sortConfig.key === 'roiPerYear'} />*/}
          </div>
        </div>
        <InfiniteScroll
          dataLength={numDisplayed}
          next={() => setNumDisplayed(numDisplayed + 5)}
          hasMore={true}
          loader={null}
        >
          {result.slice(0, numDisplayed).map((market, index) => (
            <KashiMarketListItem market={market} key={index} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default memo(KashiMarketList)
