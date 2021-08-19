import AssetInput from '../../../../components/AssetInput'
import React, { useCallback } from 'react'
import DepositButtons from './../DepositButtons'
import useSufficientBalances from '../../../../hooks/useSufficientBalances'
import { ZERO } from '@sushiswap/sdk'
import TransactionDetails from './../TransactionDetails'
import { useTridentAddClassicContext, useTridentAddClassicState } from './context'
import { ActionType } from '../../types'

const ClassicStandardMode = () => {
  const { inputAmounts, spendFromWallet } = useTridentAddClassicState()
  const { pool, handleInput, dispatch, parsedInputAmounts, showReview } = useTridentAddClassicContext()
  const sufficientBalances = useSufficientBalances(parsedInputAmounts, spendFromWallet)
  const validInputs = sufficientBalances && Object.values(parsedInputAmounts).every((el) => el?.greaterThan(ZERO))

  const setSpendFromWallet = useCallback(
    (checked) => {
      dispatch({
        type: ActionType.SET_SPEND_FROM_WALLET,
        payload: checked,
      })
    },
    [dispatch]
  )

  // TODO
  const onMax = () => {}
  const isMaxInput = false

  return (
    <div className="flex flex-col gap-6">
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

        <div className="flex flex-col">
          <DepositButtons
            inputValid={validInputs}
            onMax={onMax}
            isMaxInput={isMaxInput}
            onClick={() => showReview(true)}
          />
        </div>
      </div>
      {validInputs && (
        <div className="flex flex-col px-5">
          <TransactionDetails />
        </div>
      )}
    </div>
  )
}

export default ClassicStandardMode
