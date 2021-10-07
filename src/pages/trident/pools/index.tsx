import React from 'react'
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
import TridentLayout, { TridentBody, TridentHeader } from '../../../layouts/Trident'

const Pool = () => {
  const { i18n } = useLingui()
  const searchQuery = useRecoilValue(searchQueryAtom)

  return (
    <>
      <TridentHeader pattern="bg-binary-pattern">
        <div>
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
      </TridentHeader>
      <TridentBody>
        <PoolListActions />
        <div className={classNames('flex gap-6', searchQuery ? 'flex-col-reverse' : 'flex-col')}>
          <SuggestedPools />
          <SearchResultPools />
        </div>
      </TridentBody>
    </>
  )
}

Pool.Provider = RecoilRoot
Pool.Layout = TridentLayout

export default Pool
