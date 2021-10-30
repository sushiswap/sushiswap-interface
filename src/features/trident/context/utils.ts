import { Currency } from '@sushiswap/core-sdk'
import { ethers } from 'ethers'
import { useConstantProductPoolFactory, useMasterDeployerContract } from 'hooks'

export const useDeployPoolEncodedData = (currencies: Currency[], feeTier, twap) => {
  const masterDeployer = useMasterDeployerContract()
  const constantProductPoolFactory = useConstantProductPoolFactory()

  if (!masterDeployer || !constantProductPoolFactory || !currencies || !feeTier) return

  const [a, b] = currencies.map((el) => el.wrapped)
  const [token0, token1] = a.sortsBefore(b) ? [a, b] : [b, a]
  const deployData = ethers.utils.defaultAbiCoder.encode(
    ['address', 'address', 'uint8', 'bool'],
    [...[token0.address, token1.address].sort(), feeTier, twap]
  )

  return masterDeployer?.interface?.encodeFunctionData('deployPool', [constantProductPoolFactory.address, deployData])
}
