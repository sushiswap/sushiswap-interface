import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Checkbox from 'app/components/Checkbox'
import Typography from 'app/components/Typography'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import React, { FC } from 'react'
import { atom, RecoilState, useRecoilState } from 'recoil'

type FixedRatio<P> = FC<P> & {
  atom: RecoilState<boolean>
}

const fixedRatioAtom = atom<boolean>({
  key: 'remove:fixedRatioHeaderAtom',
  default: true,
})

const FixedRatioHeader: FixedRatio<{ margin?: boolean }> = ({ margin = true }) => {
  const isDesktop = useDesktopMediaQuery()
  const { i18n } = useLingui()
  const [fixedRatio, setFixedRatio] = useRecoilState(fixedRatioAtom)

  const content = (
    <div className="flex justify-between gap-1 lg:justify-start">
      <div className="flex flex-row items-center gap-3 cursor-pointer" onClick={() => setFixedRatio(!fixedRatio)}>
        <Checkbox id={`chk-fixed-ratio-withdraw`} className="w-6 h-6" checked={fixedRatio} />
        <Typography variant="sm" weight={700} className={fixedRatio ? 'text-white' : ''}>
          {i18n._(t`Withdraw assets in equal amounts`)}
        </Typography>
      </div>
    </div>
  )

  if (isDesktop) {
    return <div className="pb-1">{content}</div>
  }

  return (
    <div className={margin ? 'top-0 -ml-5 -mr-5 -mt-5 mb-4 pt-5 pb-5 relative' : 'py-5 relative'}>
      <div className="z-[-1] top-0 pointer-events-none absolute w-full h-full border-t border-b border-gradient-r-blue-pink-dark-1000 border-transparent opacity-30">
        <div className="w-full h-full bg-gradient-to-r from-opaque-blue to-opaque-pink" />
      </div>
      <div className="px-5 z-[1]">{content}</div>
    </div>
  )
}

FixedRatioHeader.atom = fixedRatioAtom
export default FixedRatioHeader
