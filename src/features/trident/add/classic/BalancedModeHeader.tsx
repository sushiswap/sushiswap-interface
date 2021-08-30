import React, { FC } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from '../../../../components/Typography'
import BalancedModeExplanationModal from './BalancedModeExplanationModal'
import { LiquidityMode } from '../../types'
import { useRecoilState, useRecoilValue } from 'recoil'
import { balancedModeAtom, liquidityModeAtom } from '../../context/atoms'

const BalancedModeHeader: FC = () => {
  const { i18n } = useLingui()
  const liquidityMode = useRecoilValue(liquidityModeAtom)
  const [balancedMode, setBalancedMode] = useRecoilState(balancedModeAtom)

  if (liquidityMode !== LiquidityMode.STANDARD || !balancedMode) return <div className="pt-6" />

  return (
    <div className="-top-6 pt-10 pb-5 relative z-0">
      <div className="top-0 pointer-events-none absolute w-full h-full bg-gradient-to-r from-opaque-blue to-opaque-pink opacity-40" />
      <div className="flex justify-between px-5">
        <div className="flex flex-row gap-1">
          <Typography variant="sm">{i18n._(t`1:1 Ratio: `)}</Typography>
          <Typography variant="sm" weight={700} className="text-blue">
            {balancedMode ? i18n._(t`On`) : i18n._(t`Off`)}
          </Typography>
          <BalancedModeExplanationModal />
        </div>

        <Typography variant="sm" className="text-blue cursor-pointer" onClick={() => setBalancedMode(!balancedMode)}>
          {balancedMode ? i18n._(t`Turn off`) : i18n._(t`Turn on`)}
        </Typography>
      </div>
    </div>
  )
}

export default BalancedModeHeader
