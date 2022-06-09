import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import { XSUSHI } from 'app/config/tokens'
import InfoCard from 'app/features/analytics/bar/InfoCard'
import { formatNumber, formatPercent } from 'app/functions'
import { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { useNativePrice, useTokens } from 'app/services/graph'
import { useBar, useBarUser } from 'app/services/graph/hooks/bar'
import { useActiveWeb3React } from 'app/services/web3'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React from 'react'

export default function User() {
  const web3 = useActiveWeb3React()
  const router = useRouter()
  const account = (router.query.address as string) || web3.account

  const { i18n } = useLingui()

  const { data: ethPrice } = useNativePrice({ chainId: ChainId.ETHEREUM })

  const xSushi = useTokens({
    chainId: ChainId.ETHEREUM,
    variables: { where: { id: XSUSHI.address.toLowerCase() } },
  })?.[0]

  const { data: bar } = useBar()

  const { data: user } = useBarUser({ variables: { id: account }, shouldFetch: !!account })

  const [xSushiPrice, xSushiMarketcap] = [
    xSushi?.derivedETH * ethPrice,
    xSushi?.derivedETH * ethPrice * bar?.totalSupply,
  ]

  return (
    <>
      <NextSeo title={`Farm Analytics`} />

      <TridentHeader className="sm:!flex-row justify-between items-center" pattern="bg-bubble">
        <div>
          <Typography variant="h2" className="text-high-emphesis" weight={700}>
            {i18n._(t`User Analytics.`)}
          </Typography>
          <Typography variant="sm" weight={400}>
            {i18n._(t`Find out all about user here.`)}
          </Typography>
        </div>
      </TridentHeader>

      <TridentBody>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <InfoCard text="Price" number={formatNumber(xSushiPrice ?? 0, true)} />
            <InfoCard text="Market Cap" number={formatNumber(xSushiMarketcap ?? 0, true, false)} />
            <InfoCard text="Total Supply" number={formatNumber(bar?.totalSupply)} />
            <InfoCard text="xSUSHI : SUSHI" number={Number(bar?.ratio ?? 0)?.toFixed(4)} />
            {user && (
              <>
                <InfoCard text="User Staked" number={formatNumber(user.sushiStaked ?? 0)} />
                <InfoCard
                  text="User Staked USD"
                  number={formatNumber((user.sushiStaked * xSushiPrice) / bar?.ratio ?? 0, true, false)}
                />
                <InfoCard
                  text="APR"
                  number={formatPercent(
                    ((user.xSushi * xSushiPrice ?? 0) / ((user.sushiStaked * xSushiPrice) / bar?.ratio ?? 1)) * 100
                  )}
                />
                <InfoCard text="xSUSHI" number={formatNumber(user.xSushi)} />
                <InfoCard text="xSUSHI USD" number={formatNumber(user.xSushi * xSushiPrice ?? 0, true, false)} />
              </>
            )}
          </div>
        </div>
      </TridentBody>
    </>
  )
}
