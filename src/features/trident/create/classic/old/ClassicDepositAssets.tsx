import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import loadingCircle from 'animation/loading-circle.json'
import Alert from 'components/Alert'
import AssetInput from 'components/AssetInput'
import Button from 'components/Button'
import Dots from 'components/Dots'
import Typography from 'components/Typography'
import { attemptingTxnAtom, showReviewAtom, spendFromWalletSelector } from 'features/trident/context/atoms'
import { useIndependentAssetInputs } from 'features/trident/context/hooks/useIndependentAssetInputs'
import { classNames } from 'functions'
import { useBentoBoxContract, useTridentRouterContract } from 'hooks'
import Lottie from 'lottie-react'
import React, { FC } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import TridentApproveGate from '../../../TridentApproveGate'

const ClassicDepositAssets: FC = () => {
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
  const [spendFromWalletA, setSpendFromWalletA] = useRecoilState(
    spendFromWalletSelector(currencies[0]?.wrapped.address)
  )
  const [spendFromWalletB, setSpendFromWalletB] = useRecoilState(
    spendFromWalletSelector(currencies[1]?.wrapped.address)
  )
  const attemptingTxn = useRecoilValue(attemptingTxnAtom)

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col px-5 mt-6 gap-6">
          <Typography variant="h3" className="text-high-emphesis" weight={700}>
            {i18n._(t`Deposit Assets`)}
          </Typography>
          <Alert
            dismissable={false}
            message={i18n._(
              t`When creating a pair you are the first liquidity provider. The ratio of tokens you add will set the price of this pool. Once you are happy with the rate, click ‘Create Pool’.`
            )}
            type="information"
          />
        </div>
        <div className="flex flex-col gap-4 px-5">
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
    </>
  )
}

export default ClassicDepositAssets
