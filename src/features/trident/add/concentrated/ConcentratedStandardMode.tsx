import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import loadingCircle from 'animation/loading-circle.json'
import AssetInput from 'app/components/AssetInput'
import Button from 'app/components/Button'
import Dots from 'app/components/Dots'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import { useBentoBoxContract, useTridentRouterContract } from 'app/hooks/useContract'
import Lottie from 'lottie-react'
import React, { FC } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { attemptingTxnAtom, poolAtom, showReviewAtom, spendFromWalletSelector } from '../../context/atoms'
import { TypedField, useDependentAssetInputs } from '../../context/hooks/useDependentAssetInputs'
import TridentApproveGate from '../../TridentApproveGate'
import TransactionDetails from '../TransactionDetails'

const ConcentratedStandardMode: FC = () => {
  const { i18n } = useLingui()
  const { pool } = useRecoilValue(poolAtom)
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

  const setShowReview = useSetRecoilState(showReviewAtom)
  const [spendFromWalletA, setSpendFromWalletA] = useRecoilState(spendFromWalletSelector(0))
  const [spendFromWalletB, setSpendFromWalletB] = useRecoilState(spendFromWalletSelector(1))
  const attemptingTxn = useRecoilValue(attemptingTxnAtom)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 px-5">
        <AssetInput
          value={formattedAmounts[0]}
          currency={pool?.token0}
          onChange={(val) => {
            setTypedField(TypedField.A)
            setMainInput(val || '')
          }}
          headerRight={
            <AssetInput.WalletSwitch
              onChange={() => setSpendFromWalletA(!spendFromWalletA)}
              checked={spendFromWalletA}
            />
          }
          spendFromWallet={spendFromWalletA}
        />
        <AssetInput
          value={formattedAmounts[1]}
          currency={pool?.token1}
          onChange={(val) => {
            setTypedField(TypedField.B)
            setSecondaryInput(val || '')
          }}
          headerRight={
            <AssetInput.WalletSwitch
              onChange={() => setSpendFromWalletB(!spendFromWalletB)}
              checked={spendFromWalletB}
            />
          }
          spendFromWallet={spendFromWalletB}
        />

        <div className="flex flex-col gap-3">
          <TridentApproveGate
            inputAmounts={[parsedAmountA, parsedAmountB]}
            tokenApproveOn={bentoBox?.address}
            masterContractAddress={router?.address}
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
                    <Button color="gradient" variant={isMax ? 'filled' : 'outlined'} disabled={isMax} onClick={onMax}>
                      <Typography
                        variant="sm"
                        weight={700}
                        className={!isMax ? 'text-high-emphesis' : 'text-low-emphasis'}
                      >
                        {i18n._(t`Max Deposit`)}
                      </Typography>
                    </Button>
                  )}
                  <Button
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
                    <Typography
                      variant="sm"
                      weight={700}
                      className={!error ? 'text-high-emphesis' : 'text-low-emphasis'}
                    >
                      {buttonText}
                    </Typography>
                  </Button>
                </div>
              )
            }}
          </TridentApproveGate>
        </div>
      </div>
      {!error && (
        <div className="flex flex-col px-5">
          <TransactionDetails />
        </div>
      )}
    </div>
  )
}

export default ConcentratedStandardMode
