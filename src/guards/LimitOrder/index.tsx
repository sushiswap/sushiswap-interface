import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { STOP_LIMIT_ORDER_ADDRESS } from '@sushiswap/limit-order-sdk'
import Button from 'app/components/Button'
import HeadlessUIModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import useLimitOrders from 'app/features/legacy/limit-order/useLimitOrders'
import useBentoMasterApproveCallback, { BentoApprovalState } from 'app/hooks/useBentoMasterApproveCallback'
import { useActiveWeb3React } from 'app/services/web3'
import { useBentoMasterContractAllowed } from 'app/state/bentobox/hooks'
// @ts-ignore
import cookie from 'cookie-cutter'
import React, { FC, useState } from 'react'

const Component: FC = ({ children }) => {
  const { i18n } = useLingui()
  const { chainId, account } = useActiveWeb3React()
  const { pending } = useLimitOrders()
  const masterContract = chainId && STOP_LIMIT_ORDER_ADDRESS[chainId]
  const allowed = useBentoMasterContractAllowed(masterContract, account ?? undefined)
  const { approve, approvalState } = useBentoMasterApproveCallback(masterContract, {})
  const [dismissed, setDismissed] = useState<boolean>()

  const isOpen =
    pending.totalOrders > 0 &&
    typeof allowed !== 'undefined' &&
    !allowed &&
    !cookie.get('disableLimitOrderGuard') &&
    typeof dismissed !== 'undefined' &&
    !dismissed

  return (
    <>
      <HeadlessUIModal.Controlled
        isOpen={false} // TODO ramin: enable when master contract is approved on bentobox
        onDismiss={() => setDismissed(false)}
        maxWidth="sm"
      >
        <HeadlessUIModal.Controlled isOpen={true} onDismiss={() => setDismissed(false)}>
          <div className="flex flex-col gap-4">
            <HeadlessUIModal.Header header={i18n._(t`Approve Master Contract`)} onClose={() => setDismissed(false)} />
            <HeadlessUIModal.BorderedContent className="bg-dark-1000/40">
              <Typography variant="sm">
                {i18n._(t`It seems like you have open orders while the limit order master contract is not approved. Please make
          sure you approved the limit order master contract or the order will not execute`)}
              </Typography>
            </HeadlessUIModal.BorderedContent>
            <div className="flex justify-end gap-6">
              <Button color="blue" size="sm" variant="empty" onClick={() => cookie.set('disableLimitOrderGuard', true)}>
                {i18n._(t`Do not show again`)}
              </Button>
              <Button loading={approvalState === BentoApprovalState.PENDING} color="blue" size="sm" onClick={approve}>
                {i18n._(t`Approve`)}
              </Button>
            </div>
          </div>
        </HeadlessUIModal.Controlled>
      </HeadlessUIModal.Controlled>
      {children}
    </>
  )
}

const LimitOrderGuard: FC = ({ children }) => <Component>{children}</Component>
export default LimitOrderGuard
