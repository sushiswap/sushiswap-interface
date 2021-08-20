import { defaultAbiCoder } from '@ethersproject/abi'
import { parseEther } from '@ethersproject/units'
import { Token } from '@sushiswap/sdk'
import { useCallback, useEffect, useState } from 'react'

import { useMisoHelperContract, useTokenFactoryContract } from './useContracts'

import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useBlockNumber } from '../../state/application/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'

const filterArrayToJson = (array) => {
  const arrayJson = []
  for (let i = 0; i < array.length; i++) {
    const element = array[i]
    const json = { ...element }
    arrayJson.push(json)
  }
  return arrayJson
}

const sort = (arr, obj, orderBy) => {
  if (orderBy === 'desc') {
    return arr.sort((current, next) => (current[obj] < next[obj] ? 1 : current[obj] > next[obj] ? -1 : 0))
  } else {
    return arr.sort((current, next) => (current[obj] > next[obj] ? 1 : current[obj] < next[obj] ? -1 : 0))
  }
}

export function useListTokens(): Token[] {
  const misoHelperContract = useMisoHelperContract(false)
  const blockNumber = useBlockNumber()
  const { chainId } = useActiveWeb3React()

  const [tokens, setTokens] = useState<Token[]>([])
  const fetchTokens = useCallback(async () => {
    try {
      const tokens = await misoHelperContract?.getTokens()
      const filtered = filterArrayToJson(tokens)
      let result: Token[] = []
      filtered.forEach((token) => {
        result.push(new Token(chainId, token.addr, token.decimals.toNumber(), token.symbol, token.name))
      })
      setTokens(result)
    } catch (error) {
      setTokens([])
      throw error
    }
  }, [misoHelperContract])
  useEffect(() => {
    if (misoHelperContract) {
      fetchTokens()
    }
  }, [fetchTokens, misoHelperContract, blockNumber])

  return tokens
}

function useTokens() {
  const tokenFactoryContract = useTokenFactoryContract()
  const addTransaction = useTransactionAdder()
  const { account } = useActiveWeb3React()

  const createToken = useCallback(
    async (templateType: string, name: string, symbol: string, totalSupply: string | Number) => {
      try {
        const tokenTemplateId = await tokenFactoryContract?.currentTemplateId(templateType)

        const tokenData = [name, symbol, account, parseEther(totalSupply.toString())]
        const data = defaultAbiCoder.encode(['string', 'string', 'address', 'uint256'], tokenData)
        const tx = await tokenFactoryContract?.createToken(tokenTemplateId, account, data)
        addTransaction(tx, { summary: 'Create Token for MISO' })
        return tx
      } catch (e) {
        console.error('create token error:', e)
        return e
      }
    },
    [tokenFactoryContract, addTransaction]
  )

  return { createToken }
}

export default useTokens
