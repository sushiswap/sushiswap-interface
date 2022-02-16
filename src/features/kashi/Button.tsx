import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { BENTOBOX_ADDRESS, WNATIVE_ADDRESS } from '@sushiswap/core-sdk'
import Alert from 'app/components/Alert'
import Button from 'app/components/Button'
import Dots from 'app/components/Dots'
import { tryParseAmount } from 'app/functions/parse'
import { ApprovalState, useApproveCallback } from 'app/hooks/useApproveCallback'
import useKashiApproveCallback, { BentoApprovalState } from 'app/hooks/useKashiApproveCallback'
import { useActiveWeb3React } from 'app/services/web3'
import React from 'react'

export function KashiApproveButton({ content, color }: any): any {
  const { i18n } = useLingui()
  const [kashiApprovalState, approveKashiFallback, kashiPermit, onApprove, onCook] = useKashiApproveCallback()
  const showApprove =
    (kashiApprovalState === BentoApprovalState.NOT_APPROVED || kashiApprovalState === BentoApprovalState.PENDING) &&
    !kashiPermit
  const showChildren = kashiApprovalState === BentoApprovalState.APPROVED || kashiPermit

  return (
    <>
      {approveKashiFallback && (
        <Alert
          message={i18n._(
            t`Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click again and the fallback method will be used`
          )}
          className="mb-4"
        />
      )}

      {showApprove && (
        <Button color={color} onClick={onApprove} className="mb-4" fullWidth={true}>
          {i18n._(t`Approve Kashi`)}
        </Button>
      )}

      {showChildren && React.cloneElement(content(onCook), { color })}
    </>
  )
}

export function TokenApproveButton({ children, value, token, needed, color }: any): any {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const [approvalState, approve] = useApproveCallback(
    tryParseAmount(value, token),
    chainId ? BENTOBOX_ADDRESS[chainId] : undefined
  )

  const showApprove =
    chainId &&
    token &&
    token.address !== WNATIVE_ADDRESS[chainId] &&
    needed &&
    value &&
    (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING)

  return showApprove ? (
    <Button color={color} onClick={approve} className="mb-4" fullWidth={true}>
      {approvalState === ApprovalState.PENDING ? (
        <Dots>{`Approving ${token.symbol}`}</Dots>
      ) : (
        <>
          {i18n._(t`Approve`)} {token.symbol}
        </>
      )}
    </Button>
  ) : (
    React.cloneElement(children, { color })
  )
}
