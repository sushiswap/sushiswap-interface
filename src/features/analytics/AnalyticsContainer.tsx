import Head from 'next/head'
import Container from '../../components/Container'
import AnalyticsMenu from './AnalyticsMenu'

export default function AnalyticsContainer({ children }): JSX.Element {
  return (
    <>
      <Head>
        <title>SushiSwap Liquidity Pair (SLP) Analytics | Sushi</title>
        <meta name="description" content="SushiSwap Liquidity Pair (SLP) Analytics by Sushi" />
      </Head>

      <Container maxWidth="full" className="grid h-full grid-flow-col grid-cols-10 mx-auto gap-9">
        <div
          className="sticky top-0 hidden lg:block md:col-span-2 2xl:col-start-2 2xl:col-span-1"
          style={{ maxHeight: '40rem' }}
        >
          <AnalyticsMenu />
        </div>
        <div className="col-span-10 space-y-6 lg:col-span-8 2xl:col-span-7">{children}</div>
      </Container>
    </>
  )
}
