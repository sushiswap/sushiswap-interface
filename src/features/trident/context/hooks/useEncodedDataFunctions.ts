import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { ethers } from 'ethers'
import {
  useActiveWeb3React,
  useBentoBoxContract,
  useConstantProductPoolFactory,
  useMasterDeployerContract,
  useTridentRouterContract,
} from '../../../../hooks'

import { calculateSlippageAmount } from '../../../../functions'
import { ZERO_PERCENT } from '../../../../constants'
import { useUserSlippageToleranceWithDefault } from '../../../../state/user/hooks'
import { DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE, noLiquiditySelector, poolAtom, spendFromWalletAtom } from '../atoms'
import { useRecoilValue } from 'recoil'
import { useEffect, useMemo, useState } from 'react'

export const useDeployCPPEncodedData = (currencies: Currency[], feeTier, twap) => {
  const masterDeployer = useMasterDeployerContract()
  const constantProductPoolFactory = useConstantProductPoolFactory()

  if (!currencies.every((el) => el) || !masterDeployer || !constantProductPoolFactory) return

  const [a, b] = currencies.map((el) => el.wrapped)
  const [token0, token1] = a.sortsBefore(b) ? [a, b] : [b, a]
  const deployData = ethers.utils.defaultAbiCoder.encode(
    ['address', 'address', 'uint8', 'bool'],
    [...[token0.address, token1.address].sort(), feeTier, twap]
  )

  return masterDeployer?.interface?.encodeFunctionData('deployPool', [constantProductPoolFactory.address, deployData])
}

export const useAddLiquidityEncodedData = (parsedAmounts: CurrencyAmount<Currency>[]) => {
  const [poolState, pool] = useRecoilValue(poolAtom)
  const { account } = useActiveWeb3React()
  const router = useTridentRouterContract()
  const bentoboxContract = useBentoBoxContract()
  const noLiquidity = useRecoilValue(noLiquiditySelector)
  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE) // custom from users
  const spendFromWallet = useRecoilValue(spendFromWalletAtom)
  const [liquidityInput, setLiquidityInput] = useState([])

  const amountsMin = parsedAmounts.map((el) =>
    el ? calculateSlippageAmount(el, noLiquidity ? ZERO_PERCENT : allowedSlippage)[0] : undefined
  )

  useEffect(() => {
    if (!router || !bentoboxContract || poolState === 3) return

    const run = async () => {
      const input = await Promise.all(
        parsedAmounts.map(async (el, index) => ({
          token: el.currency.wrapped.address,
          native: spendFromWallet,
          amount: await bentoboxContract.toShare(el.currency.wrapped.address, amountsMin[index].toString(), false),
        }))
      )

      setLiquidityInput(input)
    }

    run()
  }, [amountsMin, bentoboxContract, parsedAmounts, poolState, router, spendFromWallet])

  const index = parsedAmounts.findIndex((el) => el.currency.isNative)
  const value = index ? { value: amountsMin[index].toString() } : {}

  return liquidityInput
    ? {
        data: router?.interface?.encodeFunctionData('addLiquidity', [
          liquidityInput,
          pool.liquidityToken.address,
          1,
          ethers.utils.defaultAbiCoder.encode(['address'], [account]),
        ]),
        value,
      }
    : undefined
}
