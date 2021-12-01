import { ActiveModal } from 'app/features/trident/balances/context/types'
import DepositToBentoBoxModal from 'app/features/trident/balances/DepositToBentoBoxModal'
import LiquidityPositionActions from 'app/features/trident/balances/LiquidityPositionActions'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import React, { FC } from 'react'
import { useRecoilState } from 'recoil'

import { ActiveModalAtom } from '../context/atoms'
import _ActionsModal from './_ActionsModal'

const LiquidityPositionActionsModal: FC = () => {
  const isDesktop = useDesktopMediaQuery()
  const [activeModal, setActiveModal] = useRecoilState(ActiveModalAtom)

  return (
    <>
      <_ActionsModal>
        <LiquidityPositionActions />
      </_ActionsModal>
      <DepositToBentoBoxModal
        open={activeModal === ActiveModal.DEPOSIT}
        onClose={() => (isDesktop ? setActiveModal(ActiveModal.MENU) : setActiveModal(undefined))}
      />
    </>
  )
}

export default LiquidityPositionActionsModal
