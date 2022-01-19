import { SafeAppConnector, useSafeAppConnection } from '@gnosis.pm/safe-apps-web3-react'

const safeMultisigConnector = new SafeAppConnector()

export default function GnosisManager(): JSX.Element {
  const triedToConnectToSafe = useSafeAppConnection(safeMultisigConnector)
  // @ts-ignore TYPE NEEDS FIXING
  return null
}
