import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React from 'react'

import Typography from '../../components/Typography'
import { classNames } from '../../functions/styling'

export const Radio = React.memo(
  ({
    label,
    selected,
    onSelect,
    className,
    ...rest
  }: {
    label: string
    selected: boolean
    onSelect?: (string) => void
  } & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'as'>) => {
    const { i18n } = useLingui()

    return (
      <div
        className={classNames('flex flex-row items-center cursor-pointer', className)}
        {...rest}
        onClick={() => onSelect(label)}
      >
        <div className="border-2 border-white rounded-full w-[18px] h-[18px] mr-2">
          {selected && <div className="bg-gradient-to-r from-blue to-pink rounded-full w-[12px] h-[12px] m-[1px]" />}
        </div>
        <Typography variant="lg" className="text-white">
          {i18n._(t`${label}`)}
        </Typography>
      </div>
    )
  }
)

Radio.displayName = 'Radio'

export default Radio
