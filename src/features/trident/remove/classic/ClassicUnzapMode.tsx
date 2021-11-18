import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Percent } from '@sushiswap/core-sdk'
import loadingCircle from 'animation/loading-circle.json'
import AssetInput from 'components/AssetInput'
import AssetSelect from 'components/AssetSelect'
import Button from 'components/Button'
import Dots from 'components/Dots'
import PercentInput from 'components/Input/Percent'
import ListPanel from 'components/ListPanel'
import ToggleButtonGroup from 'components/ToggleButton'
import Typography from 'components/Typography'
import { useBentoBoxContract, useTridentRouterContract } from 'hooks'
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
import useZapPercentageInput from '../../context/hooks/useZapPercentageInput'
import SumUSDCValues from '../../SumUSDCValues'
import TridentApproveGate from '../../TridentApproveGate'

const ClassicUnzapMode: FC = () => {
  const { i18n } = useLingui()
  const { pool } = useRecoilValue(poolAtom)
  const router = useTridentRouterContract()
  const bentoBox = useBentoBoxContract()

  const {
    percentageInput: [percentageInput, setPercentageInput],
    parsedAmounts,
    zapCurrency: [zapCurrency, setZapCurrency],
    error,
  } = useZapPercentageInput()

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
    <div className="flex flex-col gap-8">
      <AssetSelect value={zapCurrency} onSelect={setZapCurrency} currencies={[pool?.token0, pool?.token1]} />
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-10 lg:mb-2">
          <Typography variant="h3" weight={700} className="text-high-emphesis">
            Amount to Remove:
          </Typography>
          <div className="flex-1 hidden lg:block">{toggleButtonGroup}</div>
        </div>
        <ListPanel
          header={<ListPanel.Header title={i18n._(t`Balances`)} value="$16,720.00" subValue="54.32134 SLP" />}
          items={[
            currentLiquidityValue.map((amount, index) => <ListPanel.CurrencyAmountItem amount={amount} key={index} />),
          ]}
          footer={
            <SumUSDCValues amounts={currentLiquidityValue}>
              {({ amount }) => (
                <div className="flex items-center justify-between gap-3 px-4 py-5">
                  <PercentInput
                    value={percentageInput}
                    onUserInput={setPercentageInput}
                    placeholder="0%"
                    className="bg-transparent text-3xl leading-7 tracking-[-0.01em] flex-grow after:content-['%']"
                  />
                  <Typography variant="sm" className="text-low-emphesis">
                    ≈${amount?.greaterThan('0') ? amount?.toSignificant(6) : '0.0000'}
                  </Typography>
                </div>
              )}
            </SumUSDCValues>
          }
        />
        <div className="block lg:hidden">{toggleButtonGroup}</div>
        <TridentApproveGate
          inputAmounts={[poolBalance?.multiply(new Percent(percentageInput, '100'))]}
          tokenApproveOn={bentoBox?.address}
          masterContractAddress={router?.address}
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
                <Typography variant="sm" weight={700} className={!error ? 'text-high-emphesis' : 'text-low-emphasis'}>
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
        {/*TODO ramin: */}
        <div className="flex flex-col gap-4">
          <ListPanel items={[<ListPanel.CurrencyAmountItem amount={parsedAmounts[0]} key={0} />]} />
        </div>
      </div>
    </div>
  )
}

export default ClassicUnzapMode
