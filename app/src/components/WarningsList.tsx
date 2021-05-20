import Alert from './Alert'
import React from 'react'
import { Warnings } from '../entities/Warnings'

function WarningsView({ warnings }: { warnings: Warnings }) {
    return (
        <>
            {warnings.map((warning, i) => (
                <Alert
                    key={i}
                    type={warning.breaking ? 'error' : 'warning'}
                    message={warning.message}
                    className="mb-4"
                />
            ))}
        </>
    )
}

export default WarningsView
