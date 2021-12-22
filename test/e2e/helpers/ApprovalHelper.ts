import { JsonRpcProvider } from '@ethersproject/providers'
import { Contract, Signer, Wallet } from 'ethers'

import { ADDRESSES } from '../constants/Addresses'

export class ApprovalHelper {
  private Signer!: Signer

  constructor() {
    const signer = new Wallet(process.env.TEST_PKEY, new JsonRpcProvider(process.env.INFURA_URL))
    this.Signer = signer
  }

  public async approveRouter(tokenAddress: string, amount: number): Promise<void> {
    const approveFunction = ['function approve(address, uint256) external returns (bool)']
    const tokenContract = new Contract(tokenAddress, approveFunction, this.Signer)

    await Promise.all([
      tokenContract.approve(ADDRESSES.TRIDENT_ROUTER, amount),
      tokenContract.approve(ADDRESSES.LEGACY_ROUTER, amount),
    ])
  }
}
