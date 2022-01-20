import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { BENTOBOX_ADDRESS } from '@sushiswap/core-sdk'
import { LimitOrder } from '@sushiswap/limit-order-sdk'
import Alert from 'app/components/Alert'
import Button, { ButtonProps } from 'app/components/Button'
import Dots from 'app/components/Dots'
import { ApprovalState, useApproveCallback } from 'app/hooks/useApproveCallback'
import useLimitOrderApproveCallback, { BentoApprovalState } from 'app/hooks/useLimitOrderApproveCallback'
import useLimitOrders from 'app/hooks/useLimitOrders'
import { useActiveWeb3React } from 'app/services/web3'
import { useAddPopup, useWalletModalToggle } from 'app/state/application/hooks'
import { useAppDispatch } from 'app/state/hooks'
import { clear, Field, setFromBentoBalance } from 'app/state/limit-order/actions'
import useLimitOrderDerivedCurrencies, {
  useLimitOrderDerivedInputError,
  useLimitOrderDerivedParsedAmounts,
  useLimitOrderState,
} from 'app/state/limit-order/hooks'
import { OrderExpiration } from 'app/state/limit-order/reducer'
import React, { FC, useCallback, useState } from 'react'

import ConfirmLimitOrderModal from './ConfirmLimitOrderModal'

interface LimitOrderButtonProps extends ButtonProps {}

const LimitOrderButton: FC<LimitOrderButtonProps> = ({ color, ...rest }) => {
  const { i18n } = useLingui()
  const { account, chainId, library } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const addPopup = useAddPopup()
  const toggleWalletModal = useWalletModalToggle()
  const { mutate } = useLimitOrders()
  const { inputCurrency: currency } = useLimitOrderDerivedCurrencies()
  const { fromBentoBalance, orderExpiration, recipient } = useLimitOrderState()
  const { [Field.INPUT]: parsedInputAmount, [Field.OUTPUT]: parsedOutputAmount } = useLimitOrderDerivedParsedAmounts()
  const inputError = useLimitOrderDerivedInputError()
  const [depositPending, setDepositPending] = useState(false)
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)
  const [approvalState, fallback, permit, onApprove, execute] = useLimitOrderApproveCallback()
  const [tokenApprovalState, tokenApprove] = useApproveCallback(parsedInputAmount, chainId && BENTOBOX_ADDRESS[chainId])

  const showLimitApprove =
    (approvalState === BentoApprovalState.NOT_APPROVED || approvalState === BentoApprovalState.PENDING) && !permit

  const showTokenApprove =
    !fromBentoBalance &&
    chainId &&
    currency &&
    !currency.isNative &&
    parsedInputAmount &&
    (tokenApprovalState === ApprovalState.NOT_APPROVED || tokenApprovalState === ApprovalState.PENDING)

  const disabled =
    !!inputError ||
    approvalState === BentoApprovalState.PENDING ||
    depositPending ||
    tokenApprovalState === ApprovalState.PENDING

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

    const order =
      account && parsedInputAmount && parsedOutputAmount
        ? new LimitOrder(
            account,
            parsedInputAmount.wrapped,
            parsedOutputAmount.wrapped,
            recipient ? recipient : account,
            Math.floor(new Date().getTime() / 1000).toString(),
            // @ts-ignore TYPE NEEDS FIXING
            endTime.toString()
          )
        : undefined

    try {
      // @ts-ignore TYPE NEEDS FIXING
      await order?.signOrderWithProvider(chainId || 1, library)
      setOpenConfirmationModal(false)

      const resp = await order?.send()
      if (resp.success) {
        addPopup({
          // @ts-ignore TYPE NEEDS FIXING
          txn: { hash: undefined, summary: 'Limit order created', success: true },
        })

        await mutate()

        dispatch(clear())
      }
    } catch (e) {
      addPopup({
        txn: {
          // @ts-ignore TYPE NEEDS FIXING
          hash: undefined,
          // @ts-ignore TYPE NEEDS FIXING
          summary: `Error: ${e?.response?.data?.data}`,
          success: false,
        },
      })
    }
  }, [
    account,
    addPopup,
    chainId,
    dispatch,
    library,
    mutate,
    orderExpiration.value,
    parsedInputAmount,
    parsedOutputAmount,
    recipient,
  ])

  const deposit = useCallback(async () => {
    // @ts-ignore TYPE NEEDS FIXING
    const tx = await execute(parsedInputAmount, currency)
    setDepositPending(true)
    await tx.wait()
    setDepositPending(false)
    dispatch(setFromBentoBalance(true))
  }, [currency, dispatch, execute, parsedInputAmount])

  let button = (
    <>
      <ConfirmLimitOrderModal
        open={openConfirmationModal}
        onConfirm={handler}
        onDismiss={() => setOpenConfirmationModal(false)}
      />
      <Button
        disabled={disabled}
        color={disabled ? 'gray' : 'blue'}
        onClick={() => setOpenConfirmationModal(true)}
        {...rest}
      >
        {i18n._(t`Review Limit Order`)}
      </Button>
    </>
  )

  if (depositPending)
    button = (
      <Button
        loading={depositPending}
        disabled={disabled}
        color={disabled ? 'gray' : color}
        onClick={deposit}
        {...rest}
      >
        {/*@ts-ignore TYPE NEEDS FIXING*/}
        <Dots>{i18n._(t`Depositing ${currency.symbol} into BentoBox`)}</Dots>
      </Button>
    )
  else if (!account)
    button = (
      <Button disabled={disabled} onClick={toggleWalletModal} {...rest}>
        {i18n._(t`Connect Wallet`)}
      </Button>
    )
  else if (inputError)
    button = (
      <Button disabled={true} {...rest}>
        {inputError}
      </Button>
    )
  else if (showTokenApprove)
    button = (
      <Button
        loading={tokenApprovalState === ApprovalState.PENDING}
        disabled={disabled}
        onClick={tokenApprove}
        color={disabled ? 'gray' : 'pink'}
        className="mb-4"
        {...rest}
      >
        {i18n._(t`Approve ${currency.symbol}`)}
      </Button>
    )
  else if (showLimitApprove)
    button = (
      <Button
        loading={approvalState === BentoApprovalState.PENDING}
        disabled={disabled}
        color={disabled ? 'gray' : 'pink'}
        // @ts-ignore TYPE NEEDS FIXING
        onClick={() => onApprove()}
        {...rest}
      >
        {i18n._(t`Approve Limit Order`)}
      </Button>
    )
  else if (
    (permit && !fromBentoBalance) ||
    (!permit && approvalState === BentoApprovalState.APPROVED && !fromBentoBalance)
  )
    button = (
      <Button disabled={disabled} color={disabled ? 'gray' : 'blue'} onClick={deposit} {...rest}>
        {/*@ts-ignore TYPE NEEDS FIXING*/}
        {i18n._(t`Deposit ${currency.symbol} into BentoBox`)}
      </Button>
    )

  return (
    <div className="flex flex-col flex-1">
      {fallback && (
        <Alert
          message={i18n._(
            t`Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click again and the fallback method will be used`
          )}
          className="flex flex-row w-full mb-4"
        />
      )}
      {button}
    </div>
  )
}

export default LimitOrderButton
