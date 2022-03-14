import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Trade as LegacyTrade } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import Dots from 'app/components/Dots'
import { useDerivedTridentSwapContext } from 'app/features/trident/swap/DerivedTradeContext'
import { selectTridentSwap, setTridentSwapState } from 'app/features/trident/swap/swapSlice'
import { computeFiatValuePriceImpact, warningSeverity } from 'app/functions'
import { useBentoBoxContract, useRouterContract, useTridentRouterContract } from 'app/hooks'
import { useUSDCValue } from 'app/hooks/useUSDCPrice'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import { useExpertModeManager } from 'app/state/user/hooks'
import { TradeUnion } from 'app/types'
import React, { FC, useCallback, useMemo } from 'react'

import TridentApproveGate from '../TridentApproveGate'

interface SwapButton {
  onClick(x: TradeUnion): void
}

const SwapButton: FC<SwapButton> = ({ onClick }) => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const tridentSwapState = useAppSelector(selectTridentSwap)
  const { attemptingTxn } = tridentSwapState
  const { parsedAmounts, error, trade } = useDerivedTridentSwapContext()
  const router = useTridentRouterContract()
  const legacyRouterContract = useRouterContract()
  const bentoBox = useBentoBoxContract()
  const fiatValueInput = useUSDCValue(parsedAmounts?.[0])
  const fiatValueOutput = useUSDCValue(parsedAmounts?.[1])
  const priceImpact = computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput)
  const [isExpertMode] = useExpertModeManager()

  const priceImpactSeverity = useMemo(() => {
    const executionPriceImpact = trade?.priceImpact
    return warningSeverity(
      executionPriceImpact && priceImpact
        ? executionPriceImpact.greaterThan(priceImpact)
          ? executionPriceImpact
          : priceImpact
        : executionPriceImpact ?? priceImpact
    )
  }, [priceImpact, trade])

  const handleClick = useCallback(() => {
    if (trade) onClick(trade)
    dispatch(setTridentSwapState({ ...tridentSwapState, showReview: true }))
  }, [dispatch, onClick, trade, tridentSwapState])

  const isLegacy = trade instanceof LegacyTrade

  return (
    <TridentApproveGate
      inputAmounts={[parsedAmounts?.[0]]}
      tokenApproveOn={!isLegacy ? bentoBox?.address : legacyRouterContract?.address}
      masterContractAddress={!isLegacy ? router?.address : undefined}
    >
      {({ approved, loading }) => {
        const disabled = !!error || !approved || loading || attemptingTxn || priceImpactSeverity > 3
        const buttonText = attemptingTxn ? (
          <Dots>{i18n._(t`Swapping`)}</Dots>
        ) : loading ? (
          ''
        ) : error ? (
          error
        ) : priceImpactSeverity > 3 && !isExpertMode ? (
          i18n._(t`Price Impact Too High`)
        ) : priceImpactSeverity > 2 ? (
          i18n._(t`Swap Anyway`)
        ) : (
          i18n._(t`Swap`)
        )

        return (
          <div className="flex">
            <Button
              fullWidth
              id="swap-button"
              loading={loading}
              color={priceImpactSeverity > 2 && !error ? 'red' : 'gradient'}
              disabled={disabled}
              onClick={handleClick}
              className="rounded-2xl md:rounded"
            >
              {buttonText}
            </Button>
          </div>
        )
      }}
    </TridentApproveGate>
  )
}

export default SwapButton
