import { Contract } from '@ethersproject/contracts'

import { useContract } from '../../hooks/useContract'

import TOKENFACTORY_ABI from '../constants/MISOTokenFactory.json'

import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'

import { tokenFactory } from '../constants/contracts'

import { ethers } from "ethers"

export function useTokenFactoryContract(address: string, withSignerIfPossible = true): Contract | null {
    return useContract(address, TOKENFACTORY_ABI, withSignerIfPossible)
}

function typedKeys<T>(o: T): (keyof T)[] {
    // type cast should be safe because that's what really Object.keys() does
    return Object.keys(o) as (keyof T)[];
}

export function GetContractInstance(): Contract | null {
    let { chainId } = useActiveWeb3React()
    let address = tokenFactory.address[5] // default goerli
    typedKeys(tokenFactory.address).forEach(id => {
        if (chainId === id) {
            address = tokenFactory.address[id]
        }
    })
    return useTokenFactoryContract(address, true)
}