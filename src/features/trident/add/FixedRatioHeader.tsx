import React, { FC } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import FixedRatioExplanationModal from './FixedRatioExplanationModal'
import Typography from '../../../components/Typography'
import { useRecoilState, useRecoilValue } from 'recoil'
import { fixedRatioAtom, liquidityModeAtom } from '../context/atoms'
import { LiquidityMode } from '../types'
import Checkbox from '../../../components/Checkbox'

interface FixedRatioHeaderProps {
  margin?: boolean
}

const FixedRatioHeader: FC<FixedRatioHeaderProps> = ({ margin = true }) => {
  const { i18n } = useLingui()
  const [fixedRatio, setFixedRatio] = useRecoilState(fixedRatioAtom)
  const liquidityMode = useRecoilValue(liquidityModeAtom)

  if (liquidityMode !== LiquidityMode.STANDARD) return <div className="pt-6" />

  return (
    <div className={margin ? '-top-6 pt-10 pb-5 relative z-0' : 'py-5 relative z-0'}>
      <div className="top-0 pointer-events-none absolute w-full h-full bg-gradient-to-r from-opaque-blue to-opaque-pink opacity-40" />
      <div className="flex justify-between px-5">
        <div className="flex flex-row gap-3 items-center" onClick={() => setFixedRatio(!fixedRatio)}>
          <Checkbox className="w-6 h-6" color="blue" checked={fixedRatio} />
          <Typography variant="sm" weight={700} className={fixedRatio ? 'text-high-emphesis' : 'text-secondary'}>
            {i18n._(t`Deposit assets in equal amounts`)}
          </Typography>
        </div>

        <FixedRatioExplanationModal />
      </div>
    </div>
  )
}

export default FixedRatioHeader
