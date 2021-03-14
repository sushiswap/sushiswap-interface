import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'

import ERC20_ABI from '../../constants/abis/erc20.json'
import { isAddressString, getContract } from '../../utils'

const useTokenInfo = (tokenAddress: string) => {
  const { library, account } = useActiveWeb3React()
  const addressCheckSum = isAddressString(tokenAddress)

  const [token, setToken] = useState<any>()
  const fetchTokenInfo = useCallback(async () => {
    // TODO: fix this null assertion
    const token = getContract(addressCheckSum, ERC20_ABI, library!, undefined)
    const data = await Promise.all(
      ['name', 'symbol', 'decimals'].map(field => {
        try {
          return token.callStatic[field]()
        } catch (e) {
          return ''
        }
      })
    )
    setToken({ address: addressCheckSum, name: data[0], symbol: data[1], decimals: data[2] })
  }, [addressCheckSum, library])

  useEffect(() => {
    if (account && addressCheckSum) {
      fetchTokenInfo()
    }
  }, [account, addressCheckSum, fetchTokenInfo, library])

  return token
}

export default useTokenInfo
