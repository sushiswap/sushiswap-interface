import { FC, useCallback, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { ChainId } from '@sushiswap/sdk'
import Button, { ButtonProps } from '../../components/Button'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import useInari from '../../hooks/useInari'

const InariButton: FC<ButtonProps> = ({ children, color, ...rest }) => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const wrongChain = ![ChainId.MAINNET].includes(chainId)
  const disabled = false

  const { allowance, approve } = useInari()

  const [pendingTx, setPendingTx] = useState(false)
  const [requestedApproval, setRequestedApproval] = useState(false)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await approve()

      // user rejected tx or didn't go through
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.log(e)
    }
  }, [approve, setRequestedApproval])

  if (!account)
    return (
      <Button disabled={disabled} color={disabled ? 'gray' : color} {...rest}>
        {i18n._(t`Connect Wallet`)}
      </Button>
    )

  if (wrongChain)
    return (
      <Button disabled={disabled} color={disabled ? 'gray' : color} {...rest}>
        {i18n._(t`Chain not supported yet`)}
      </Button>
    )

  return (
    <Button color={color} {...rest}>
      {children}
    </Button>
  )
}

export default InariButton
