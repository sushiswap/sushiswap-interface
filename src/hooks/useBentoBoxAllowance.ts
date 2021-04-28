import { BigNumber } from '@ethersproject/bignumber'
import { Fraction } from 'entities'
import { useCallback, useEffect, useState } from 'react'
import ERC20_ABI from '../constants/abis/erc20.json'
import { useActiveWeb3React, useBentoBoxContract, useContract } from '../hooks'
import { isAddress } from '../utils'

const useAllowance = (tokenAddress: string) => {
    const { account } = useActiveWeb3React()
    const bentoBoxContract = useBentoBoxContract(true) // withSigner
    const tokenAddressChecksum = isAddress(tokenAddress)
    const tokenContract = useContract(tokenAddressChecksum ? tokenAddressChecksum : undefined, ERC20_ABI, true) // withSigner

    const [allowance, setAllowance] = useState('0')
    const fetchAllowance = useCallback(async () => {
        if (account) {
            try {
                const allowance = await tokenContract?.allowance(account, bentoBoxContract?.address)
                const formatted = Fraction.from(BigNumber.from(allowance), BigNumber.from(10).pow(18)).toString()
                setAllowance(formatted)
            } catch {
                setAllowance('0')
            }
        }
    }, [account, bentoBoxContract?.address, tokenContract])
    useEffect(() => {
        if (account && bentoBoxContract && tokenContract) {
            fetchAllowance()
        }
        const refreshInterval = setInterval(fetchAllowance, 10000)
        return () => clearInterval(refreshInterval)
    }, [account, bentoBoxContract, fetchAllowance, tokenContract])

    return allowance
}

export default useAllowance
