import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { AnalyticsKashiAppContextProvider } from 'app/features/analytics/kashi/context/AppContext'
import KashiPairsView from 'app/features/analytics/kashi/views/KashiPairsView'
import { TridentBody, TridentHeader } from 'app/layouts/Trident'
import React, { FC } from 'react'

const AnalyticsKashiPairsPage: FC = () => {
  const { i18n } = useLingui()
  return (
    <>
      <TridentHeader className="sm:!flex-row justify-between items-center" pattern="bg-bubble">
        <div>
          <Typography variant="h2" className="text-high-emphesis" weight={700}>
            {i18n._(t`Kashi Analytics.`)}
          </Typography>
          <Typography variant="sm" weight={400}>
            {i18n._(t`Lend and borrow assets in Kashi isolated risk markets`)}
          </Typography>
        </div>
      </TridentHeader>
      <TridentBody>
        <AnalyticsKashiAppContextProvider>
          <KashiPairsView />
        </AnalyticsKashiAppContextProvider>
      </TridentBody>
    </>
  )
}

export default AnalyticsKashiPairsPage
