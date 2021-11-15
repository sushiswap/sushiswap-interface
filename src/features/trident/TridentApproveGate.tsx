import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import { ApprovalState, useApproveCallback } from 'app/hooks/useApproveCallback'
import useBentoMasterApproveCallback, { BentoApprovalState, BentoPermit } from 'app/hooks/useBentoMasterApproveCallback'
import { useActiveWeb3React } from 'app/services/web3'
import { useWalletModalToggle } from 'app/state/application/hooks'
import React, { FC, memo, ReactNode, useCallback, useEffect, useState } from 'react'
import { atom, RecoilRoot, useSetRecoilState } from 'recoil'

export const TridentApproveGateBentoPermitAtom = atom<BentoPermit | undefined>({
  key: 'TridentApproveGateBentoPermit',
  default: undefined,
})

interface TokenApproveButtonProps {
  inputAmount: CurrencyAmount<Currency> | undefined
  onStateChange: React.Dispatch<React.SetStateAction<any>>
  tokenApproveOn: string | undefined
}

const TokenApproveButton: FC<TokenApproveButtonProps> = memo(({ inputAmount, onStateChange, tokenApproveOn }) => {
  const { i18n } = useLingui()
  const [approveState, approveCallback] = useApproveCallback(inputAmount?.wrapped, tokenApproveOn)

  useEffect(() => {
    if (!inputAmount?.currency.wrapped.address) return

    onStateChange((prevState) => ({
      ...prevState,
      [inputAmount.currency.wrapped.address]: approveState,
    }))
  }, [approveState, inputAmount?.currency.wrapped.address, onStateChange])

  if ([ApprovalState.NOT_APPROVED, ApprovalState.PENDING].includes(approveState)) {
    return (
      <Button.Dotted pending={approveState === ApprovalState.PENDING} color="blue" onClick={approveCallback}>
        {approveState === ApprovalState.PENDING
          ? i18n._(t`Approving ${inputAmount?.currency.symbol}`)
          : i18n._(t`Approve ${inputAmount?.currency.symbol}`)}
      </Button.Dotted>
    )
  }

  return <></>
})

interface TridentApproveGateProps {
  inputAmounts: (CurrencyAmount<Currency> | undefined)[]
  children: ({ approved, loading }: { approved: boolean; loading: boolean; permit?: BentoPermit }) => ReactNode
  tokenApproveOn?: string
  withPermit?: boolean
  masterContractAddress?: string
}

const TridentApproveGate: FC<TridentApproveGateProps> = ({
  inputAmounts,
  tokenApproveOn,
  children,
  withPermit = false,
  masterContractAddress,
}) => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const [status, setStatus] = useState<Record<string, ApprovalState>>({})
  const toggleWalletModal = useWalletModalToggle()
  const setBentoPermit = useSetRecoilState(TridentApproveGateBentoPermitAtom)

  const {
    approve: bApproveCallback,
    approvalState: bApprove,
    getPermit,
    permit,
  } = useBentoMasterApproveCallback(masterContractAddress ? masterContractAddress : undefined, {})

  const loading =
    Object.values(status).some((el) => el === ApprovalState.UNKNOWN) ||
    (masterContractAddress ? bApprove === BentoApprovalState.UNKNOWN : false)

  const approved =
    Object.values(status).every((el) => el === ApprovalState.APPROVED) &&
    (masterContractAddress ? bApprove === BentoApprovalState.APPROVED : true)

  const onClick = useCallback(async () => {
    if (withPermit) {
      const permit = await getPermit()
      if (permit) {
        setBentoPermit(permit)
      }
    } else {
      await bApproveCallback()
    }
  }, [bApproveCallback, getPermit, setBentoPermit, withPermit])

  return (
    <RecoilRoot>
      <div className="flex flex-col gap-3">
        {[BentoApprovalState.NOT_APPROVED, BentoApprovalState.PENDING].includes(bApprove) && (
          <Button.Dotted pending={bApprove === BentoApprovalState.PENDING} color="blue" onClick={onClick}>
            {bApprove === BentoApprovalState.PENDING
              ? i18n._(t`Approving BentoBox to spend tokens`)
              : i18n._(t`Approve BentoBox to spend tokens`)}
          </Button.Dotted>
        )}
        {inputAmounts.reduce<ReactNode[]>((acc, amount, index) => {
          if (!amount?.currency.isNative) {
            acc.push(
              <TokenApproveButton
                inputAmount={amount}
                key={index}
                onStateChange={setStatus}
                tokenApproveOn={tokenApproveOn}
              />
            )
          }
          return acc
        }, [])}
        {!account ? (
          <Button color="gradient" onClick={toggleWalletModal}>
            {i18n._(t`Connect Wallet`)}
          </Button>
        ) : (
          children({ approved, loading, permit })
        )}
      </div>
    </RecoilRoot>
  )
}

export default TridentApproveGate
