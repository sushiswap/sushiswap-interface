import { useLingui } from '@lingui/react'
import Alert from '../../components/Alert'
import { t } from '@lingui/macro'
import Button, { ButtonProps } from '../../components/Button'
import React, { FC, useCallback, useState } from 'react'
import useLimitOrderApproveCallback, { BentoApprovalState } from '../../hooks/useLimitOrderApproveCallback'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { ApprovalState, useApproveCallback } from '../../hooks'
import { BENTOBOX_ADDRESS } from '../../constants/kashi'
import { ChainId, Currency } from '@sushiswap/sdk'
import Dots from '../../components/Dots'
import { useAddPopup, useWalletModalToggle } from '../../state/application/hooks'
import { useDerivedLimitOrderInfo, useLimitOrderState } from '../../state/limit-order/hooks'
import { Field, setFromBentoBalance } from '../../state/limit-order/actions'
import ConfirmLimitOrderModal from './ConfirmLimitOrderModal'
import { OrderExpiration } from '../../state/limit-order/reducer'
import { LimitOrder } from 'limitorderv2-sdk'
import useLimitOrders from '../../hooks/useLimitOrders'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../state'

interface LimitOrderButtonProps extends ButtonProps {
  currency: Currency
}

const LimitOrderButton: FC<LimitOrderButtonProps> = ({ currency, color, ...rest }) => {
  const { i18n } = useLingui()
  const { fromBentoBalance, orderExpiration, recipient } = useLimitOrderState()
  const { parsedAmounts, inputError } = useDerivedLimitOrderInfo()
  const [depositPending, setDepositPending] = useState(false)
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)
  const { mutate } = useLimitOrders()
  const addPopup = useAddPopup()
  const { account, chainId, library } = useActiveWeb3React()
  const [approvalState, fallback, permit, onApprove, execute] = useLimitOrderApproveCallback()
  const toggleWalletModal = useWalletModalToggle()
  const wrongChain = ![ChainId.MATIC].includes(chainId)
  const disabled = wrongChain || !!inputError || approvalState === BentoApprovalState.PENDING || depositPending
  const dispatch = useDispatch<AppDispatch>()

  const [tokenApprovalState, tokenApprove] = useApproveCallback(
    parsedAmounts[Field.INPUT],
    chainId && BENTOBOX_ADDRESS[chainId]
  )

  const showLimitApprove =
    (approvalState === BentoApprovalState.NOT_APPROVED || approvalState === BentoApprovalState.PENDING) && !permit

  const showTokenApprove =
    chainId &&
    currency &&
    !currency.isNative &&
    parsedAmounts[Field.INPUT] &&
    (tokenApprovalState === ApprovalState.NOT_APPROVED || tokenApprovalState === ApprovalState.PENDING)

  const handler = useCallback(async () => {
    let endTime
    switch (orderExpiration.value) {
      case OrderExpiration.hour:
        endTime = Math.floor(new Date().getTime() / 1000) + 3600
        break
      case OrderExpiration.day:
        endTime = Math.floor(new Date().getTime() / 1000) + 86400
        break
      case OrderExpiration.week:
        endTime = Math.floor(new Date().getTime() / 1000) + 604800
        break
      case OrderExpiration.never:
        endTime = Number.MAX_SAFE_INTEGER
    }

    const order = new LimitOrder(
      account,
      parsedAmounts[Field.INPUT].wrapped,
      parsedAmounts[Field.OUTPUT].wrapped,
      recipient ? recipient : account,
      0,
      endTime.toString()
    )

    try {
      await order.signOrderWithProvider(chainId, library)
      setOpenConfirmationModal(false)

      const resp = await order.send()
      if (resp.success) {
        addPopup({
          txn: { hash: null, summary: 'Limit order created', success: true },
        })
        await mutate()
      }
    } catch (e) {
      addPopup({
        txn: {
          hash: null,
          summary: `Error: ${e?.response?.data?.data}`,
          success: false,
        },
      })
    }
  }, [account, addPopup, chainId, library, mutate, orderExpiration.value, parsedAmounts, recipient])

  const deposit = useCallback(async () => {
    const tx = await execute(currency)
    setDepositPending(true)
    await tx.wait()
    setDepositPending(false)
    dispatch(setFromBentoBalance(true))
  }, [currency, dispatch, execute])

  let button = (
    <>
      <ConfirmLimitOrderModal
        open={openConfirmationModal}
        onConfirm={() => handler()}
        onDismiss={() => setOpenConfirmationModal(false)}
      />
      <Button
        disabled={disabled}
        color={disabled ? 'gray' : color}
        onClick={() => setOpenConfirmationModal(true)}
        {...rest}
      >
        {i18n._(t`Review Limit Order`)}
      </Button>
    </>
  )

  if (!account)
    button = (
      <Button disabled={disabled} color={disabled ? 'gray' : color} onClick={toggleWalletModal} {...rest}>
        {i18n._(t`Connect Wallet`)}
      </Button>
    )
  else if (wrongChain)
    button = (
      <Button disabled={disabled} color={disabled ? 'gray' : color} onClick={toggleWalletModal} {...rest}>
        {i18n._(t`Chain not supported yet`)}
      </Button>
    )
  else if (inputError)
    button = (
      <Button color={'gray'} disabled={true} {...rest}>
        {inputError}
      </Button>
    )
  else if (showTokenApprove)
    button = (
      <Button onClick={tokenApprove} color={disabled ? 'gray' : color} className="mb-4" {...rest}>
        {tokenApprovalState === ApprovalState.PENDING ? (
          <Dots>{i18n._(t`Approving ${currency.symbol}`)}</Dots>
        ) : (
          i18n._(t`Approve ${currency.symbol}`)
        )}
      </Button>
    )
  else if (showLimitApprove)
    button = (
      <Button disabled={disabled} color={disabled ? 'gray' : color} onClick={onApprove} {...rest}>
        {approvalState === BentoApprovalState.PENDING ? (
          <Dots>{i18n._(t`Approving Limit Order`)}</Dots>
        ) : (
          i18n._(t`Approve Limit Order`)
        )}
      </Button>
    )
  else if (depositPending)
    button = (
      <Button disabled={disabled} color={disabled ? 'gray' : color} onClick={deposit} {...rest}>
        <Dots>{i18n._(t`Depositing ${currency.symbol} into BentoBox`)}</Dots>
      </Button>
    )
  else if (
    (permit && !fromBentoBalance) ||
    (!permit && approvalState === BentoApprovalState.APPROVED && !fromBentoBalance)
  )
    button = (
      <Button disabled={disabled} color={disabled ? 'gray' : color} onClick={deposit} {...rest}>
        {i18n._(t`Deposit ${currency.symbol} into BentoBox`)}
      </Button>
    )

  return (
    <div className="flex flex-1 flex-col">
      {fallback && (
        <Alert
          message={i18n._(
            t`Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click again and the fallback method will be used`
          )}
          className="mb-4 flex flex-row w-full"
        />
      )}
      {button}
    </div>
  )
}

export default LimitOrderButton
