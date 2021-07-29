import { FC, useCallback, useState } from 'react'
import { ApprovalState, useActiveWeb3React } from '../../hooks'
import { ZERO } from '@sushiswap/sdk'
import Button, { ButtonProps } from '../../components/Button'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import useInari from '../../hooks/useInari'
import Dots from '../../components/Dots'
import { useDerivedInariState, useSelectedInariStrategy } from '../../state/inari/hooks'
import { BentoApprovalState, BentoPermit } from '../../hooks/useBentoMasterApproveCallback'

interface InariButtonProps extends ButtonProps {}

const InariButton: FC<InariButtonProps> = ({ children, ...rest }) => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const { inputValue } = useDerivedInariState()
  const { balances, execute, bentoApproveCallback } = useSelectedInariStrategy()
  const { approveCallback } = useInari()
  const [permit, setPermit] = useState<BentoPermit>(null)

  // Get permit to send with execute
  const handleGetPermit = useCallback(async () => {
    const bentoPermit = await bentoApproveCallback.getPermit()
    setPermit(bentoPermit)
  }, [bentoApproveCallback])

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

  if (bentoApproveCallback && bentoApproveCallback.approvalState === BentoApprovalState.PENDING)
    return (
      <Button {...rest} disabled color="gray">
        <Dots>{i18n._(t`Approving Inari Master Contract`)}</Dots>
      </Button>
    )

  if (bentoApproveCallback && bentoApproveCallback.approvalState === BentoApprovalState.NOT_APPROVED)
    return (
      <Button {...rest} color="pink" onClick={handleGetPermit}>
        {i18n._(t`Approve Inari Master Contract`)}
      </Button>
    )

  if (approveCallback[0] === ApprovalState.PENDING)
    return (
      <Button {...rest} disabled color="gray">
        <Dots>{i18n._(t`Approving Inari to spend ${inputValue.currency.symbol}`)}</Dots>
      </Button>
    )

  if (approveCallback[0] === ApprovalState.NOT_APPROVED)
    return (
      <Button {...rest} color="pink" onClick={approveCallback[1]}>
        {i18n._(t`Approve Inari to spend ${inputValue.currency.symbol}`)}
      </Button>
    )

  return (
    <Button {...rest} onClick={() => execute(inputValue, permit)}>
      {children}
    </Button>
  )
}

export default InariButton
