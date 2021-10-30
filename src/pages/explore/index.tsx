import Container from 'app/components/Container'
import Head from 'next/head'

export default function Explore() {
  return (
    <Container id="explore-page" className="py-4 md:py-8 lg:py-12" maxWidth="2xl">
      <Head>
        <title>Explore | Sushi</title>
        <meta key="description" name="description" content="Explore..." />
      </Head>
    </Container>
  )
}
