import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import React, { useEffect, useState } from 'react'
import { classNames } from '../../functions'
import Typography from '../Typography'

function Slider({ className, currentValue, minValue, maxValue, onChange }: any) {
  const { i18n } = useLingui()
  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    if (maxValue == null || minValue == null || currentValue == null || minValue > maxValue) {
      setPercentage(0)
      return
    }
    setPercentage(Math.floor((100 * (currentValue - minValue)) / (maxValue - minValue)))
  }, [currentValue, minValue, maxValue])

  return (
    <div className={classNames(className, '')}>
      <div className="flex justify-between">
        <Typography className={classNames(percentage == 0 ? 'text-secondary' : 'text-primary')}>
          {i18n._(`${percentage}%`)}
        </Typography>
        <Typography className="text-secondary">{i18n._(t`100%`)}</Typography>
      </div>
      <div className="relative mt-1 rounded-full w-full h-[10px] bg-dark-700">
        <div className="h-[10px] bg-primary rounded-full" style={{ width: `${percentage}%` }} />
        <div
          className="absolute w-[24px] h-[24px] rounded-full bg-gradient-to-r from-blue to-pink"
          style={{ left: `${percentage}%`, top: 0, marginLeft: -10, marginTop: -7 }}
        />
      </div>
    </div>
  )
}

export default Slider
