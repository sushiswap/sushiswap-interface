import { FC } from 'react'
import { ApprovalState, useActiveWeb3React } from '../../hooks'
import { CurrencyAmount, Token, ZERO } from '@sushiswap/sdk'
import Button, { ButtonProps } from '../../components/Button'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import useInari from '../../hooks/useInari'
import Dots from '../../components/Dots'
import { useDerivedInariState } from '../../state/inari/hooks'

interface InariButtonProps extends ButtonProps {
  balance: CurrencyAmount<Token>
}

const InariButton: FC<InariButtonProps> = ({ children, balance, ...rest }) => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const { zapInValue } = useDerivedInariState()
  const { approveCallback, inari } = useInari()

  if (!account)
    return (
      <Button {...rest} disabled color="gray">
        {i18n._(t`Connect Wallet`)}
      </Button>
    )

  if (!zapInValue || zapInValue.equalTo(ZERO))
    return (
      <Button {...rest} disabled color="gray">
        {i18n._(t`Enter an mount`)}
      </Button>
    )

  if (zapInValue && balance && balance.lessThan(zapInValue))
    return (
      <Button {...rest} disabled color="gray">
        {i18n._(t`Insufficient Balance`)}
      </Button>
    )

  if (approveCallback[0] === ApprovalState.PENDING)
    return (
      <Button {...rest} disabled color="gray">
        <Dots>{i18n._(t`Approving Inari`)}</Dots>
      </Button>
    )

  if (approveCallback[0] === ApprovalState.NOT_APPROVED)
    return (
      <Button {...rest} color="pink" onClick={approveCallback[1]}>
        {i18n._(t`Approve Inari`)}
      </Button>
    )

  return (
    <Button {...rest} onClick={inari}>
      {children}
    </Button>
  )
}

export default InariButton
