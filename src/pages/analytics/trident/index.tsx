import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import TokenSearch from 'app/features/analytics/tokens/TokenSearch'
import SearchResultTokens from 'app/features/analytics/trident/SearchResultTokens'
import { PoolSearch } from 'app/features/trident/pools/PoolSearch'
import { PoolSort } from 'app/features/trident/pools/PoolSort'
import SearchResultPools from 'app/features/trident/pools/SearchResultPools'
import { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

const chartTimespans = [
  {
    text: '1W',
    length: 604800,
  },
  {
    text: '1M',
    length: 2629746,
  },
  {
    text: '1Y',
    length: 31556952,
  },
  {
    text: 'ALL',
    length: Infinity,
  },
]

function Analytics() {
  const { i18n } = useLingui()
  const router = useRouter()
  const chainId = Number(router.query.chainId)

  return (
    <>
      <NextSeo title={`Trident Analytics`} />
      <TridentHeader className="sm:!flex-row justify-between items-center" pattern="bg-bubble">
        <div>
          <Typography variant="h2" className="text-high-emphesis" weight={700}>
            {i18n._(t`Trident Analytics.`)}
          </Typography>
          <Typography variant="sm" weight={400}>
            {i18n._(t`Dive deeper in the analytics of Trident Pools and Tokens.`)}
          </Typography>
        </div>
      </TridentHeader>

      <TridentBody>
        <div className="flex flex-col w-full gap-10">
          <div className="flex w-full">
            <div className="flex flex-col w-full gap-5">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <PoolSearch />
                <PoolSort />
              </div>
              <SearchResultPools />
            </div>
          </div>
          <div className="flex flex-col w-full gap-5">
            <TokenSearch />
            <SearchResultTokens chainId={chainId} />
          </div>
        </div>
      </TridentBody>
    </>
  )
}

export default Analytics
