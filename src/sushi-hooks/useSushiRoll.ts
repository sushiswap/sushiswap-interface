import { useCallback } from 'react'

import { signERC2612Permit } from 'eth-permit'
import { ethers } from 'ethers'
import LPToken from '../types/LPToken'
import { useSushiRollContract } from './useContract'
import { useActiveWeb3React } from '../hooks'
import ReactGA from 'react-ga'

const useSushiRoll = () => {
  const { library, account } = useActiveWeb3React()
  const sushiRoll = useSushiRollContract()
  const ttl = 60 * 20

  const migrate = useCallback(
    async (lpToken: LPToken, amount: ethers.BigNumber) => {
      if (sushiRoll) {
        const deadline = Math.floor(new Date().getTime() / 1000) + ttl
        const args = [
          lpToken.tokenA.address,
          lpToken.tokenB.address,
          amount,
          ethers.constants.Zero,
          ethers.constants.Zero,
          deadline
        ]

        const gasLimit = await sushiRoll.estimateGas.migrate(...args)
        const tx = sushiRoll.migrate(...args, {
          gasLimit: gasLimit.mul(120).div(100)
        })

        ReactGA.event({
          category: 'Migrate',
          action: 'Uniswap->Sushiswap',
          label: 'migrate'
        })

        return tx
      }
    },
    [sushiRoll, ttl]
  )

  const migrateWithPermit = useCallback(
    async (lpToken: LPToken, amount: ethers.BigNumber) => {
      if (account && sushiRoll) {
        const deadline = Math.floor(new Date().getTime() / 1000) + ttl
        const permit = await signERC2612Permit(
          library,
          lpToken.address,
          account,
          sushiRoll.address,
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

        const gasLimit = await sushiRoll.estimateGas.migrateWithPermit(...args)
        const tx = await sushiRoll.migrateWithPermit(...args, {
          gasLimit: gasLimit.mul(120).div(100)
        })

        ReactGA.event({
          category: 'Migrate',
          action: 'Uniswap->Sushiswap',
          label: 'migrateWithPermit'
        })

        return tx
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
