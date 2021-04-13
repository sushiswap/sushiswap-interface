import WalletStandalone from 'components/WalletModal/Standalone'
import React from 'react'

const Connect = () => {
    return (
        <>
            <div
                style={{
                    maxWidth: '500px',
                    width: '100%'
                }}
            >
                <WalletStandalone pendingTransactions={[]} confirmedTransactions={[]} />
            </div>
        </>
    )
}

export default Connect
