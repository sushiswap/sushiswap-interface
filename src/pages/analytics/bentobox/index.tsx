import { DiscoverHeader } from 'app/features/analytics/bentobox/DiscoverHeader'
import getAnalyticsBentobox, { AnalyticsBentobox } from 'app/features/analytics/bentobox/getAnalyticsBentobox'
import TokenTable from 'app/features/analytics/bentobox/TokenTable'
import TokenSearch from 'app/features/analytics/tokens/TokenSearch'
import InfoCard from 'app/features/analytics/xsushi/InfoCard'
import { formatNumber } from 'app/functions/format'
import { TridentBody } from 'app/layouts/Trident'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import useSWR, { SWRConfig } from 'swr'

export default function BentoBox({ fallback }: { fallback: any }) {
  return (
    <SWRConfig value={{ fallback }}>
      <_BentoBox />
    </SWRConfig>
  )
}

function _BentoBox(): JSX.Element {
  const router = useRouter()

  const chainId = Number(router.query.chainId)

  const { data } = useSWR<AnalyticsBentobox>(chainId ? `/api/analytics/bentobox/${chainId}` : null, (url: string) =>
    fetch(url).then((response) => response.json())
  )

  return (
    <>
      <NextSeo title={`BentoBox Anlytics`} />
      <DiscoverHeader />
      <TridentBody>
        <div className="text-2xl font-bold text-high-emphesis">KPIs</div>
        <div className="flex flex-row space-x-4 overflow-auto">
          <InfoCard text="TVL" number={formatNumber(data?.bentoBox.tvl)} />
          <InfoCard text="User Count" number={data?.bentoBox?.userCount || 0} />
          <InfoCard text="Token Count" number={data?.bentoBox?.tokenCount || 0} />
          <InfoCard text="Flashloan Count" number={data?.bentoBox?.flashloanCount || 0} />
          <InfoCard text="Transaction Count" number={data?.bentoBox?.transactionCount || 0} />
          {/* <InfoCard text="Master Contract Count" number={bentoBox?.masterContractCount || 0} /> */}
          {/* <InfoCard text="Clone Count" number={bentoBox?.cloneCount || 0} /> */}
        </div>

        <div className="flex flex-col w-full gap-10">
          <TokenSearch />
          <TokenTable chainId={chainId} />
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
        [`/api/analytics/bentobox/${query.chainId}`]: await getAnalyticsBentobox({
          chainId: Number(query.chainId),
        }),
      },
    },
  }
}
