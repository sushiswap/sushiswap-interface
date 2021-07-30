import React, { FC, useCallback, useState } from 'react'
import { ApprovalState, useActiveWeb3React } from '../../hooks'
import { ZERO } from '@sushiswap/sdk'
import Button, { ButtonProps } from '../../components/Button'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import Dots from '../../components/Dots'
import { useDerivedInariState, useSelectedInariStrategy } from '../../state/inari/hooks'
import { BentoApprovalState, BentoPermit } from '../../hooks/useBentoMasterApproveCallback'
import ProgressSteps from '../../components/ProgressSteps'

interface InariButtonProps extends ButtonProps {}

const InariButton: FC<InariButtonProps> = ({ children, ...rest }) => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const { inputValue, usesBentoBox } = useDerivedInariState()
  const { balances, execute, bentoApproveCallback, approveCallback } = useSelectedInariStrategy()
  const [permit, setPermit] = useState<BentoPermit>(null)
  const [pending, setPending] = useState(false)

  const onExecute = useCallback(async () => {
    const tx = await execute(inputValue, permit)
    setPending(true)
    await tx?.wait()
    setPending(false)
  }, [execute, inputValue, permit])

  // Get permit to send with execute
  const handleGetPermit = useCallback(async () => {
    const bentoPermit = await bentoApproveCallback.getPermit()
    setPermit(bentoPermit)
  }, [bentoApproveCallback])

  // Approve flow
  // Add token approve to approve flow
  const steps = [approveCallback[0] === ApprovalState.APPROVED]

  // Only add bentoApprove flow if not yet approved to avoid a weird looking approveFlow
  // when switching strategies after a bentoApproval
  if (usesBentoBox && bentoApproveCallback.approvalState !== BentoApprovalState.APPROVED) steps.push(false)

  const approveFlow = (
    <div className="flex flex-col">
      <ProgressSteps steps={steps} />
    </div>
  )

  if (!account)
    return (
      <Button {...rest} disabled color="gray">
        {i18n._(t`Connect Wallet`)}
      </Button>
    )

  if (!inputValue || inputValue.equalTo(ZERO))
    return (
      <Button {...rest} disabled color="gray">
        {i18n._(t`Enter an mount`)}
      </Button>
    )

  if (inputValue && balances && balances.inputTokenBalance && balances.inputTokenBalance.lessThan(inputValue))
    return (
      <Button {...rest} disabled color="gray">
        {i18n._(t`Insufficient Balance`)}
      </Button>
    )

  if (approveCallback[0] === ApprovalState.PENDING)
    return (
      <>
        <Button {...rest} disabled color="gray">
          <Dots>{i18n._(t`Approving Inari to spend ${inputValue.currency.symbol}`)}</Dots>
        </Button>
        {approveFlow}
      </>
    )

  if (approveCallback[0] === ApprovalState.NOT_APPROVED)
    return (
      <>
        <Button {...rest} color="pink" onClick={approveCallback[1]}>
          {i18n._(t`Approve Inari to spend ${inputValue.currency.symbol}`)}
        </Button>
        {approveFlow}
      </>
    )

  if (bentoApproveCallback && bentoApproveCallback.approvalState === BentoApprovalState.PENDING)
    return (
      <>
        <Button {...rest} disabled color="gray">
          <Dots>{i18n._(t`Approving Inari Master Contract`)}</Dots>
        </Button>
        {approveFlow}
      </>
    )

  if (bentoApproveCallback && bentoApproveCallback.approvalState === BentoApprovalState.NOT_APPROVED)
    return (
      <>
        <Button {...rest} color="pink" onClick={handleGetPermit}>
          {i18n._(t`Approve Inari Master Contract`)}
        </Button>
        {approveFlow}
      </>
    )

  return (
    <Button {...rest} disabled={pending} color={pending ? 'gray' : 'gradient'} onClick={onExecute}>
      {pending ? <Dots>{i18n._(t`Pending transaction`)}</Dots> : children}
    </Button>
  )
}

export default InariButton
