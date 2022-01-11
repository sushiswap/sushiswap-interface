import React from 'react'

import Alert from '../../components/Alert'
import { Warnings } from '../../entities/Warnings'

function WarningsList({ warnings }: { warnings: Warnings }) {
  return (
    <>
      {warnings.map((warning, i) => (
        <Alert key={i} type={warning.breaking ? 'error' : 'warning'} message={warning.message} className="mb-4" />
      ))}
    </>
  )
}

export default WarningsList
