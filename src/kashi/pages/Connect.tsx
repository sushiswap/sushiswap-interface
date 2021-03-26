import React from 'react'
import styled from 'styled-components'

import WalletStandalone from 'components/WalletModal/Standalone'

const PageWrapper = styled.div`
  max-width: 500px;
  width: 100%;
`
const Connect = () => {
  return (
    <>
      <PageWrapper>
        <WalletStandalone pendingTransactions={[]} confirmedTransactions={[]} />
      </PageWrapper>
    </>
  )
}

export default Connect
