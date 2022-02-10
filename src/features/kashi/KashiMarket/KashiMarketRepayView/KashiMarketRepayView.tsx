import { ArrowDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useKashiMarket } from 'app/features/kashi/KashiMarket'
import { KashiMarketRepayClosePositionView } from 'app/features/kashi/KashiMarket/KashiMarketRepayView/KashiMarketRepayClosePositionView'
import SwapAssetPanel from 'app/features/trident/swap/SwapAssetPanel'
import { tryParseAmount } from 'app/functions'
import React, { FC, useState } from 'react'

import KashiMarketRepayButton from './KashiMarketRepayButton'

const KashiMarketRepayView: FC = () => {
  const { i18n } = useLingui()
  const { market } = useKashiMarket()

  const [closePosition, setClosePosition] = useState<boolean>(false)
  const [repayFromWallet, setRepayFromWallet] = useState<boolean>(true)
  const [removeToWallet, setRemoveToWallet] = useState<boolean>(true)
  const [repayAmount, setRepayAmount] = useState<string>()
  const [removeAmount, setRemoveAmount] = useState<string>()
  const repayToken = market.asset.token
  const removeToken = market.collateral.token
  const repayAmountCurrencyAmount = repayAmount ? tryParseAmount(repayAmount, repayToken) : undefined
  const removeAmountCurrencyAmount = removeAmount ? tryParseAmount(removeAmount, removeToken) : undefined

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <SwapAssetPanel
          error={false}
          header={(props) => <SwapAssetPanel.Header {...props} label={i18n._(t`Repay`)} />}
          walletToggle={(props) => (
            <SwapAssetPanel.Switch
              id={`switch-classic-withdraw-from-0}`}
              {...props}
              label={i18n._(t`Repay from`)}
              onChange={() => setRepayFromWallet((prev) => !prev)}
            />
          )}
          spendFromWallet={repayFromWallet}
          currency={repayToken}
          value={repayAmount}
          onChange={setRepayAmount}
          currencies={[]}
        />
      </div>
      <div className="flex justify-center relative lg:mt-[-23px] lg:mb-[-23px]">
        <div className="rounded-full lg:border-2 lg:border-dark-800 hover:lg:border-dark-700 hover:text-white bg-dark-900 p-1.5 cursor-pointer">
          <ArrowDownIcon width={12} height={12} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <SwapAssetPanel
          error={false}
          header={(props) => <SwapAssetPanel.Header {...props} label={i18n._(t`Remove`)} />}
          walletToggle={(props) => (
            <SwapAssetPanel.Switch
              {...props}
              id={`switch-classic-withdraw-from-0}`}
              label={i18n._(t`Receive in`)}
              onChange={() => setRemoveToWallet((prev) => !prev)}
            />
          )}
          spendFromWallet={removeToWallet}
          currency={removeToken}
          value={removeAmount}
          onChange={setRemoveAmount}
          currencies={[]}
        />
      </div>
      <KashiMarketRepayClosePositionView
        setRepayAmount={setRepayAmount}
        setRemoveAmount={setRemoveAmount}
        enabled={closePosition}
        onSwitch={() => setClosePosition((prev) => !prev)}
      />
      <KashiMarketRepayButton
        closePosition={closePosition}
        removeAmount={removeAmountCurrencyAmount}
        repayAmount={repayAmountCurrencyAmount}
        repayFromWallet={repayFromWallet}
      />
    </div>
  )
}

export default KashiMarketRepayView
