import { Contract } from '@ethersproject/contracts'
import { useActiveWeb3React } from 'app/services/web3'

import ARGENT_WALLET_ABI from '../constants/abis/argent-wallet.json'
import { useContract } from './useContract'
import useIsArgentWallet from './useIsArgentWallet'

export function useArgentWalletContract(): Contract | null {
  const { account } = useActiveWeb3React()
  const isArgentWallet = useIsArgentWallet()
  return useContract(isArgentWallet ? account ?? undefined : undefined, ARGENT_WALLET_ABI, true)
}
