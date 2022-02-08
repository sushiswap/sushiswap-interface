import { HeadlessUiModal } from 'app/components/Modal'
import ActionView from 'app/features/portfolio/ActionsModal/ActionView'
import DepositView from 'app/features/portfolio/ActionsModal/DepositView'
import WithdrawView from 'app/features/portfolio/ActionsModal/WithdrawView'
import {
  selectTridentBalances,
  setBalancesActiveModal,
  setBalancesModalOpen,
  setBalancesState,
} from 'app/features/portfolio/portfolioSlice'
import { ActiveModal } from 'app/features/trident/types'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import React, { FC, useCallback } from 'react'

const ActionsModal: FC = () => {
  const dispatch = useAppDispatch()
  const { activeModal, modalOpen } = useAppSelector(selectTridentBalances)

  const handleDismiss = useCallback(() => {
    setBalancesState({
      activeModal: undefined,
      currency: undefined,
    })
  }, [])

  return (
    <HeadlessUiModal.Controlled
      isOpen={modalOpen}
      onDismiss={() => dispatch(setBalancesModalOpen(false))}
      afterLeave={handleDismiss}
      maxWidth="md"
    >
      {activeModal === ActiveModal.DEPOSIT ? (
        <DepositView
          onBack={() => dispatch(setBalancesActiveModal(ActiveModal.MENU))}
          onClose={() => dispatch(setBalancesActiveModal(undefined))}
        />
      ) : activeModal === ActiveModal.WITHDRAW ? (
        <WithdrawView
          onBack={() => dispatch(setBalancesActiveModal(ActiveModal.MENU))}
          onClose={() => dispatch(setBalancesActiveModal(undefined))}
        />
      ) : (
        <ActionView onClose={() => dispatch(setBalancesActiveModal(undefined))} />
      )}
    </HeadlessUiModal.Controlled>
  )
}

export default ActionsModal
