import { FC } from 'react'
import { ApprovalState, useActiveWeb3React } from '../../hooks'
import { ZERO } from '@sushiswap/sdk'
import Button, { ButtonProps } from '../../components/Button'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import useInari from '../../hooks/useInari'
import Dots from '../../components/Dots'
import { useDerivedInariState, useSelectedInariStrategy } from '../../state/inari/hooks'

interface InariButtonProps extends ButtonProps {}

const InariButton: FC<InariButtonProps> = ({ children, ...rest }) => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const { inputValue } = useDerivedInariState()
  const { balances, execute } = useSelectedInariStrategy()
  const { approveCallback } = useInari()

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

  if (inputValue && balances && balances.inputTokenBalance.lessThan(inputValue))
    return (
      <Button {...rest} disabled color="gray">
        {i18n._(t`Insufficient Balance`)}
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
    <Button {...rest} onClick={() => execute(inputValue)}>
      {children}
    </Button>
  )
}

export default InariButton
