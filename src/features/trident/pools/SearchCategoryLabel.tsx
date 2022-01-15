import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import Image from 'next/image'
import React, { FC } from 'react'
import { useRecoilValue } from 'recoil'

import rssSVG from '../../../../public/images/rss.svg'
import { searchQueryAtom } from './context/atoms'

export const SearchCategoryLabel: FC = () => {
  const { i18n } = useLingui()
  const searchQuery = useRecoilValue(searchQueryAtom)

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
