import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { SetAssetPrice } from 'app/features/trident/create/classic/SetAssetPrice'
import { SpendSource } from 'app/features/trident/create/context/SelectedAsset'
import { usePoolAssetInput } from 'app/features/trident/create/context/usePoolAssetInput'
import SwapAssetPanel from 'app/features/trident/swap/SwapAssetPanel'
import React, { FC } from 'react'

const SelectPanel: FC<{ index: number }> = ({ index }) => {
  const { i18n } = useLingui()
  const { asset, setCurrency, setAmount, setWalletSource } = usePoolAssetInput(index)

  return (
    <SwapAssetPanel
      error={asset.error !== undefined}
      header={(props) => <SwapAssetPanel.Header {...props} label={i18n._(t`Withdraw from`)} />}
      walletToggle={(props) => (
        <SwapAssetPanel.Switch
          {...props}
          label={i18n._(t`Withdraw from`)}
          onChange={() => setWalletSource(asset.oppositeToggle())}
        />
      )}
      selected={true}
      spendFromWallet={asset.spendFromSource !== SpendSource.BENTO_BOX}
      currency={asset.currency}
      value={asset.amount}
      onChange={(amount) => setAmount(amount)}
      onSelect={(currency) => setCurrency(currency)}
    />
  )
}

export const SelectAssetsWidget: FC = () => {
  const { i18n } = useLingui()

  return (
    <div>
      <Typography variant="h3" weight={700} className="text-high-emphesis">
        {i18n._(t`Select Two Assets`)}
      </Typography>
      <div className="text-secondary mt-2">
        {i18n._(t`Please select the two assets that this pool will consist of.`)}
      </div>
      <div className="flex flex-col gap-6 max-w-2xl mt-6">
        <SetAssetPrice />
        <SelectPanel index={0} />
        <SelectPanel index={1} />
      </div>
    </div>
  )
}
