import { Block } from '@ethersproject/abstract-provider'
import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { Formatter } from '@ethersproject/providers'
import { ChainId } from '@sushiswap/core-sdk'
import useDebounce from 'app/hooks/useDebounce'
import useIsWindowVisible from 'app/hooks/useIsWindowVisible'
import { useActiveWeb3React } from 'app/services/web3'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { updateBlockNumber, updateBlockTimestamp, updateChainId } from './actions'

export default function Updater(): null {
  const { library, chainId, account } = useActiveWeb3React()
  const dispatch = useDispatch()

  useEffect(() => {
    if (chainId === ChainId.CELO) {
      // @ts-ignore TYPE NEEDS FIXING
      const originalBlockFormatter = library.formatter._block
      // @ts-ignore TYPE NEEDS FIXING
      library.formatter._block = (value, format) => {
        return originalBlockFormatter(
          {
            gasLimit: Zero,
            ...value,
          },
          format
        )
      }
    }
    return () => {
      if (chainId === ChainId.CELO) {
        // @ts-ignore TYPE NEEDS FIXING
        library.formatter._block = (value: any, format: any): Block => {
          if (value.author != null && value.miner == null) {
            value.miner = value.author
          }
          // The difficulty may need to come from _difficulty in recursed blocks
          const difficulty = value._difficulty != null ? value._difficulty : value.difficulty
          const result = Formatter.check(format, value)
          result._difficulty = difficulty == null ? null : BigNumber.from(difficulty)
          return result
        }
      }
    }
  }, [chainId, library])

  const windowVisible = useIsWindowVisible()

  const [state, setState] = useState<{
    chainId: number | undefined
    blockNumber: number | null
    blockTimestamp: number | null
  }>({
    chainId,
    blockNumber: null,
    blockTimestamp: null,
  })

  const blockCallback = useCallback(
    (block: Block) => {
      setState((state) => {
        if (chainId === state.chainId) {
          if (typeof state.blockNumber !== 'number' && typeof state.blockTimestamp !== 'number')
            return { chainId, blockNumber: block.number, blockTimestamp: block.timestamp }
          return {
            chainId,
            // @ts-ignore TYPE NEEDS FIXING
            blockNumber: Math.max(block.number, state.blockNumber),
            // @ts-ignore TYPE NEEDS FIXING
            blockTimestamp: Math.max(block.timestamp, state.blockTimestamp),
          }
        }
        return state
      })
    },
    [chainId, setState]
  )

  const onBlock = useCallback(
    (number) => {
      // @ts-ignore TYPE NEEDS FIXING
      return library.getBlock(number).then(blockCallback)
    },
    [blockCallback, library]
  )

  // attach/detach listeners
  useEffect(() => {
    if (!library || !chainId || !windowVisible) return undefined

    setState({ chainId, blockNumber: null, blockTimestamp: null })

    library
      .getBlock('latest')
      .then(blockCallback)
      .catch((error) => console.error(`Failed to get block for chainId: ${chainId}`, error))

    library.on('block', onBlock)
    return () => {
      library.removeListener('block', onBlock)
    }
  }, [dispatch, chainId, library, windowVisible, blockCallback, onBlock])

  const debouncedState = useDebounce(state, 100)

  useEffect(() => {
    if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return
    dispatch(updateBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber }))
  }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId])

  useEffect(() => {
    if (!debouncedState.chainId || !debouncedState.blockTimestamp || !windowVisible) return
    dispatch(updateBlockTimestamp({ chainId: debouncedState.chainId, blockTimestamp: debouncedState.blockTimestamp }))
  }, [windowVisible, dispatch, debouncedState.blockTimestamp, debouncedState.chainId])

  useEffect(() => {
    // @ts-ignore TYPE NEEDS FIXING
    dispatch(updateChainId({ chainId: debouncedState.chainId in ChainId ? debouncedState.chainId ?? null : null }))
  }, [dispatch, debouncedState.chainId])

  // useEffect(() => {
  //   if (!account || !library?.provider?.request || !library?.provider?.isMetaMask) {
  //     return;
  //   }
  //   switchToNetwork({ library })
  //     .then((x) => x ?? dispatch(setImplements3085({ implements3085: true })))
  //     .catch(() => dispatch(setImplements3085({ implements3085: false })));
  // }, [account, chainId, dispatch, library]);

  return null
}
