import React, { ReactNode } from 'react'
import { AlertTriangle } from 'react-feather'

export function SwapCallbackError({ error }: { error: ReactNode }) {
  return (
    <div className="flex items-center justify-center pt-6 text-red">
      <AlertTriangle size={16} />
      <div className="ml-4 text-sm">{error}</div>
    </div>
  )
}
