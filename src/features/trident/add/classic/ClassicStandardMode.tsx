import AssetInput from '../../../../components/AssetInput'
import React from 'react'
import DepositButtons from './../DepositButtons'
import useSufficientBalances from '../../../../hooks/useSufficientBalances'
import { ZERO } from '@sushiswap/sdk'
import TransactionDetails from './../TransactionDetails'
import { ClassicPoolContext, ClassicPoolState } from './context/types'
import { useTridentAddContext, useTridentAddState } from '../../context'

const ClassicStandardMode = () => {
  const { inputAmounts, spendFromWallet } = useTridentAddState<ClassicPoolState>()
  const { pool, handleInput, parsedInputAmounts, showReview, setSpendFromWallet } =
    useTridentAddContext<ClassicPoolContext>()
  const sufficientBalances = useSufficientBalances(parsedInputAmounts, spendFromWallet)
  const validInputs = sufficientBalances && Object.values(parsedInputAmounts).every((el) => el?.greaterThan(ZERO))

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
