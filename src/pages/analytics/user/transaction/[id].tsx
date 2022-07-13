import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

export default function UserTransaction() {
  const { i18n } = useLingui()

  const router = useRouter()
  const { id } = router.query

  return (
    <>
      <NextSeo title={`User Analytics`} />

      <TridentHeader className="sm:!flex-row justify-between items-center" pattern="bg-bubble">
        <div>
          <Typography variant="h2" className="text-high-emphesis" weight={700}>
            {i18n._(t`User Analytics.`)}
          </Typography>
          <Typography variant="sm" weight={400}>
            {i18n._(t`Find out all about user here.`)}
          </Typography>
        </div>
      </TridentHeader>

      <TridentBody>
        <div className="space-y-5">tx hash: {id}</div>
      </TridentBody>
    </>
  )
}
