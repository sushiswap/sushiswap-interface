import Container from '../../components/Container'
import Head from 'next/head'
import Sidebar from '../../components/Sidebar'

export default function AnalyticsContainer({ children }): JSX.Element {
  return (
    <>
      <Head>
        <title>SushiSwap Liquidity Pair (SLP) Analytics | Sushi</title>
        <meta name="description" content="SushiSwap Liquidity Pair (SLP) Analytics by Sushi" />
      </Head>

      <Container
        id="analytics"
        maxWidth="full"
        className="grid h-full grid-flow-col grid-cols-10 px-4 py-4 mx-auto md:py-8 lg:py-12 gap-9"
      >
        <div
          className="sticky top-0 hidden lg:block md:col-span-2 3xl:col-start-2 3xl:col-span-1"
          style={{ maxHeight: '40rem' }}
        >
          <Sidebar
            items={[
              {
                text: 'Dashboard',
                href: '/analytics/dashboard',
              },
              {
                text: 'Bar',
                href: '/analytics/bar',
              },
              {
                text: 'Pools',
                href: '/analytics/pools',
              },
              {
                text: 'Pairs',
                href: '/analytics/pairs',
              },
              {
                text: 'Tokens',
                href: '/analytics/tokens',
              },
            ]}
          />
        </div>
        <div className="col-span-10 space-y-4 lg:col-span-8 3xl:col-span-7">{children}</div>
      </Container>
    </>
  )
}
