import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { selectTridentPools } from 'app/features/trident/pools/poolsSlice'
import { useAppSelector } from 'app/state/hooks'
import Image from 'next/image'
import React, { FC } from 'react'

import rssSVG from '../../../../public/images/rss.svg'

export const SearchCategoryLabel: FC = () => {
  const { i18n } = useLingui()
  const { searchQuery } = useAppSelector(selectTridentPools)

  return (
    <div className="py-2 flex flex-row justify-between items-center px-2">
      <Typography variant="base" className="text-high-emphesis" weight={700}>
        {searchQuery ? i18n._(t`Search results for '${searchQuery}'`) : i18n._(t`Top Liquidity Pools`)}
      </Typography>
      <div className="flex gap-1">
        <Image layout="fixed" src={rssSVG} alt="rss icon" />
        <div className="text-xs text-secondary">{i18n._(t`*Pairs with this symbol have a TWAP oracle.`)}</div>
      </div>
    </div>
  )
}
