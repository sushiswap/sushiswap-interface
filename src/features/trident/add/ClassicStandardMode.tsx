import { useTridentAddLiquidityPageContext, useTridentAddLiquidityPageState } from './context'
import AssetInput from '../../../components/AssetInput'
import React, { useCallback } from 'react'
import DepositButtons from './DepositButtons'
import { ActionType } from './context/types'

const ClassicStandardMode = () => {
  const { inputAmounts, spendFromWallet } = useTridentAddLiquidityPageState()
  const { pool, handleInput, dispatch } = useTridentAddLiquidityPageContext()

  const setSpendFromWallet = useCallback(
    (checked) => {
      dispatch({
        type: ActionType.SET_SPEND_FROM_WALLET,
        payload: checked,
      })
    },
    [dispatch]
  )

  return (
    <div className="flex flex-col gap-4 px-5">
      <AssetInput
        key={pool.tokens[0].address}
        value={inputAmounts[pool.tokens[0].address]}
        currency={pool.tokens[0]}
        onChange={(val) => handleInput(val, pool.tokens[0].address)}
        headerRight={<AssetInput.WalletSwitch onChange={setSpendFromWallet} checked={spendFromWallet} />}
        spendFromWallet={spendFromWallet}
      />
      <AssetInput
        key={pool.tokens[1].address}
        value={inputAmounts[pool.tokens[1].address]}
        currency={pool.tokens[1]}
        onChange={(val) => handleInput(val, pool.tokens[1].address)}
        spendFromWallet={spendFromWallet}
      />
      {/*TODO implement max*/}
      <div className="flex flex-col">
        <DepositButtons inputValid={Object.values(inputAmounts).every((el) => +el > 0)} isMaxInput={false} />
      </div>
    </div>
  )
}

export default ClassicStandardMode
