import Container from '../components/Container'
import Head from 'next/head'

export default function Test() {
  return (
    <Container id="test-page" className="py-4 md:py-8 lg:py-12" maxWidth="2xl">
      <Head>
        <title>Test | Sushi</title>
        <meta name="description" content="Test" />
      </Head>
      <h1 role="heading">Test</h1>
    </Container>
  )
}
