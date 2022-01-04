import { SwitchVerticalIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId } from '@sushiswap/core-sdk'
import Container from 'app/components/Container'
import DoubleGlowShadow from 'app/components/DoubleGlowShadow'
import Gas from 'app/components/Gas'
import SettingsTab from 'app/components/Settings'
import { Feature } from 'app/enums'
import { currenciesAtom } from 'app/features/trident/context/atoms'
import useCurrenciesFromURL from 'app/features/trident/context/hooks/useCurrenciesFromURL'
import useSwapAssetPanelInputs, { TypedField } from 'app/features/trident/context/hooks/useSwapAssetPanelInputs'
import RecipientPanel from 'app/features/trident/swap/RecipientPanel'
import SwapAssetPanel from 'app/features/trident/swap/SwapAssetPanel'
import SwapButton from 'app/features/trident/swap/SwapButton'
import SwapRate from 'app/features/trident/swap/SwapRate'
import SwapReviewModal from 'app/features/trident/swap/SwapReviewModal'
import WrapButton from 'app/features/trident/swap/WrapButton'
import NetworkGuard from 'app/guards/Network'
import { useActiveWeb3React } from 'app/services/web3'
import { useExpertModeManager } from 'app/state/user/hooks'
import React, { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'

const Swap = () => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const { currencies, setURLCurrency } = useCurrenciesFromURL()
  const setCurrencies = useSetRecoilState(currenciesAtom)
  const [expertMode] = useExpertModeManager()
  const {
    typedField: [typedField, setTypedField],
    mainInput: [, setMainInput],
    secondaryInput: [, setSecondaryInput],
    spendFromWallet: [spendFromWallet, setSpendFromWallet],
    receiveToWallet: [receiveToWallet, setReceiveToWallet],
    formattedAmounts,
    trade,
    priceImpact,
    switchCurrencies,
    error,
    isWrap,
  } = useSwapAssetPanelInputs()

  useEffect(() => {
    if (!chainId || !currencies?.[0] || !currencies?.[1]) return
    setCurrencies([currencies?.[0], currencies?.[1]])
  }, [chainId, currencies, setCurrencies])

  return (
    <Container className="px-2 py-4 md:py-8 lg:py-12" maxWidth="2xl">
      <DoubleGlowShadow>
        <div className="rounded-[20px] bg-dark-900 border border-dark-700 pb-3">
          <div className="flex items-center justify-end gap-3 px-4 py-3">
            {chainId === ChainId.ETHEREUM && (
              <div className="items-center hidden h-full px-3 py-1 space-x-3 border border-transparent rounded cursor-pointer text-green md:flex hover:bg-dark-800 hover:border-dark-700">
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M13.5215 0.618164L12.6818 1.57302L15.933 4.37393V13.2435C15.9114 13.6891 15.5239 14.0498 15.0502 14.0286C14.6196 14.0074 14.2751 13.6679 14.2536 13.2435V7.28093C14.2536 6.21998 13.3923 5.37122 12.3158 5.37122H11.8421V2.67641C11.8421 1.61546 10.9808 0.766697 9.90428 0.766697H1.93779C0.861242 0.766697 0 1.61546 0 2.67641V18.4421C0 18.9089 0.387559 19.2909 0.861242 19.2909H10.9808C11.4545 19.2909 11.8421 18.9089 11.8421 18.4421V6.64436H12.3158C12.6818 6.64436 12.9617 6.92021 12.9617 7.28093V13.2435C13.0048 14.4105 13.9737 15.3017 15.1579 15.2805C16.2775 15.2381 17.1818 14.3469 17.2248 13.2435V3.80102L13.5215 0.618164ZM9.66744 8.89358H2.17464V3.10079H9.66744V8.89358Z"
                    fill="#7CFF6B"
                  />
                </svg>

                <div className="hidden md:block text-baseline">
                  <Gas />
                </div>
              </div>
            )}
            <div
              id="btn-transaction-settings"
              className="border border-transparent rounded hover:bg-dark-800 hover:border-dark-700"
            >
              <SettingsTab trident={true} />
            </div>
          </div>
          <div className="block w-full border-b lg:hidden border-dark-800" />
          <div className="flex flex-col px-2 lg:gap-3 ">
            <SwapAssetPanel
              error={typedField === TypedField.A && !!error && !!formattedAmounts[0]}
              header={
                <SwapAssetPanel.Header label={i18n._(t`Swap from`)} id={`asset-select-trigger-${TypedField.A}`} />
              }
              walletToggle={
                <SwapAssetPanel.Switch
                  label={i18n._(t`Pay from`)}
                  onChange={setSpendFromWallet}
                  id="chk-pay-from-wallet"
                />
              }
              darkBackground={typedField === TypedField.A}
              spendFromWallet={spendFromWallet}
              currency={currencies[0]}
              value={formattedAmounts[0]}
              onChange={(value) => {
                setTypedField(TypedField.A)
                setMainInput(value)
              }}
              onSelect={(currency) => setURLCurrency(currency, 0)}
            />
            <div className="flex justify-center relative lg:mt-[-20px] lg:mb-[-20px]">
              <div
                id="btn-switch-currencies"
                className="rounded-full border-2 border-dark-700 lg:border-dark-800 hover:lg:border-dark-700 hover:text-white bg-dark-900 p-1.5 cursor-pointer"
                onClick={switchCurrencies}
              >
                <SwitchVerticalIcon width={24} height={24} />
              </div>
            </div>
            <SwapAssetPanel
              error={typedField === TypedField.B && !!error && !!formattedAmounts[0]}
              header={
                <SwapAssetPanel.Header
                  label={i18n._(t`Swap to (estimated)`)}
                  id={`asset-select-trigger-${TypedField.B}`}
                />
              }
              walletToggle={
                <SwapAssetPanel.Switch
                  label={i18n._(t`Receive to`)}
                  onChange={setReceiveToWallet}
                  id="chk-receive-to-wallet"
                />
              }
              darkBackground={typedField === TypedField.B}
              spendFromWallet={receiveToWallet}
              currency={currencies[1]}
              value={formattedAmounts[1]}
              onChange={(value) => {
                // Uncomment when exactOut works
                // setTypedField(TypedField.B)
                setSecondaryInput(value)
              }}
              onSelect={(currency) => setURLCurrency(currency, 1)}
              priceImpact={priceImpact}
              // Remove when exactOut works
              disabled={true}
            />
            {expertMode && (
              <div className="mb-3 lg:mb-0">
                <RecipientPanel />
              </div>
            )}
            {trade && (
              <div className="px-5 py-2 bg-dark-1000 rounded-[14px] mb-3 lg:mb-0">
                <SwapRate className="font-bold text-primary" />
              </div>
            )}
            {isWrap ? <WrapButton /> : <SwapButton />}
          </div>
        </div>
        <SwapReviewModal />
      </DoubleGlowShadow>
    </Container>
  )
}

Swap.Guard = NetworkGuard(Feature.TRIDENT)

export default Swap
