import React, { FC } from 'react'
import Typography from '../../../../components/Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import ListPanel from '../../../../components/ListPanel'
import PercentInput from '../../../../components/Input/Percent'
import Button from '../../../../components/Button'
import ToggleButtonGroup from '../../../../components/ToggleButton'
import { useUSDCValue } from '../../../../hooks/useUSDCPrice'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { percentageAmountAtom, poolAtom } from './context/atoms'
import { currentLiquidityValueSelector, parsedAmountsSelector } from '../classic/context/atoms'
import { attemptingTxnAtom, poolBalanceAtom, showReviewAtom } from '../../context/atoms'
import { Percent, ZERO } from '../../../../../../sushiswap-sdk'
import Dots from '../../../../components/Dots'
import Lottie from 'lottie-react'
import loadingCircle from '../../../../animation/loading-circle.json'
import TridentApproveGate from '../../ApproveButton'
import { ConstantProductPoolState } from '../../../../hooks/useTridentClassicPools'
import { useActiveWeb3React, useTridentRouterContract } from '../../../../hooks'

const WeightedUnzapMode: FC = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const router = useTridentRouterContract()
  const [poolState] = useRecoilValue(poolAtom)
  const [liquidityA, liquidityB] = useRecoilValue(currentLiquidityValueSelector)
  const [percentageAmount, setPercentageAmount] = useRecoilState(percentageAmountAtom)
  const [parsedAmountA, parsedAmountB] = useRecoilValue(parsedAmountsSelector)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const usdcAValue = useUSDCValue(liquidityA)
  const usdcBValue = useUSDCValue(liquidityB)
  const attemptingTxn = useRecoilValue(attemptingTxnAtom)
  const poolBalance = useRecoilValue(poolBalanceAtom)
  const liquidityValueInUsdc = usdcAValue?.add(usdcBValue)

  // TODO ramin: typescript
  const error = !account
    ? i18n._(t`Connect Wallet`)
    : poolState === ConstantProductPoolState.INVALID
    ? i18n._(t`Invalid pair`)
    : !parsedAmountA?.greaterThan(ZERO) || !parsedAmountB?.greaterThan(ZERO)
    ? i18n._(t`Tap amount or type amount to continue`)
    : ''

  return (
    <div className="px-5 mt-5">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 mt-4">
          <Typography variant="h3" weight={700} className="text-high-emphesis">
            {i18n._(t`Amount to Remove:`)}
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
          <ToggleButtonGroup value={percentageAmount} onChange={setPercentageAmount} variant="outlined">
            <ToggleButtonGroup.Button value="100">Max</ToggleButtonGroup.Button>
            <ToggleButtonGroup.Button value="75">75%</ToggleButtonGroup.Button>
            <ToggleButtonGroup.Button value="50">50%</ToggleButtonGroup.Button>
            <ToggleButtonGroup.Button value="25">25%</ToggleButtonGroup.Button>
          </ToggleButtonGroup>
        </div>
        <div className="flex flex-col gap-5">
          <Typography variant="h3" weight={700} className="text-high-emphesis">
            {i18n._(t`Receive:`)}
          </Typography>
          <div className="flex flex-col gap-4">
            <ListPanel
              items={[
                <ListPanel.CurrencyAmountItem amount={parsedAmountA} key={0} />,
                <ListPanel.CurrencyAmountItem amount={parsedAmountB} key={1} />,
              ]}
            />
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
        </div>
      </div>
    </div>
  )
}

export default WeightedUnzapMode
