import Head from 'next/head'
import Typography from '../../../components/Typography'

export default function Tokens() {
  return (
    <>
      <Head>
        <title>Token Analytics | Sushi</title>
        <meta name="description" content="Token Analytics by Sushi" />
      </Head>
      <Typography variant="h2" component="h1" className="text-high-emphesis">
        Tokens
      </Typography>
    </>
  )
}
