import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import loadingCircle from 'app/animation/loading-circle.json'
import AssetInput from 'app/components/AssetInput'
import Button from 'app/components/Button'
import Dots from 'app/components/Dots'
import Typography from 'app/components/Typography'
import { attemptingTxnAtom, showReviewAtom, spendFromWalletSelector } from 'app/features/trident/context/atoms'
import { useIndependentAssetInputs } from 'app/features/trident/context/hooks/useIndependentAssetInputs'
import TridentApproveGate from 'app/features/trident/TridentApproveGate'
import { classNames } from 'app/functions/styling'
import { useBentoBoxContract, useTridentRouterContract } from 'app/hooks/useContract'
import Lottie from 'lottie-react'
import React, { FC } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

export const DepositAssets: FC = () => {
  const { i18n } = useLingui()
  const bentoBox = useBentoBoxContract()
  const router = useTridentRouterContract()

  const {
    currencies: [currencies],
    isMax,
    onMax,
    error,
    setInputAtIndex,
    formattedAmounts,
    parsedAmounts,
  } = useIndependentAssetInputs()

  const setShowReview = useSetRecoilState(showReviewAtom)
  const [spendFromWalletA, setSpendFromWalletA] = useRecoilState(spendFromWalletSelector(0))
  const [spendFromWalletB, setSpendFromWalletB] = useRecoilState(spendFromWalletSelector(1))
  const attemptingTxn = useRecoilValue(attemptingTxnAtom)

  return (
    <div>
      <Typography variant="h3" weight={700} className="text-high-emphesis">
        Deposit Assets
      </Typography>
      <div className="text-secondary mt-2">
        Deposit pool tokens in 50/50 ratio. If the token ratio is far from 50/50, you will experience a high price
        impact.
      </div>
      <div className="flex flex-col gap-4 mt-8 max-w-3xl">
        <AssetInput
          value={formattedAmounts[0]}
          currency={currencies[0]}
          onChange={(val) => setInputAtIndex(val, 0)}
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
          currency={currencies[1]}
          onChange={(val) => setInputAtIndex(val, 1)}
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
            inputAmounts={parsedAmounts}
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
                i18n._(t`Review & Confirm`)
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
    </div>
  )
}
