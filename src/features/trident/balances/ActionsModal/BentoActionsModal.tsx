import BentoActions from 'app/features/trident/balances/BentoActions'
import { ActiveModalAtom } from 'app/features/trident/balances/context/atoms'
import { ActiveModal } from 'app/features/trident/balances/context/types'
import WithdrawToWalletModal from 'app/features/trident/balances/WithdrawToWalletModal'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import React, { FC } from 'react'
import { useRecoilState } from 'recoil'

import _ActionsModal from './_ActionsModal'

const BentoActionsModal: FC = () => {
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

export default BentoActionsModal
