import { FC } from 'react'
import { ApprovalState, useActiveWeb3React } from '../../hooks'
import { ChainId, ZERO } from '@sushiswap/sdk'
import Button, { ButtonProps } from '../../components/Button'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import useInari from '../../hooks/useInari'
import Dots from '../../components/Dots'
import { useDerivedInariState } from '../../state/inari/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'

const InariButton: FC<ButtonProps> = ({ children, ...rest }) => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const { zapInValue, strategy } = useDerivedInariState()
  const balance = useTokenBalance(account, strategy.inputToken)

  const wrongChain = ![ChainId.MAINNET].includes(chainId)

  const { approveCallback, inari } = useInari()

  if (!account)
    return (
      <Button {...rest} disabled color="gray">
        {i18n._(t`Connect Wallet`)}
      </Button>
    )

  if (wrongChain)
    return (
      <Button {...rest} disabled color="gray">
        {i18n._(t`Chain not supported yet`)}
      </Button>
    )

  if (!zapInValue || zapInValue.equalTo(ZERO))
    return (
      <Button {...rest} disabled color="gray">
        {i18n._(t`Enter an mount`)}
      </Button>
    )

  if (zapInValue.greaterThan(balance))
    return (
      <Button {...rest} disabled color="gray">
        {i18n._(t`Insufficient Balance`)}
      </Button>
    )

  // if (erc20Permit.state === UseERC20PermitState.NOT_SIGNED)
  //   return (
  //     <Button {...buttonProps} color="pink" onClick={erc20Permit.gatherPermitSignature}>
  //       {i18n._(t`Approve Inari`)}
  //     </Button>
  //   )

  // IF USING APPROVE CALLBACK -------------------------------------------------
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
  // ---------------------------------------------------------------------------

  return (
    <Button {...rest} onClick={inari}>
      {children}
    </Button>
  )
}

export default InariButton
