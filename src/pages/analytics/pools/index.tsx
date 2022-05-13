import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import getAnalyticsPairs from 'app/features/analytics/pools/getAnalyticsPairs'
import PoolSearch from 'app/features/analytics/pools/PoolSearch'
import PoolTable from 'app/features/analytics/pools/PoolTable'
import { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { SWRConfig } from 'swr'

export default function Pools({ fallback }: { fallback: any }) {
  return (
    <SWRConfig value={{ fallback }}>
      <_Pools />
    </SWRConfig>
  )
}

function _Pools() {
  const { i18n } = useLingui()
  const router = useRouter()

  const chainId = Number(router.query.chainId)

  return (
    <>
      <NextSeo title={`Pool Anlytics`} />
      <TridentHeader className="sm:!flex-row justify-between items-center" pattern="bg-bubble">
        <div>
          <Typography variant="h2" className="text-high-emphesis" weight={700}>
            {i18n._(t`Pool Analytics.`)}
          </Typography>
          <Typography variant="sm" weight={400}>
            {i18n._(t`Click on the column name to sort pairs by its TVL, volume, fees or APY.`)}
          </Typography>
        </div>
      </TridentHeader>
      <TridentBody>
        <div className="flex flex-col w-full gap-10">
          <PoolSearch />
          <PoolTable chainId={chainId} />
        </div>
      </TridentBody>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<any> = async ({ query, res }) => {
  if (typeof query.chainId !== 'string') return { props: { fallback: {} } }

  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')

  return {
    props: {
      fallback: {
        [`/api/analytics/pairs/${query.chainId}`]: await getAnalyticsPairs({
          chainId: Number(query.chainId),
          first: 500,
        }),
      },
    },
  }
}
