import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import PoolTypesList from 'app/features/trident/pooltypes/PoolTypesList'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import Link from 'next/link'
import React from 'react'
import { RecoilRoot } from 'recoil'

const PoolTypes = () => {
  const { i18n } = useLingui()

  return (
    <>
      <TridentHeader>
        <div className="flex flex-row justify-between">
          <Button
            color="blue"
            variant="outlined"
            size="sm"
            className="py-1 pl-2 rounded-full"
            startIcon={<ChevronLeftIcon width={24} height={24} />}
          >
            <Link href={`/trident/pools`}>{i18n._(t`Back`)}</Link>
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <Typography variant="h3" className="text-high-emphesis" weight={700}>
            {i18n._(t`Pool Types`)}
          </Typography>
          <Typography variant="sm" weight={400}>
            {i18n._(t`Learn more about the power of Sushi's AMM and Tines routing engine.`)}
          </Typography>
        </div>
      </TridentHeader>
      <TridentBody>
        <div className="flex flex-col gap-4 px-5">
          <Typography variant="h3" className="text-high-emphesis" weight={700}>
            {i18n._(t`What kinds of liquidity pools are supported on Sushi?`)}
          </Typography>
          <Typography variant="sm">
            {i18n._(
              t`Currently, there are four pool types on the platform.  However, our infrastructure has been built in a way to support more and more pool types as they emerge.`
            )}
          </Typography>
        </div>
        <div className="px-5">
          <Typography
            variant="lg"
            className="text-transparent bg-gradient-to-r from-blue to-pink bg-clip-text"
            weight={700}
          >
            {i18n._(t`CURRENT POOL TYPES`)}
          </Typography>
          <Typography variant="sm">{i18n._(t`Tap any to learn more`)}</Typography>
        </div>
        <PoolTypesList />
      </TridentBody>
    </>
  )
}

PoolTypes.Provider = RecoilRoot
PoolTypes.Layout = TridentLayout

export default PoolTypes
