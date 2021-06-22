import Back from '../../components/Back'
import Container from '../../components/Container'
import Head from 'next/head'
import Typography from '../../components/Typography'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export default function Me() {
  const { i18n } = useLingui()

  return (
    <>
      <Head>
        <title>My SUSHI | Sushi</title>
        <meta name="description" content="My SUSHI" />
      </Head>

      <Container maxWidth="2xl" className="p-4 space-y-3">
        <div className="p-4 mb-3 space-y-3">
          <Back />

          <Typography component="h1" variant="h2" className=" text-high-emphesis">
            {i18n._(t`My SUSHI`)}
          </Typography>
        </div>

        <Typography component="h2" variant="h3" className="p-4 text-primary">
          {i18n._(t`Balance`)}
        </Typography>
      </Container>
    </>
  )
}
