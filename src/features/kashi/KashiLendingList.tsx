import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { TABLE_TR_TH_CLASSNAME, TABLE_WRAPPER_DIV_CLASSNAME } from 'app/features/trident/constants'
import { classNames } from 'app/functions/styling'
import { useInfiniteScroll } from 'app/hooks/useInfiniteScroll'
import { useRouter } from 'next/router'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import { useKashiMediumRiskLendingPositions } from './hooks'
import KashiLendingListItem from './KashiLendingListItem'

export const KashiLendingList = () => {
  const { i18n } = useLingui()
  const router = useRouter()
  const account = router.query.address as string
  const positions = useKashiMediumRiskLendingPositions(account)
  const [numDisplayed, setNumDisplayed] = useInfiniteScroll(positions)
  return (
    <div className="flex flex-col w-full gap-3">
      <div className={classNames(TABLE_WRAPPER_DIV_CLASSNAME)}>
        <div className="grid grid-cols-7 min-w-[768px]">
          <div className={classNames('flex gap-1 items-center cursor-pointer', TABLE_TR_TH_CLASSNAME(0, 7))}>
            <Typography variant="sm" weight={700}>
              {i18n._(t`Asset / Collateral`)}
            </Typography>
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(1, 7))}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`Supplied`)}
            </Typography>
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(2, 7))}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`Market Size`)}
            </Typography>
          </div>
          <div className={classNames(TABLE_TR_TH_CLASSNAME(3, 7))}>
            <Typography variant="sm" weight={700}>
              {i18n._(t`Total Borrowed`)}
            </Typography>
          </div>
          <div className={classNames(TABLE_TR_TH_CLASSNAME(4, 7))}>
            <Typography variant="sm" weight={700}>
              {i18n._(t`Available`)}
            </Typography>
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(5, 7))}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`Utilization`)}
            </Typography>
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(6, 7))}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`Supply APR`)}
            </Typography>
          </div>
        </div>
        <InfiniteScroll
          dataLength={numDisplayed}
          next={() => setNumDisplayed(numDisplayed + 5)}
          hasMore={true}
          loader={null}
        >
          {positions.slice(0, numDisplayed).map((market, index) => (
            <KashiLendingListItem market={market} key={index} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  )
}
