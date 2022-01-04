import { XIcon } from '@heroicons/react/solid'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import BottomSlideIn from 'app/components/Dialog/BottomSlideIn'
import Typography from 'app/components/Typography'
import BentoActions from 'app/features/trident/balances/BentoActions'
import { ActiveModalAtom, SelectedCurrencyAtom } from 'app/features/trident/balances/context/atoms'
import { ActiveModal } from 'app/features/trident/balances/context/types'
import DepositToBentoBoxModal from 'app/features/trident/balances/DepositToBentoBoxModal'
import WalletActions from 'app/features/trident/balances/WalletActions'
import WithdrawToWalletModal from 'app/features/trident/balances/WithdrawToWalletModal'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import React, { FC } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

const _ActionsModal: FC = ({ children }) => {
  const isDesktop = useDesktopMediaQuery()
  const currency = useRecoilValue(SelectedCurrencyAtom)
  const [activeModal, setActiveModal] = useRecoilState(ActiveModalAtom)

  if (isDesktop) return <></>

  return (
    <BottomSlideIn open={activeModal === ActiveModal.MENU} onClose={() => setActiveModal(undefined)}>
      <div className="flex justify-between bg-dark-800 p-5">
        <div className="flex gap-4 items-center">
          <CurrencyLogo currency={currency} size={42} className="rounded-full" />
          <Typography variant="h3" className="text-high-emphesis" weight={700}>
            {currency?.symbol}
          </Typography>
        </div>
        <div className="w-8 h-8 flex justify-end items-start cursor-pointer" onClick={() => setActiveModal(undefined)}>
          <XIcon width={20} />
        </div>
      </div>
      {children}
    </BottomSlideIn>
  )
}

export const BentoActionsModal: FC = () => {
  const isDesktop = useDesktopMediaQuery()
  const [activeModal, setActiveModal] = useRecoilState(ActiveModalAtom)

  return (
    <>
      <_ActionsModal>
        <BentoActions />
      </_ActionsModal>
      <WithdrawToWalletModal
        open={activeModal === ActiveModal.WITHDRAW}
        onClose={() => (isDesktop ? setActiveModal(ActiveModal.MENU) : setActiveModal(undefined))}
      />
    </>
  )
}

export const WalletActionsModal: FC = () => {
  const isDesktop = useDesktopMediaQuery()
  const [activeModal, setActiveModal] = useRecoilState(ActiveModalAtom)

  return (
    <>
      <_ActionsModal>
        <WalletActions />
      </_ActionsModal>
      <DepositToBentoBoxModal
        open={activeModal === ActiveModal.DEPOSIT}
        onClose={() => (isDesktop ? setActiveModal(ActiveModal.MENU) : setActiveModal(undefined))}
      />
    </>
  )
}
