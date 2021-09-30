import React, { FC } from 'react'

import CurrencyInputPanel from '../exchange-v1/limit-order/CurrencyInputPanel'
import Typography from '../../components/Typography'

interface OutputPanelProps {
  label: string
}

const OutputPanel: FC<OutputPanelProps> = ({ label }) => {
  return (
    <CurrencyInputPanel
      id="token-output"
      className="rounded p-0 px-5 border-2 border-dark-800 flex items-center"
      selectComponent={
        <Typography variant="lg" className="text-primary" weight={700}>
          {label}
        </Typography>
      }
      inputComponent={<div className="bg-dark-900 rounded-r sm:w-3/5 h-16" />}
    />
  )
}

export default OutputPanel
