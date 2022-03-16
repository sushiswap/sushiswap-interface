import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Loader from 'app/components/Loader'
import Search from 'app/components/Search'
import SortIcon from 'app/components/SortIcon'
import Typography from 'app/components/Typography'
import KashiMarketListItem from 'app/features/kashi/KashiMarketListItem'
import { TABLE_TR_TH_CLASSNAME, TABLE_WRAPPER_DIV_CLASSNAME } from 'app/features/trident/constants'
import { classNames } from 'app/functions'
import { useFuse, useSortableData } from 'app/hooks'
import { useInfiniteScroll } from 'app/hooks/useInfiniteScroll'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC, memo, ReactNode } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import { KashiMediumRiskLendingPair } from './KashiMediumRiskLendingPair'

interface KashiMarketList {
  markets: KashiMediumRiskLendingPair[]
}

const KashiMarketList: FC<KashiMarketList> = ({ markets }) => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const {
    result: pairs,
    term,
    search,
  } = useFuse<KashiMediumRiskLendingPair>({
    data: markets,
    options: {
      keys: ['asset.token.symbol', 'collateral.token.symbol'],
      threshold: 0.2,
      shouldSort: false,
      useExtendedSearch: false,
    },
  })
  const { items, requestSort, sortConfig } = useSortableData(pairs, {
    key: 'currentAllAssets',
    direction: 'descending',
  })

  const [numDisplayed, setNumDisplayed] = useInfiniteScroll(items)

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
            onClick={() => requestSort('currentAllAssets')}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`Market Size`)}
            </Typography>
            <SortIcon
              id={sortConfig.key}
              direction={sortConfig.direction}
              active={sortConfig.key === 'currentAllAssets'}
            />
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(2, 6))}
            onClick={() => requestSort('currentBorrowAmount')}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`Total Borrowed`)}
            </Typography>
            <SortIcon
              id={sortConfig.key}
              direction={sortConfig.direction}
              active={sortConfig.key === 'currentBorrowAmount'}
            />
          </div>
          {/*<div className={classNames(TABLE_TR_TH_CLASSNAME(3, 6))}>*/}
          {/*  <Typography variant="sm" weight={700}>*/}
          {/*    {i18n._(t`Available`)}*/}
          {/*  </Typography>*/}
          {/*</div>*/}
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(3, 6))}
            onClick={() => requestSort('currentSupplyAPR')}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`Deposit APR`)}
            </Typography>
            <SortIcon
              id={sortConfig.key}
              direction={sortConfig.direction}
              active={sortConfig.key === 'currentSupplyAPR'}
            />
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(4, 6))}
            onClick={() => requestSort('currentInterestPerYear')}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`Borrow APR`)}
            </Typography>
            <SortIcon
              id={sortConfig.key}
              direction={sortConfig.direction}
              active={sortConfig.key === 'currentInterestPerYear'}
            />
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(5, 6))}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`Actions`)}
            </Typography>
          </div>
        </div>
        <InfiniteScroll
          dataLength={numDisplayed}
          next={() => setNumDisplayed(numDisplayed + 5)}
          hasMore={numDisplayed <= items.length}
          loader={<Loader />}
        >
          {items.slice(0, numDisplayed).reduce<ReactNode[]>((acc, market, index) => {
            if (market) acc.push(<KashiMarketListItem market={market} chainId={chainId || 1} key={index} i18n={i18n} />)
            return acc
          }, [])}
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default memo(KashiMarketList)
