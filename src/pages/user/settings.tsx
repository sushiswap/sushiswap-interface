import Head from 'next/head'

import Container from '../../components/Container'
export default function Settings() {
  return (
    <Container id="settings-page" className="py-4 space-y-3 md:py-8 lg:py-12" maxWidth="2xl">
      <Head>
        <title>Settings | Sushi</title>
        <meta name="description" content="SushiSwap Settings..." />
        <meta key="twitter:description" name="twitter:description" content="SushiSwap Settings..." />
        <meta key="og:description" property="og:description" content="SushiSwap Settings..." />
      </Head>
    </Container>
  )
}
