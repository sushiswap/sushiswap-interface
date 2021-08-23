import AssetInput from '../../../../components/AssetInput'
import React from 'react'
import DepositButtons from './../DepositButtons'
import useSufficientBalances from '../../../../hooks/useSufficientBalances'
import { ZERO } from '@sushiswap/sdk'
import TransactionDetails from './../TransactionDetails'
import { useTridentAddContext, useTridentAddState } from '../../context'
import { WeightedPoolContext, WeightedPoolState } from './context/types'

const WeightedStandardMode = () => {
  const { inputAmounts, spendFromWallet } = useTridentAddState<WeightedPoolState>()
  const { pool, handleInput, parsedInputAmounts, showReview, setSpendFromWallet } =
    useTridentAddContext<WeightedPoolContext>()
  const sufficientBalances = useSufficientBalances(parsedInputAmounts, spendFromWallet)
  const validInputs = sufficientBalances && Object.values(parsedInputAmounts).every((el) => el?.greaterThan(ZERO))

  // TODO
  const onMax = () => {}
  const isMaxInput = false

  // TODO Fixture
  const weights = {
    [pool.tokens[0].address]: '70%',
    [pool.tokens[1].address]: '30%',
  }

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
          chip={weights[pool.tokens[0].address]}
        />
        <AssetInput
          key={pool.tokens[1].address}
          value={inputAmounts[pool.tokens[1].address]}
          currency={pool.tokens[1]}
          onChange={(val) => handleInput(val, pool.tokens[1].address)}
          spendFromWallet={spendFromWallet}
          chip={weights[pool.tokens[1].address]}
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

export default WeightedStandardMode
