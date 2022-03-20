import Head from 'next/head'
import { useRouter } from 'next/router'

import Container from '../../components/Container'
import Sidebar from '../../components/Sidebar'

// @ts-ignore TYPE NEEDS FIXING
export default function AnalyticsContainer({ children }): JSX.Element {
  const router = useRouter()
  const chainId = String(router.query.chainId)
  return (
    <>
      <Head>
        <title>Sushi Analytics | Sushi</title>
        <meta name="description" content="SushiSwap Liquidity Pair (SLP) Analytics by Sushi" />
      </Head>

      <Container
        id="analytics"
        maxWidth="full"
        className="grid h-full grid-flow-col grid-cols-10 mx-auto lg:px-4 gap-9"
      >
        <div className="sticky top-0 hidden lg:block md:col-span-2 3xl:col-start-1 3xl:col-span-2">
          <Sidebar
            items={[
              {
                text: 'Dashboard',
                href: `/analytics/${chainId}/dashboard`,
              },
              {
                text: 'xSushi',
                href: '/analytics/xsushi',
              },
              {
                text: 'Farms',
                href: `/analytics/${chainId}/farms`,
              },
              {
                text: 'Pairs',
                href: `/analytics/${chainId}/pairs`,
              },
              {
                text: 'Tokens',
                href: `/analytics/${chainId}/tokens`,
              },
              {
                text: 'BentoBox',
                href: `/analytics/${chainId}/bentobox`,
              },
            ]}
          />
        </div>
        <div className="col-span-10 lg:border-l lg:col-span-8 3xl:col-span-7 border-dark-700">{children}</div>
      </Container>
    </>
  )
}
