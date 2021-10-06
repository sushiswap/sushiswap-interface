import React from 'react'
import TridentLayout from '../../../layouts/Trident'
import { classNames } from '../../../functions'
import Typography from '../../../components/Typography'
import { t } from '@lingui/macro'
import Button from '../../../components/Button'
import { useLingui } from '@lingui/react'
import SuggestedPools from '../../../features/trident/pools/SuggestedPools'
import SearchResultPools from '../../../features/trident/pools/SearchResultPools'
import PoolListActions from '../../../features/trident/pools/PoolListActions'
import Link from 'next/link'
import { RecoilRoot, useRecoilValue } from 'recoil'
import { searchQueryAtom } from '../../../features/trident/pools/context/atoms'

const Pool = () => {
  const { i18n } = useLingui()
  const searchQuery = useRecoilValue(searchQueryAtom)

  return (
    <div className="flex flex-col w-full gap-6 mt-px mb-5">
      <div className="flex flex-col p-5 bg-dark-800 bg-auto bg-binary-pattern bg-opacity-90 gap-6">
        <div className="">
          <Typography variant="h3" className="text-high-emphesis" weight={400}>
            {i18n._(t`Provide liquidity & earn.`)}
          </Typography>
          <Typography variant="sm" weight={400}>
            {i18n._(t`Earn LP fees by depositing tokens to the platform.`)}
          </Typography>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button color="gradient" size="sm" className="text-sm font-bold text-white py-2">
            <Link href={'/trident/create'}>{i18n._(t`Create a New Pool`)}</Link>
          </Button>
          <Button color="gradient" variant="outlined" className="text-sm font-bold text-white py-2">
            <Link href={'/trident/poolTypes'}>{i18n._(t`Pool Type Info`)}</Link>
          </Button>
        </div>
      </div>
      <PoolListActions />
      <div className={classNames('flex gap-6', searchQuery ? 'flex-col-reverse' : 'flex-col')}>
        <SuggestedPools />
        <SearchResultPools />
      </div>
    </div>
  )
}

Pool.Provider = RecoilRoot
Pool.Layout = (props) => <TridentLayout {...props} headerBg="bg-binary-pattern" headerHeight="h-[220px]" />

export default Pool
