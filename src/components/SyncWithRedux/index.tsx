import { useActiveWeb3React } from 'app/services/web3'
import { updateWeb3Context } from 'app/state/global/web3ContextSlice'
import { useAppDispatch } from 'app/state/hooks'
import { FC, useEffect, useMemo } from 'react'

const SyncWeb3Context = () => {
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  const objToSync = useMemo(() => ({ account, chainId }), [account, chainId])

  useEffect(() => {
    dispatch(updateWeb3Context(objToSync))
  }, [dispatch, objToSync])
}

/* Component designed to sync high level react hooks with Redux that can later be composed in selectors */
export const SyncWithRedux: FC = () => {
  SyncWeb3Context()
  return <></>
}
