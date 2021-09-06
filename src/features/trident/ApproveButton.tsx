import React, { FC, memo, ReactNode, useMemo } from 'react'
import Button from '../../components/Button'
import { ApprovalState, useApproveCallback, useBentoBoxContract, useTridentRouterContract } from '../../hooks'
import useBentoMasterApproveCallback, { BentoApprovalState } from '../../hooks/useBentoMasterApproveCallback'
import { t } from '@lingui/macro'
import { Currency, CurrencyAmount } from '@sushiswap/sdk'
import { useLingui } from '@lingui/react'

interface TokenApproveGateProps extends TridentApproveGateProps {
  status: boolean[]
  loading: boolean[]
}

const TokenApproveGate: FC<TokenApproveGateProps> = memo(
  ({ inputAmounts: inputAmountsProp = [], children, status, loading }) => {
    const { i18n } = useLingui()

    // Uses recursion, pops one element off of array and sends array to child minus this element
    const inputAmounts = useMemo(() => [...inputAmountsProp], [inputAmountsProp])
    const inputAmount = inputAmounts.length > 0 ? inputAmounts.pop() : undefined
    const bentoBox = useBentoBoxContract()
    const [approveState, approveCallback] = useApproveCallback(inputAmount?.wrapped, bentoBox?.address)

    // If our array is empty, we are at leafNode
    if (inputAmountsProp.length === 0) {
      return (
        <>{children({ approved: status.every((el) => el === true), loading: loading.some((el) => el === true) })}</>
      )
    }

    // We are not yet in a leafNode so render approve button for this inputAmount
    // and use recursion for remaining inputAmounts
    let approveButton
    if ([ApprovalState.NOT_APPROVED, ApprovalState.PENDING].includes(approveState))
      approveButton = (
        <Button.Dotted pending={approveState === ApprovalState.PENDING} color="blue" onClick={approveCallback}>
          {approveState === ApprovalState.PENDING
            ? i18n._(t`Approving ${inputAmount?.currency.symbol}`)
            : i18n._(t`Approve ${inputAmount?.currency.symbol}`)}
        </Button.Dotted>
      )

    return (
      <>
        {approveButton}
        <TokenApproveGate
          inputAmounts={inputAmounts}
          status={[...status, approveState === ApprovalState.APPROVED]}
          loading={[...loading, inputAmount && approveState === ApprovalState.UNKNOWN]}
        >
          {children}
        </TokenApproveGate>
      </>
    )
  }
)

interface TridentApproveGateProps {
  inputAmounts: CurrencyAmount<Currency>[]
  children: ({ approved, loading }: { approved: boolean; loading: boolean }) => ReactNode
}

const TridentApproveGate: FC<TridentApproveGateProps> = ({ inputAmounts, children }) => {
  const { i18n } = useLingui()
  const router = useTridentRouterContract()
  const { approve: bApproveCallback, approvalState: bApprove } = useBentoMasterApproveCallback(router?.address, {})

  return (
    <div className="flex flex-col gap-3">
      {[BentoApprovalState.NOT_APPROVED, BentoApprovalState.PENDING].includes(bApprove) && (
        <Button.Dotted pending={bApprove === BentoApprovalState.PENDING} color="blue" onClick={bApproveCallback}>
          {bApprove === BentoApprovalState.PENDING
            ? i18n._(t`Approving BentoBox to spend tokens`)
            : i18n._(t`Approve BentoBox to spend tokens`)}
        </Button.Dotted>
      )}
      <TokenApproveGate
        inputAmounts={inputAmounts}
        status={[bApprove === BentoApprovalState.APPROVED]}
        loading={[bApprove === BentoApprovalState.UNKNOWN]}
      >
        {children}
      </TokenApproveGate>
    </div>
  )
}

export default TridentApproveGate
