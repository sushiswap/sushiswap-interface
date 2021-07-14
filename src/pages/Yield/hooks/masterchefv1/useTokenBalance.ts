import { BigNumber } from '@ethersproject/bignumber'
import { WETH } from '@sushiswap/sdk'
import ERC20_ABI from 'constants/abis/erc20.json'
import { Contract } from 'ethers'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { useContract } from 'hooks/useContract'
import { useCallback, useEffect, useState } from 'react'
import { isAddress } from 'utils'
import { useBlockNumber } from 'state/application/hooks'
import useTransactionStatus from 'hooks/useTransactionStatus'

export interface BalanceProps {
    value: BigNumber
    decimals: number
}

// Do NOT use this hook, use the generic wallet hook for useTokenBalance
// Prefer import { useTokenBalance } from 'state/wallet/hooks'

function useTokenBalance(tokenAddress: string): BalanceProps {
    const [balance, setBalance] = useState<BalanceProps>({ value: BigNumber.from(0), decimals: 18 })
    const { account, chainId, library } = useActiveWeb3React()
    const currentBlockNumber = useBlockNumber()
    const currentTransactionStatus = useTransactionStatus()
    const addressCheckSum = isAddress(tokenAddress)
    const tokenContract = useContract(addressCheckSum ? addressCheckSum : undefined, ERC20_ABI, false)
    const fetchBalance = useCallback(async () => {
        async function getBalance(contract: Contract | null, owner: string | null | undefined): Promise<BalanceProps> {
            try {
                if (account && chainId && contract?.address === WETH[chainId].address) {
                    const ethBalance = await library?.getBalance(account)
                    return { value: BigNumber.from(ethBalance), decimals: 18 }
                }

                const balance = await contract?.balanceOf(owner)
                const decimals = await contract?.decimals()

                return { value: BigNumber.from(balance), decimals: decimals }
            } catch (error) {
                console.error(error)
                return { value: BigNumber.from(0), decimals: 18 }
            }
        }
        const balance = await getBalance(tokenContract, account)
        setBalance(balance)
    }, [account, chainId, library, tokenContract])

    useEffect(() => {
        if (account && tokenContract) {
            fetchBalance()
        }
    }, [account, setBalance, currentBlockNumber, currentTransactionStatus, tokenAddress, fetchBalance, tokenContract])

    return balance
}

export default useTokenBalance
