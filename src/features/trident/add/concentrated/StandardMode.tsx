import React, { FC } from 'react'
import AssetInput from '../../../../components/AssetInput'
import DepositButtons from '../DepositButtons'
import TransactionDetails from '../TransactionDetails'
import { ZERO } from '@sushiswap/sdk'
import useSufficientBalances from '../../../../hooks/useSufficientBalances'
import { useTridentAddConcentratedContext, useTridentAddConcentratedState } from './context'

const StandardMode: FC = () => {
  const { inputAmounts, spendFromWallet } = useTridentAddConcentratedState()
  const { currencies, handleInput, parsedInputAmounts, showReview, setSpendFromWallet } =
    useTridentAddConcentratedContext()
  const sufficientBalances = useSufficientBalances(parsedInputAmounts, spendFromWallet)

  // TODO
  const onMax = () => {}
  const isMaxInput = false

  const validInputs = sufficientBalances && Object.values(parsedInputAmounts).every((el) => el?.greaterThan(ZERO))
  const [addressA, addressB] = Object.keys(currencies)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 px-5">
        <AssetInput
          value={inputAmounts[addressA]}
          currency={currencies[addressA]}
          onChange={(val) => handleInput(val, addressA)}
          headerRight={<AssetInput.WalletSwitch onChange={setSpendFromWallet} checked={spendFromWallet} />}
          spendFromWallet={spendFromWallet}
        />
        <AssetInput
          value={inputAmounts[addressB]}
          currency={currencies[addressB]}
          onChange={(val) => handleInput(val, addressB)}
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

export default StandardMode
