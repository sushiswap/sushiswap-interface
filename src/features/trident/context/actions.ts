import { Signature } from '@ethersproject/bytes'
import { Contract } from '@ethersproject/contracts'
import { StandardSignatureData } from 'app/hooks/useERC20Permit'

export interface ApproveMasterContractActionProps {
  router: Contract
  signature?: Signature
}

export const approveMasterContractAction = ({ router, signature }: ApproveMasterContractActionProps) => {
  if (!signature) return undefined

  const { v, r, s } = signature
  return router.interface.encodeFunctionData('approveMasterContract', [v, r, s])
}

export interface ApproveSLPActionProps {
  router: Contract
  signatureData?: StandardSignatureData
}

/**
 *
 * @param router router contract
 * @param signatureData SLP approval signature data
 */
export const approveSLPAction = ({ router, signatureData }: ApproveSLPActionProps) => {
  if (!signatureData) return undefined

  const { tokenAddress, amount, deadline, v, r, s } = signatureData
  return router.interface.encodeFunctionData('permitThis', [tokenAddress, amount, deadline, v, r, s])
}
