import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import loadingCircle from 'app/animation/loading-circle.json'
import AssetInput from 'app/components/AssetInput'
import Button from 'app/components/Button'
import Dots from 'app/components/Dots'
import { classNames } from 'app/functions'
import { useBentoBoxContract, useTridentRouterContract } from 'app/hooks'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import Lottie from 'lottie-react'
import React from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { attemptingTxnAtom, showReviewAtom, spendFromWalletSelector } from '../../context/atoms'
import useCurrenciesFromURL from '../../context/hooks/useCurrenciesFromURL'
import { TypedField, useDependentAssetInputs } from '../../context/hooks/useDependentAssetInputs'
import TridentApproveGate from '../../TridentApproveGate'
import TransactionDetails from './../TransactionDetails'

const ClassicStandardMode = () => {
  const isDesktop = useDesktopMediaQuery()
  const { i18n } = useLingui()
  const bentoBox = useBentoBoxContract()
  const router = useTridentRouterContract()
  const {
    mainInput: [, setMainInput],
    secondaryInput: [, setSecondaryInput],
    formattedAmounts,
    parsedAmounts: [parsedAmountA, parsedAmountB],
    typedField: [, setTypedField],
    onMax,
    isMax,
    error,
  } = useDependentAssetInputs()
  const { currencies, setURLCurrency } = useCurrenciesFromURL()

  const setShowReview = useSetRecoilState(showReviewAtom)
  const [spendFromWalletA, setSpendFromWalletA] = useRecoilState(spendFromWalletSelector(0))
  const [spendFromWalletB, setSpendFromWalletB] = useRecoilState(spendFromWalletSelector(1))
  const attemptingTxn = useRecoilValue(attemptingTxnAtom)

  return (
    <>
      <div className="flex flex-col gap-6">
        <div />
        <div className="flex flex-col gap-4">
          <AssetInput
            value={formattedAmounts[0]}
            currency={currencies?.[0]}
            onChange={(val) => {
              setTypedField(TypedField.A)
              setMainInput(val || '')
            }}
            onSelect={(cur) => setURLCurrency(cur, 0)}
            headerRight={
              <AssetInput.WalletSwitch
                onChange={() => setSpendFromWalletA(!spendFromWalletA)}
                checked={spendFromWalletA}
                id="switch-spend-from-wallet-a"
              />
            }
            spendFromWallet={spendFromWalletA}
            id="asset-input-a"
          />
          <div />
          <AssetInput
            value={formattedAmounts[1]}
            currency={currencies?.[1]}
            onChange={(val) => {
              setTypedField(TypedField.B)
              setSecondaryInput(val || '')
            }}
            onSelect={(cur) => setURLCurrency(cur, 1)}
            headerRight={
              <AssetInput.WalletSwitch
                onChange={() => setSpendFromWalletB(!spendFromWalletB)}
                checked={spendFromWalletB}
                id="switch-spend-from-wallet-b"
              />
            }
            spendFromWallet={spendFromWalletB}
            id="asset-input-b"
          />
          <div className="flex flex-col gap-3">
            <TridentApproveGate
              inputAmounts={[parsedAmountA, parsedAmountB]}
              tokenApproveOn={bentoBox?.address}
              masterContractAddress={router?.address}
              withPermit={true}
            >
              {({ approved, loading }) => {
                const disabled = !!error || !approved || loading || attemptingTxn
                const buttonText = attemptingTxn ? (
                  <Dots>{i18n._(t`Depositing`)}</Dots>
                ) : loading ? (
                  ''
                ) : error ? (
                  error
                ) : (
                  i18n._(t`Confirm Deposit`)
                )

                return (
                  <div className={classNames(!isMax ? 'grid grid-cols-2 gap-3' : 'flex')}>
                    {!isMax && (
                      <Button color="blue" disabled={isMax} onClick={onMax}>
                        {i18n._(t`Max Deposit`)}
                      </Button>
                    )}
                    <Button
                      id={`btn-${buttonText.toString().replace(/\s/g, '')}`}
                      {...(loading && {
                        startIcon: (
                          <div className="w-4 h-4 mr-1">
                            <Lottie animationData={loadingCircle} autoplay loop />
                          </div>
                        ),
                      })}
                      color="gradient"
                      disabled={disabled}
                      onClick={() => setShowReview(true)}
                    >
                      {buttonText}
                    </Button>
                  </div>
                )
              }}
            </TridentApproveGate>
          </div>
        </div>
        {!error && !isDesktop && (
          <div className="flex flex-col">
            <TransactionDetails />
          </div>
        )}
      </div>
    </>
  )
}

export default ClassicStandardMode
