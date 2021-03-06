import { useCallback } from 'react'

import { signERC2612Permit } from 'eth-permit'
import { ethers } from 'ethers'
import LPToken from '../types/LPToken'
import { useSushiRollContract } from './useContract'
import { useActiveWeb3React } from '../hooks'

const useSushiRoll = () => {
  const { library, account } = useActiveWeb3React()
  const sushiRoll = useSushiRollContract()
  const ttl = 60 * 20

  const migrate = useCallback(
    async (lpToken: LPToken, amount: ethers.BigNumber) => {
      const deadline = Math.floor(new Date().getTime() / 1000) + ttl
      const args = [
        lpToken.tokenA.address,
        lpToken.tokenB.address,
        amount,
        ethers.constants.Zero,
        ethers.constants.Zero,
        deadline
      ]
      const gasLimit = await sushiRoll?.estimateGas.migrate(...args)
      return sushiRoll?.migrate(...args, {
        gasLimit: gasLimit?.mul(120).div(100)
      })
    },
    [sushiRoll, ttl]
  )

  const migrateWithPermit = useCallback(
    async (lpToken: LPToken, amount: ethers.BigNumber) => {
      if (account) {
        const deadline = Math.floor(new Date().getTime() / 1000) + ttl
        const permit = await signERC2612Permit(
          library,
          lpToken.address,
          account,
          // TODO extract to constant
          '0x16E58463eb9792Bc236d8860F5BC69A81E26E32B',
          amount.toString(),
          deadline
        )
        const args = [
          lpToken.tokenA.address,
          lpToken.tokenB.address,
          amount,
          ethers.constants.Zero,
          ethers.constants.Zero,
          deadline,
          permit.v,
          permit.r,
          permit.s
        ]
        const gasLimit = await sushiRoll?.estimateGas.migrateWithPermit(...args)
        return sushiRoll?.migrateWithPermit(...args, {
          gasLimit: gasLimit?.mul(120).div(100)
        })
      }
    },
    [account, library, sushiRoll, ttl]
  )

  return {
    migrate,
    migrateWithPermit
  }
}

export default useSushiRoll
