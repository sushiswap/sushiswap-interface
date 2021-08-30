import React, { FC, useCallback, useEffect, useMemo } from 'react'
import Typography from '../../../../components/Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import ListPanel from '../../../../components/ListPanel'
import PercentInput from '../../../../components/Input/Percent'
import Button from '../../../../components/Button'
import ToggleButtonGroup from '../../../../components/ToggleButton'
import { useUSDCValue } from '../../../../hooks/useUSDCPrice'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  currentLiquidityValueSelector,
  parsedInputAmountsSelector,
  percentageAmountAtom,
  permitAtom,
  poolAtom,
} from './context/atoms'
import { poolBalanceAtom, showReviewAtom } from '../../context/atoms'
import { PairState } from '../../../../hooks/useV2Pairs'
import { ChainId, Percent, ZERO } from '@sushiswap/sdk'
import { ApprovalState, useActiveWeb3React, useApproveCallback, useRouterContract } from '../../../../hooks'
import { useV2LiquidityTokenPermit } from '../../../../hooks/useERC20Permit'
import useTransactionDeadline from '../../../../hooks/useTransactionDeadline'

const ClassicUnzapMode: FC = () => {
  const { chainId, library, account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const deadline = useTransactionDeadline()
  const [poolState, pool] = useRecoilValue(poolAtom)
  const [percentageAmount, handlePercentageAmount] = useRecoilState(percentageAmountAtom)
  const [liquidityA, liquidityB] = useRecoilValue(currentLiquidityValueSelector)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const [parsedAmountA, parsedAmountB] = useRecoilValue(parsedInputAmountsSelector)
  const poolBalance = useRecoilValue(poolBalanceAtom)
  const usdcAValue = useUSDCValue(liquidityA)
  const usdcBValue = useUSDCValue(liquidityB)
  const setPermit = useSetRecoilState(permitAtom)
  const currentLiquidityValueInUsdc = usdcAValue?.add(usdcBValue)
  const selectedLiquidityValueInUsdc = currentLiquidityValueInUsdc?.multiply(new Percent(percentageAmount, '100'))
  const liquidityAmount = useMemo(
    () => poolBalance?.multiply(new Percent(percentageAmount, '100')),
    [percentageAmount, poolBalance]
  )

  // Allowance handling
  const router = useRouterContract()
  const [approval, approveCallback] = useApproveCallback(poolBalance, router?.address)
  const { gatherPermitSignature, signatureData } = useV2LiquidityTokenPermit(liquidityAmount?.wrapped, router?.address)

  // Set permit when we have signatureData
  useEffect(() => {
    setPermit(signatureData)
  }, [setPermit, signatureData])

  // Function that tries to either approve using a permit of using a callback if the permit fails
  const onAttemptToApprove = useCallback(async () => {
    if (!pool || !library || !deadline) throw new Error('missing dependencies')
    if (chainId !== ChainId.HARMONY && gatherPermitSignature) {
      try {
        await gatherPermitSignature()
      } catch (error) {
        if (error?.code !== 4001) await approveCallback()
      }
    } else {
      await approveCallback()
    }
  }, [approveCallback, chainId, deadline, gatherPermitSignature, library, pool])

  const error = !account
    ? i18n._(t`Connect Wallet`)
    : poolState === PairState.INVALID
    ? i18n._(t`Invalid pair`)
    : !parsedAmountA?.greaterThan(ZERO) || !parsedAmountB?.greaterThan(ZERO)
    ? i18n._(t`Enter an amount`)
    : ''

  const needsApprove = !(approval === ApprovalState.APPROVED || signatureData !== null)
  const buttonText = needsApprove
    ? i18n._(t`Approve`)
    : approval === ApprovalState.PENDING
    ? i18n._(t`Approving`)
    : error
    ? error
    : i18n._(t`Confirm Withdrawal`)

  return (
    <div className="px-5 mt-5">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 mt-4">
          <Typography variant="h3" weight={700} className="text-high-emphesis">
            Amount to Remove:
          </Typography>
          <ListPanel
            header={
              <ListPanel.Header
                title={i18n._(t`Balances`)}
                value={`$${currentLiquidityValueInUsdc ? currentLiquidityValueInUsdc.toSignificant(6) : '0.0000'}`}
                subValue={`${poolBalance ? poolBalance.toSignificant(6) : '0.0000'} SLP`}
              />
            }
            items={[
              <ListPanel.CurrencyAmountItem amount={liquidityA} key={0} />,
              <ListPanel.CurrencyAmountItem amount={liquidityB} key={1} />,
            ]}
            footer={
              <div className="flex justify-between items-center px-4 py-5 gap-3">
                <PercentInput
                  value={percentageAmount}
                  onUserInput={(value: string) => handlePercentageAmount(value)}
                  placeholder="0%"
                  className="bg-transparent text-3xl leading-7 tracking-[-0.01em] flex-grow after:content-['%']"
                />
                <Typography variant="sm" className="text-low-emphesis">
                  ≈$
                  {selectedLiquidityValueInUsdc?.greaterThan('0')
                    ? selectedLiquidityValueInUsdc?.toSignificant(6)
                    : '0.0000'}
                </Typography>
              </div>
            }
          />
          <ToggleButtonGroup
            value={percentageAmount}
            onChange={(value: string) => handlePercentageAmount(value)}
            variant="outlined"
          >
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
            <Button.Dotted
              pending={approval === ApprovalState.PENDING}
              color={needsApprove ? 'blue' : 'gradient'}
              disabled={!!error}
              onClick={needsApprove ? onAttemptToApprove : () => setShowReview(true)}
            >
              {buttonText}
            </Button.Dotted>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClassicUnzapMode
