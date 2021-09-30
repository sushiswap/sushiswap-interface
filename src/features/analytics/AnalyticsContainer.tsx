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

      <Container id="analytics" maxWidth="full" className="grid h-full grid-flow-col grid-cols-10 px-4 mx-auto gap-9">
        <div className="sticky top-0 hidden lg:block md:col-span-2 3xl:col-start-2 3xl:col-span-1">
          <Sidebar
            items={[
              {
                text: 'Dashboard',
                href: '/analytics/dashboard',
              },
              {
                text: 'xSushi',
                href: '/analytics/xSushi',
              },
              {
                text: 'Farms',
                href: '/analytics/farms',
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
        <div className="col-span-10 lg:border-l lg:col-span-8 3xl:col-span-7 border-dark-700">{children}</div>
      </Container>
    </>
  )
}
