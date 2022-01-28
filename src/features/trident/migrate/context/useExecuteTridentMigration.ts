import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { approveSLPAction, batchAction } from 'app/features/trident/actions'
import { selectTridentMigrations, setMigrationTxHash } from 'app/features/trident/migrate/context/migrateSlice'
import { tridentMigrateAction } from 'app/features/trident/migrate/context/tridentMigrateAction'
import { useTridentMigrationContract, useTridentRouterContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { USER_REJECTED_TX, WalletError } from 'app/services/web3/WalletError'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useTokenBalances } from 'app/state/wallet/hooks'

export const useExecuteTridentMigration = () => {
  const { i18n } = useLingui()
  const { library, account } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const addTransaction = useTransactionAdder()

  const migrationContract = useTridentMigrationContract()
  const router = useTridentRouterContract()
  const selectedMigrations = useAppSelector(selectTridentMigrations)

  const lpTokenAmounts = useTokenBalances(
    account ?? undefined,
    selectedMigrations.map((m) => m.v2Pair.liquidityToken)
  )

  return async () => {
    if (!account || !library || !migrationContract || !router || !Object.keys(lpTokenAmounts).length) {
      throw new Error('missing dependencies')
    }

    const approvalActions = selectedMigrations
      .filter((m) => m.slpPermit)
      .map((m) => approveSLPAction({ router, signatureData: m.slpPermit }))
    const migrateActions = selectedMigrations.map((m) =>
      tridentMigrateAction(migrationContract, m, lpTokenAmounts[m.v2Pair.liquidityToken.address])
    )

    try {
      const tx = await library.getSigner().sendTransaction({
        from: account,
        to: migrationContract.address,
        data: batchAction({
          contract: migrationContract,
          actions: [...approvalActions, ...migrateActions],
        }),
        value: '0x0',
      })

      dispatch(setMigrationTxHash(tx.hash))
      addTransaction(tx, { summary: i18n._(t`Migrating ${selectedMigrations.length} LP tokens`) })
    } catch (error) {
      if (error instanceof WalletError && error.code !== USER_REJECTED_TX) {
        console.error(error)
      }
    }
  }
}
