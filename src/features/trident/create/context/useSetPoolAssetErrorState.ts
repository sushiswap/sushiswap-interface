import { ZERO } from '@sushiswap/core-sdk'
import { useBentoOrWalletBalance } from 'app/hooks/useBentoOrWalletBalance'
import { useActiveWeb3React } from 'app/services/web3'
import { useEffect, useMemo } from 'react'
import { SetterOrUpdater } from 'recoil'

import { SelectAssetError, SelectedAsset, SpendSource } from './SelectedAsset'

const setError = (asset: SelectedAsset, setAsset: SetterOrUpdater<SelectedAsset>, error?: SelectAssetError) => {
  if (asset.error !== error) {
    setAsset(new SelectedAsset({ ...asset, error }))
  }
}

export const useSetPoolAssetErrorState = (asset: SelectedAsset, setAsset: SetterOrUpdater<SelectedAsset>) => {
  const { account } = useActiveWeb3React()
  const balance = useBentoOrWalletBalance(
    account ?? undefined,
    asset.currency,
    asset.spendFromSource === SpendSource.WALLET
  )

  const insufficientBalance = useMemo(() => {
    return balance && asset.parsedAmount ? balance.lessThan(asset.parsedAmount) : false
  }, [asset.parsedAmount, balance])

  useEffect(() => {
    if (!account) {
      setError(asset, setAsset, SelectAssetError.ACCOUNT_NOT_CONNECTED)
    } else if (asset.amountInteractedWith && !asset.parsedAmount?.greaterThan(ZERO)) {
      setError(asset, setAsset, SelectAssetError.NO_AMOUNT_CHOSEN)
    } else if (insufficientBalance) {
      setError(asset, setAsset, SelectAssetError.INSUFFICIENT_BALANCE)
    } else if (asset.error) {
      setError(asset, setAsset, undefined)
    }
  }, [account, asset, insufficientBalance, setAsset])
}
