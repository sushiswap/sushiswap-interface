import { useTridentAddLiquidityPageContext, useTridentAddLiquidityPageState } from './context'
import AssetInput from '../../../components/AssetInput'
import React, { useState } from 'react'
import DepositButtons from './DepositButtons'

const ClassicStandardMode = () => {
  const { inputAmounts } = useTridentAddLiquidityPageState()
  const { pool, handleInput } = useTridentAddLiquidityPageContext()
  const [fromBento, setFromBento] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-4 px-5">
        <AssetInput
          key={pool.tokens[0].address}
          value={inputAmounts[pool.tokens[0].address]}
          currency={pool.tokens[0]}
          onChange={(val) => handleInput(val, pool.tokens[0].address)}
          headerRight={<AssetInput.WalletSwitch onChange={setFromBento} checked={fromBento} />}
        />
        <AssetInput
          key={pool.tokens[1].address}
          value={inputAmounts[pool.tokens[1].address]}
          currency={pool.tokens[1]}
          onChange={(val) => handleInput(val, pool.tokens[1].address)}
        />
      </div>

      {/*TODO implement max*/}
      <div className="flex flex-col px-5">
        <DepositButtons inputValid={Object.values(inputAmounts).every((el) => +el > 0)} isMaxInput={false} />
      </div>
    </div>
  )
}

export default ClassicStandardMode
