import Typography from 'app/components/Typography'
import Image from 'next/image'
import React, { FC } from 'react'
import { useRecoilValue } from 'recoil'

import rssSVG from '../../../../public/images/rss.svg'
import { searchQueryAtom } from './context/atoms'

export const SearchCategoryLabel: FC = () => {
  const searchQuery = useRecoilValue(searchQueryAtom)

  return (
    <div className="py-2 flex flex-row justify-between items-center">
      <Typography variant="base" className="text-high-emphesis" weight={700}>
        {searchQuery ? `Search results for '${searchQuery}'` : 'Top Liquidity Pools'}
      </Typography>
      <div className="flex gap-1">
        <Image layout="fixed" src={rssSVG} alt="rss icon" />
        <div className="text-xs text-secondary">*Pairs with this symbol have a TWAP oracle.</div>
      </div>
    </div>
  )
}
