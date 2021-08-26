import AssetInput from '../../../../components/AssetInput'
import React from 'react'
import DepositButtons from './../DepositButtons'
import TransactionDetails from './../TransactionDetails'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import {
  currenciesAtom,
  formattedAmountsSelector,
  inputFieldAtom,
  mainInputAtom,
  noLiquiditySelector,
  parsedAmountsSelector,
  secondaryInputSelector,
  spendFromWalletAtom,
} from './context/atoms'
import { Field } from '../../../../state/trident/add/classic'
import { useApproveCallback, useRouterContract } from '../../../../hooks'

const ClassicStandardMode = () => {
  const parsedAmounts = useRecoilValue(parsedAmountsSelector)
  const formattedAmounts = useRecoilValue(formattedAmountsSelector)
  const setInputField = useSetRecoilState(inputFieldAtom)
  const currencies = useRecoilValue(currenciesAtom)
  const setMainInput = useSetRecoilState(mainInputAtom)
  const setSecondaryInput = useSetRecoilState(secondaryInputSelector)
  const [spendFromWallet, setSpendFromWallet] = useRecoilState(spendFromWalletAtom)
  const noLiquidity = useRecoilValue(noLiquiditySelector)

  const router = useRouterContract()
  const [approveA, approveACallback] = useApproveCallback(parsedAmounts[0], router?.address)
  const [approveB, approveBCallback] = useApproveCallback(parsedAmounts[1], router?.address)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 px-5">
        <AssetInput
          value={formattedAmounts[0]}
          currency={currencies[0]}
          onChange={(val) => {
            setInputField(Field.CURRENCY_A)
            setMainInput(val)
          }}
          headerRight={
            <AssetInput.WalletSwitch onChange={() => setSpendFromWallet(!spendFromWallet)} checked={spendFromWallet} />
          }
          spendFromWallet={spendFromWallet}
        />
        <AssetInput
          value={formattedAmounts[1]}
          currency={currencies[1]}
          onChange={(val) => {
            setInputField(Field.CURRENCY_B)
            setSecondaryInput(val)
          }}
          spendFromWallet={spendFromWallet}
        />

        <div className="flex flex-col">
          <DepositButtons inputValid={true} onMax={() => {}} isMaxInput={false} onClick={() => {}} />
        </div>
      </div>
      {true && (
        <div className="flex flex-col px-5">
          <TransactionDetails />
        </div>
      )}
    </div>
  )
}

export default ClassicStandardMode
