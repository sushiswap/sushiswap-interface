import React, { FC } from 'react'
import Typography from '../../../../components/Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import ListPanel from '../../../../components/ListPanel'
import PercentInput from '../../../../components/Input/Percent'
import Button from '../../../../components/Button'
import ToggleButtonGroup from '../../../../components/ToggleButton'
import AssetSelect from '../../../../components/AssetSelect'
import { useUSDCValue } from '../../../../hooks/useUSDCPrice'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  currentLiquidityValueSelector,
  selectedZapCurrencyAtom,
  percentageAmountAtom,
  parsedZapAmountSelector,
  poolAtom,
  outputToWalletAtom,
} from './context/atoms'
import { attemptingTxnAtom, poolBalanceAtom, showReviewAtom } from '../../context/atoms'
import { Percent } from '@sushiswap/sdk'
import Dots from '../../../../components/Dots'
import Lottie from 'lottie-react'
import loadingCircle from '../../../../animation/loading-circle.json'
import TridentApproveGate from '../../ApproveButton'
import { ConstantProductPoolState } from '../../../../hooks/useTridentClassicPools'
import { useActiveWeb3React, useTridentRouterContract } from '../../../../hooks'
import AssetInput from '../../../../components/AssetInput'

const ClassicUnzapMode: FC = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const router = useTridentRouterContract()
  const [poolState, pool] = useRecoilValue(poolAtom)
  const [percentageAmount, setPercentageAmount] = useRecoilState(percentageAmountAtom)
  const [liquidityA, liquidityB] = useRecoilValue(currentLiquidityValueSelector)
  const [selectedZapCurrency, setSelectedZapCurrency] = useRecoilState(selectedZapCurrencyAtom)
  const parsedZapAmount = useRecoilValue(parsedZapAmountSelector)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const usdcAValue = useUSDCValue(liquidityA)
  const usdcBValue = useUSDCValue(liquidityB)
  const attemptingTxn = useRecoilValue(attemptingTxnAtom)
  const liquidityValueInUsdc = usdcAValue?.add(usdcBValue)
  const poolBalance = useRecoilValue(poolBalanceAtom)
  const [outputToWallet, setOutputToWallet] = useRecoilState(outputToWalletAtom)

  // TODO ramin: typescript
  const error = !account
    ? i18n._(t`Connect Wallet`)
    : poolState === ConstantProductPoolState.INVALID
    ? i18n._(t`Invalid pair`)
    : !percentageAmount
    ? i18n._(t`Tap amount or type amount to continue`)
    : ''

  return (
    <div className="px-5 mt-5">
      <div className="flex flex-col gap-8">
        <AssetSelect
          value={selectedZapCurrency}
          onSelect={setSelectedZapCurrency}
          currencies={[pool?.token0, pool?.token1]}
        />
        <div className="flex flex-col gap-3">
          <Typography variant="h3" weight={700} className="text-high-emphesis">
            Amount to Remove:
          </Typography>
          <ListPanel
            header={<ListPanel.Header title={i18n._(t`Balances`)} value="$16,720.00" subValue="54.32134 SLP" />}
            items={[
              <ListPanel.CurrencyAmountItem amount={liquidityA} key={0} />,
              <ListPanel.CurrencyAmountItem amount={liquidityB} key={1} />,
            ]}
            footer={
              <div className="flex justify-between items-center px-4 py-5 gap-3">
                <PercentInput
                  value={percentageAmount}
                  onUserInput={(value: string) => setPercentageAmount(value)}
                  placeholder="0%"
                  className="bg-transparent text-3xl leading-7 tracking-[-0.01em] flex-grow after:content-['%']"
                />
                <Typography variant="sm" className="text-low-emphesis">
                  ≈${liquidityValueInUsdc?.greaterThan('0') ? liquidityValueInUsdc?.toSignificant(6) : '0.0000'}
                </Typography>
              </div>
            }
          />
          <ToggleButtonGroup
            value={percentageAmount}
            onChange={(value: string) => setPercentageAmount(value)}
            variant="outlined"
          >
            <ToggleButtonGroup.Button value="100">Max</ToggleButtonGroup.Button>
            <ToggleButtonGroup.Button value="75">75%</ToggleButtonGroup.Button>
            <ToggleButtonGroup.Button value="50">50%</ToggleButtonGroup.Button>
            <ToggleButtonGroup.Button value="25">25%</ToggleButtonGroup.Button>
          </ToggleButtonGroup>
          <TridentApproveGate
            inputAmounts={[poolBalance?.multiply(new Percent(percentageAmount, '100'))]}
            tokenApproveOn={router?.address}
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
        <div className="flex flex-col gap-5">
          <div className="flex justify-between gap-3">
            <Typography variant="h3" weight={700} className="text-high-emphesis">
              {i18n._(t`Receive:`)}
            </Typography>
            <AssetInput.WalletSwitch onChange={() => setOutputToWallet(!outputToWallet)} checked={outputToWallet} />
          </div>
          {/*TODO ramin: */}
          <div className="flex flex-col gap-4">
            <ListPanel items={[<ListPanel.CurrencyAmountItem amount={parsedZapAmount} key={0} />]} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClassicUnzapMode
