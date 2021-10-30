import Container from 'components/Container'
import Head from 'next/head'

export default function Migrate() {
  return (
    <Container id="migrate-page" className="py-4 md:py-8 lg:py-12" maxWidth="2xl">
      <Head>
        <title>Migrate | Sushi</title>
        <meta key="description" name="description" content="Migrate Liquidity from ..." />
      </Head>
    </Container>
  )
}
