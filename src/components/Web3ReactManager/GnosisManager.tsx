import React, { useEffect, useState } from 'react'

import { useSafeAppConnection, SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react'

const safeMultisigConnector = new SafeAppConnector()

export default function GnosisManager(): JSX.Element {
  const triedToConnectToSafe = useSafeAppConnection(safeMultisigConnector)
  return null
}
