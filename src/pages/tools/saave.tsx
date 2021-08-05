import Container from '../../components/Container'
import Head from 'next/head'
import Typography from '../../components/Typography'

export default function Saave() {
  return (
    <Container id="saave-page" className="py-4 md:py-8 lg:py-12" maxWidth="2xl">
      <Head>
        <title>Saave | Sushi</title>
        <meta key="description" name="description" content="SushiSwap Saave..." />
      </Head>

      <Container className="text-center">
        <Typography component="h1" variant="h1" className="mb-4">
          Saave
        </Typography>
        <Typography variant="lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse iaculis cursus nunc. Pellentesque
          aliquam, mi sed rhoncus cursus, turpis lectus vehicula enim, eu volutpat diam quam at felis.
        </Typography>
      </Container>
    </Container>
  )
}
