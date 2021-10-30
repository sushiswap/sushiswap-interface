import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Checkbox from 'app/components/Checkbox'
import Typography from 'app/components/Typography'
import { fixedRatioAtom, liquidityModeAtom } from 'app/features/trident/context/atoms'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import React, { FC } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { LiquidityMode } from '../types'
import FixedRatioExplanationModal from './FixedRatioExplanationModal'

interface FixedRatioHeaderProps {
  margin?: boolean
}

const FixedRatioHeader: FC<FixedRatioHeaderProps> = ({ margin = true }) => {
  const isDesktop = useDesktopMediaQuery()
  const { i18n } = useLingui()
  const [fixedRatio, setFixedRatio] = useRecoilState(fixedRatioAtom)
  const liquidityMode = useRecoilValue(liquidityModeAtom)

  if (liquidityMode !== LiquidityMode.STANDARD) return <></>

  const content = (
    <div className="flex justify-between lg:justify-start gap-1">
      <div className="flex flex-row gap-3 items-center cursor-pointer" onClick={() => setFixedRatio(!fixedRatio)}>
        <Checkbox className="w-6 h-6" checked={fixedRatio} />
        <Typography variant="sm" weight={700} className={fixedRatio ? 'text-high-emphesis' : 'text-secondary'}>
          {i18n._(t`Deposit assets in equal amounts`)}
        </Typography>
      </div>

      <FixedRatioExplanationModal />
    </div>
  )

  if (isDesktop) {
    return <div className="pb-1">{content}</div>
  }

  return (
    <div className={margin ? 'top-0 -ml-5 -mr-5 pt-5 pb-5 relative z-0' : 'py-5 relative z-0'}>
      <div className="top-0 pointer-events-none absolute w-full h-full bg-gradient-to-r from-opaque-blue to-opaque-pink opacity-40" />
      <div className="px-5">{content}</div>
    </div>
  )
}

export default FixedRatioHeader
