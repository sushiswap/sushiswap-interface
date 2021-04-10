import { Warnings } from 'kashi/entities'
import React from 'react'
import Alert from './Alert'

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