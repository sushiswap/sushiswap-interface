import { useCallback, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useBentoBoxContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from '../hooks'

const { BigNumber } = ethers

const useBentoBox = () => {
  const { account } = useActiveWeb3React()
  const bentoBoxContract = useBentoBoxContract(true) // withSigner

  console.log('bentoBoxContract:', bentoBoxContract)
}

export default useBentoBox
