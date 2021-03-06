import { useCallback, useEffect, useState } from 'react'
import useLPTokensState, { LPTokensState } from './useLPTokensState'
import useSushiRoll from './useSushiRoll'
import { useActiveWeb3React } from '../hooks'
import { useIsTransactionPending, useTransactionAdder } from '../state/transactions/hooks'
import { ethers } from 'ethers'

export type MigrateMode = 'permit' | 'approve'

export interface MigrateState extends LPTokensState {
  mode?: MigrateMode
  setMode: (_mode?: MigrateMode) => void
  onMigrate: () => Promise<void>
  migrating: boolean
  pendingMigrationHash: string | null
  isMigrationPending: boolean
}

const useMigrateState: () => MigrateState = () => {
  const { library, account } = useActiveWeb3React()
  const state = useLPTokensState()
  const { migrate, migrateWithPermit } = useSushiRoll()
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<MigrateMode>()
  const [migrating, setMigrating] = useState(false)
  const addTransaction = useTransactionAdder()
  const [pendingMigrationHash, setPendingMigrationHash] = useState<string | null>(null)
  const isMigrationPending = useIsTransactionPending(pendingMigrationHash ?? undefined)

  useEffect(() => {
    state.setSelectedLPToken(undefined)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  const onMigrate = useCallback(async () => {
    if (mode && state.selectedLPToken && account && library) {
      setMigrating(true)
      try {
        const func = mode === 'approve' ? migrate : migrateWithPermit

        // TODO amount
        const tx = await func(state.selectedLPToken, ethers.utils.parseUnits('10', 18))

        addTransaction(tx, { summary: `Migrate ${state.selectedLPToken.symbol} liquidity to V2` })
        setPendingMigrationHash(tx.hash)
        state.setSelectedLPToken(undefined)
      } catch (e) {
        setMigrating(false)
      }
    }
  }, [mode, state, account, library, migrate, migrateWithPermit, addTransaction])

  return {
    ...state,
    loading: state.loading || loading,
    mode,
    setMode,
    onMigrate,
    migrating,
    pendingMigrationHash,
    isMigrationPending
  }
}
export default useMigrateState
