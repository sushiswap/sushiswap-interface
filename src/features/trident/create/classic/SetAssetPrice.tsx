import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Alert from 'app/components/Alert'
import React, { FC } from 'react'

export const SetAssetPrice: FC = () => {
  const { i18n } = useLingui()
  return (
    <Alert
      dismissable={false}
      message={i18n._(
        t`When creating a pair, you are the first liquidity provider. The ratio of tokens you add will set the price of this pool. Once you are happy with the rate, click ‘Create Pool’.`
      )}
      type="information"
    />
  )
}
