import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Percent } from '@sushiswap/core-sdk'
import loadingCircle from 'animation/loading-circle.json'
import useRemovePercentageInput from 'app/features/trident/context/hooks/useRemovePercentageInput'
import { classNames } from 'app/functions'
import AssetInput from 'components/AssetInput'
import AssetSelect from 'components/AssetSelect'
import Button from 'components/Button'
import Dots from 'components/Dots'
import PercentInput from 'components/Input/Percent'
import ListPanel from 'components/ListPanel'
import ToggleButtonGroup from 'components/ToggleButton'
import Typography from 'components/Typography'
import { useTridentRouterContract } from 'hooks'
import Lottie from 'lottie-react'
import React, { FC } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import {
  attemptingTxnAtom,
  currentLiquidityValueSelector,
  outputToWalletAtom,
  poolAtom,
  poolBalanceAtom,
  showReviewAtom,
} from '../../context/atoms'
import SumUSDCValues from '../../SumUSDCValues'
import TridentApproveGate from '../../TridentApproveGate'

const ClassicSingleMode: FC = () => {
  const { i18n } = useLingui()
  const { pool } = useRecoilValue(poolAtom)
  const router = useTridentRouterContract()

  const {
    percentageInput: [percentageInput, setPercentageInput],
    parsedAmountSingleToken,
    zapCurrency: [zapCurrency, setZapCurrency],
    error,
  } = useRemovePercentageInput()

  const currentLiquidityValue = useRecoilValue(currentLiquidityValueSelector)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const attemptingTxn = useRecoilValue(attemptingTxnAtom)
  const poolBalance = useRecoilValue(poolBalanceAtom)
  const [outputToWallet, setOutputToWallet] = useRecoilState(outputToWalletAtom)

  const toggleButtonGroup = (
    <ToggleButtonGroup value={percentageInput} onChange={setPercentageInput} variant="outlined">
      <ToggleButtonGroup.Button value="100">Max</ToggleButtonGroup.Button>
      <ToggleButtonGroup.Button value="75">75%</ToggleButtonGroup.Button>
      <ToggleButtonGroup.Button value="50">50%</ToggleButtonGroup.Button>
      <ToggleButtonGroup.Button value="25">25%</ToggleButtonGroup.Button>
    </ToggleButtonGroup>
  )

  return (
    <SumUSDCValues amounts={currentLiquidityValue}>
      {({ amount }) => {
        const selectedLiquidityValueInUsdc = amount?.multiply(new Percent(percentageInput, '100'))
        return (
          <div className="flex flex-col gap-8">
            <AssetSelect value={zapCurrency} onSelect={setZapCurrency} currencies={[pool?.token0, pool?.token1]} />
            <div className={classNames(zapCurrency ? '' : 'pointer-events-none opacity-50', 'flex flex-col gap-3')}>
              <div className="flex items-center justify-between gap-10 lg:mb-2">
                <Typography variant="h3" weight={700} className="text-high-emphesis">
                  {i18n._(t`Amount to Remove:`)}
                </Typography>
                <div className="flex-1 hidden lg:block">{toggleButtonGroup}</div>
              </div>
              <ListPanel
                header={
                  <ListPanel.Header
                    title={i18n._(t`Balances`)}
                    value={`$${amount ? amount.toSignificant(6) : '0.0000'}`}
                    subValue={`${poolBalance ? poolBalance.toSignificant(6) : '0.0000'} SLP`}
                  />
                }
                items={[
                  currentLiquidityValue.map((amount, index) => (
                    <ListPanel.CurrencyAmountItem amount={amount} key={index} />
                  )),
                ]}
                footer={
                  <div className="flex justify-between items-center px-4 py-5 gap-3">
                    <PercentInput
                      value={percentageInput}
                      onUserInput={setPercentageInput}
                      placeholder="0%"
                      className="bg-transparent text-3xl leading-7 tracking-[-0.01em] flex-grow font-bold text-high-emphesis"
                    />
                    <Typography variant="sm" className="text-low-emphesis" weight={700}>
                      ≈$
                      {selectedLiquidityValueInUsdc?.greaterThan('0')
                        ? selectedLiquidityValueInUsdc?.toSignificant(6)
                        : '0.0000'}
                    </Typography>
                  </div>
                }
              />
              <div className="block lg:hidden">{toggleButtonGroup}</div>
              <TridentApproveGate
                inputAmounts={[poolBalance?.multiply(new Percent(percentageInput, '100'))]}
                tokenApproveOn={router?.address}
                withPermit={true}
              >
                {({ approved, loading }) => {
                  const disabled = !!error || !approved || loading || attemptingTxn
                  const buttonText = attemptingTxn ? (
                    <Dots>{i18n._(t`Withdrawing`)}</Dots>
                  ) : loading ? (
                    ''
                  ) : error ? (
                    error
                  ) : (
                    i18n._(t`Confirm Withdrawal`)
                  )

                  return (
                    <Button
                      size="lg"
                      {...(loading && {
                        startIcon: (
                          <div className="w-4 h-4 mr-1">
                            <Lottie animationData={loadingCircle} autoplay loop />
                          </div>
                        ),
                      })}
                      color={approved ? 'gradient' : 'blue'}
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
                  )
                }}
              </TridentApproveGate>
            </div>
            <div className="flex flex-col block gap-5 lg:hidden">
              <div className="flex justify-between gap-3">
                <Typography variant="h3" weight={700} className="text-high-emphesis">
                  {i18n._(t`Receive:`)}
                </Typography>
                <AssetInput.WalletSwitch onChange={() => setOutputToWallet(!outputToWallet)} checked={outputToWallet} />
              </div>
              <div className="flex flex-col gap-4">
                <ListPanel items={[<ListPanel.CurrencyAmountItem amount={parsedAmountSingleToken} key={0} />]} />
              </div>
            </div>
          </div>
        )
      }}
    </SumUSDCValues>
  )
}

export default ClassicSingleMode
