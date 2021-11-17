import { useActiveWeb3React } from 'app/services/web3'
import { initializedTransactionsAtom } from 'app/state/global/transactions'
import { activeWeb3ReactAtom } from 'app/state/global/web3React'
import { useAppSelector } from 'app/state/hooks'
import { TransactionState } from 'app/state/transactions/reducer'
import { FC, useEffect, useMemo } from 'react'
import { useRecoilState } from 'recoil'

const SyncWeb3React = () => {
  const { account, chainId } = useActiveWeb3React()
  const [, setWeb3React] = useRecoilState(activeWeb3ReactAtom)

  const objToSync = useMemo(() => ({ account, chainId }), [account, chainId])

  useEffect(() => {
    setWeb3React(objToSync)
  }, [objToSync, setWeb3React])
}

const SyncInitializedTransactions = () => {
  const { chainId } = useActiveWeb3React()
  const [, setTransactions] = useRecoilState(initializedTransactionsAtom)

  const initializedTransactions: TransactionState = useAppSelector((state) => state.transactions)
  const objToSync = useMemo(() => {
    return chainId ? initializedTransactions[chainId] ?? {} : {}
  }, [chainId, initializedTransactions])

  useEffect(() => {
    setTransactions(objToSync)
  }, [objToSync, setTransactions])
}

/* Component designed to sync high level react hooks with Recoil Atoms that can later be composed in selectors */
export const SyncWithRecoil: FC = () => {
  SyncWeb3React()
  SyncInitializedTransactions()

  return <></>
}
