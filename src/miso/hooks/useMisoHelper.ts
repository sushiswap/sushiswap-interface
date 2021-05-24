import { Contract } from '@ethersproject/contracts'
import { ChainId } from '@sushiswap/sdk'

import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useContract } from '../../hooks/useContract'

import MISO_HELPER_ABI from '../constants/MISOHelper.json'

export function useMisoHelper(withSignerIfPossible = true): Contract | null {
    const { chainId } = useActiveWeb3React()
    let address: string | undefined
    if (chainId) {
        switch (chainId) {
            case ChainId.BSC:
                address = ''
                break
            case ChainId.BSC_TESTNET:
                address = '0xd51CEf756e61b11028b6604430a66816d99Bf6FF'
                break
            default:
                address = '0xAea50fa0a2aB411807131ADC10016FE0FfB506b4'
        }
    }
    return useContract(address, MISO_HELPER_ABI, withSignerIfPossible)
}
