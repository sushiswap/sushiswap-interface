import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import ERC20_ABI from '../constants/abis/erc20.json'
import { useActiveWeb3React } from '../hooks/useActiveWeb3React'
import { useContract } from '../hooks/useContract'
import { useBlockNumber } from '../state/application/hooks'
import { isAddress } from '../utils'

export interface BalanceProps {
    value: BigNumber
    decimals: number
}

const useTokenBalance = (tokenAddress: string) => {
    const [balance, setBalance] = useState<BalanceProps>({ value: BigNumber.from(0), decimals: 18 })
    const { account } = useActiveWeb3React()
    const currentBlockNumber = useBlockNumber()
    const addressCheckSum = isAddress(tokenAddress)
    const tokenContract = useContract(addressCheckSum ? addressCheckSum : undefined, ERC20_ABI, false)

    const getBalance = async (contract: Contract | null, owner: string | null | undefined): Promise<BalanceProps> => {
        try {
            //console.log('token_contract:', contract)
            const balance = await contract?.balanceOf(owner)
            const decimals = await contract?.decimals()
            return { value: BigNumber.from(balance), decimals: decimals }
            //todo: return as BigNumber as opposed toString since information will
            //return Fraction.from(BigNumber.from(balance), BigNumber.from(10).pow(decimals)).toString()
        } catch (e) {
            console.log('getBalance_error:', e)
            return { value: BigNumber.from(0), decimals: 18 }
        }
    }

    const fetchBalance = useCallback(async () => {
        const balance = await getBalance(tokenContract, account)
        setBalance(balance)
    }, [account, tokenContract])

    useEffect(() => {
        if (account && tokenContract) {
            fetchBalance()
        }
    }, [account, setBalance, currentBlockNumber, tokenAddress, fetchBalance, tokenContract])

    return balance
}

export default useTokenBalance
