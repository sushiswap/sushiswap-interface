import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { WNATIVE } from '@sushiswap/core-sdk'
import ERC20_ABI from 'app/constants/abis/erc20.json'
import { isAddress } from 'app/functions'
import { useContract } from 'app/hooks/useContract'
import useTransactionStatus from 'app/hooks/useTransactionStatus'
import { useActiveWeb3React } from 'app/services/web3'
import { useBlockNumber } from 'app/state/application/hooks'
import { useCallback, useEffect, useState } from 'react'

export interface BalanceProps {
  value: BigNumber
  decimals: number
}

// Do NOT use this hook, use the generic wallet hook for useTokenBalance
// Prefer import { useTokenBalance } from 'app/state/wallet/hooks' and use appropriately.

function useContractTokenBalance(tokenAddress: string, contractAddress: string): BalanceProps {
  const [balance, setBalance] = useState<BalanceProps>({
    value: BigNumber.from(0),
    decimals: 18,
  })
  const { chainId, library } = useActiveWeb3React()
  const currentBlockNumber = useBlockNumber()
  const currentTransactionStatus = useTransactionStatus()
  const addressCheckSum = isAddress(tokenAddress)
  const tokenContract = useContract(addressCheckSum ? addressCheckSum : undefined, ERC20_ABI, false)
  const fetchBalance = useCallback(async () => {
    async function getBalance(contract: Contract | null, owner: string | null | undefined): Promise<BalanceProps> {
      try {
        if (contractAddress && chainId && contract?.address === WNATIVE[chainId].address) {
          const ethBalance = await library?.getBalance(contractAddress)
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
    const balance = await getBalance(tokenContract, contractAddress)
    setBalance(balance)
  }, [contractAddress, chainId, library, tokenContract])

  useEffect(() => {
    if (contractAddress && tokenContract) {
      fetchBalance()
    }
  }, [
    contractAddress,
    setBalance,
    currentBlockNumber,
    currentTransactionStatus,
    tokenAddress,
    fetchBalance,
    tokenContract,
  ])

  return balance
}

export default useContractTokenBalance
