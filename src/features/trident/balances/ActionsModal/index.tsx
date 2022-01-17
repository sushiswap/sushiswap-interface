import { XIcon } from '@heroicons/react/solid'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import BottomSlideIn from 'app/components/Dialog/BottomSlideIn'
import Typography from 'app/components/Typography'
import { selectTridentBalances, setBalancesActiveModal } from 'app/features/trident/balances/balancesSlice'
import BentoActions from 'app/features/trident/balances/BentoActions'
import DepositToBentoBoxModal from 'app/features/trident/balances/DepositToBentoBoxModal'
import { useBalancesSelectedCurrency } from 'app/features/trident/balances/useBalancesDerivedState'
import WalletActions from 'app/features/trident/balances/WalletActions'
import WithdrawToWalletModal from 'app/features/trident/balances/WithdrawToWalletModal'
import { ActiveModal } from 'app/features/trident/types'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import React, { FC } from 'react'

const _ActionsModal: FC = ({ children }) => {
  const isDesktop = useDesktopMediaQuery()
  const dispatch = useAppDispatch()
  const currency = useBalancesSelectedCurrency()
  const { activeModal } = useAppSelector(selectTridentBalances)

  if (isDesktop) return <></>

  return (
    <BottomSlideIn open={activeModal === ActiveModal.MENU} onClose={() => dispatch(setBalancesActiveModal(undefined))}>
      <div className="flex justify-between bg-dark-800 p-5">
        <div className="flex gap-4 items-center">
          <CurrencyLogo currency={currency} size={42} className="!rounded-full" />
          <Typography variant="h3" className="text-high-emphesis" weight={700}>
            {currency?.symbol}
          </Typography>
        </div>
        <div
          className="w-8 h-8 flex justify-end items-start cursor-pointer"
          onClick={() => dispatch(setBalancesActiveModal(undefined))}
        >
          <XIcon width={20} />
        </div>
      </div>
      {children}
    </BottomSlideIn>
  )
}

export const BentoActionsModal: FC = () => {
  const isDesktop = useDesktopMediaQuery()
  const dispatch = useAppDispatch()
  const { activeModal } = useAppSelector(selectTridentBalances)

  return (
    <>
      <_ActionsModal>
        <BentoActions />
      </_ActionsModal>
      <WithdrawToWalletModal
        open={activeModal === ActiveModal.WITHDRAW}
        onClose={() =>
          isDesktop ? dispatch(setBalancesActiveModal(ActiveModal.MENU)) : dispatch(setBalancesActiveModal(undefined))
        }
      />
    </>
  )
}

export const WalletActionsModal: FC = () => {
  const isDesktop = useDesktopMediaQuery()
  const dispatch = useAppDispatch()
  const { activeModal } = useAppSelector(selectTridentBalances)

  return (
    <>
      <_ActionsModal>
        <WalletActions />
      </_ActionsModal>
      <DepositToBentoBoxModal
        open={activeModal === ActiveModal.DEPOSIT}
        onClose={() =>
          isDesktop ? dispatch(setBalancesActiveModal(ActiveModal.MENU)) : dispatch(setBalancesActiveModal(undefined))
        }
      />
    </>
  )
}
