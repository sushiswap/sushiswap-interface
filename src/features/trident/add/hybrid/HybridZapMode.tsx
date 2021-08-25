import Alert from '../../../../components/Alert'
import { t } from '@lingui/macro'
import Button from '../../../../components/Button'
import { useLingui } from '@lingui/react'
import Typography from '../../../../components/Typography'
import ListPanel from '../../../../components/ListPanel'
import AssetInput from '../../../../components/AssetInput'
import { Token } from '@sushiswap/sdk'
import TransactionDetails from '../TransactionDetails'
import React from 'react'
import { HybridPoolContext, HybridPoolState } from './context/types'
import { useTridentContext, useTridentState } from '../../context'

const HybridZapMode = () => {
  const { i18n } = useLingui()
  const { inputAmounts, inputTokenAddress } = useTridentState<HybridPoolState>()
  const { pool, tokens, handleInput, showReview, parsedOutputAmounts, selectInputToken } =
    useTridentContext<HybridPoolContext>()

  return (
    <div className="flex flex-col gap-6 px-5">
      <Alert
        dismissable={false}
        type="information"
        showIcon
        message={i18n._(t`In Zap mode, your selected asset will be split and rebalanced into the corresponding tokens and their weights
          automatically.`)}
      />
      <div className="flex flex-col gap-5">
        <AssetInput
          value={inputAmounts[inputTokenAddress]}
          currency={tokens[inputTokenAddress]}
          onChange={(value) => handleInput(value, inputTokenAddress, { clear: true })}
          onSelect={(token: Token) => selectInputToken(token.address)}
        />
        <Button
          color={inputAmounts[inputTokenAddress] ? 'gradient' : 'gray'}
          disabled={!inputAmounts[inputTokenAddress]}
          className="font-bold text-sm"
          onClick={() => showReview(true)}
        >
          {inputAmounts[inputTokenAddress] ? i18n._(t`Confirm Deposit`) : i18n._(t`Select token & enter amount`)}
        </Button>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <Typography weight={700} className="text-high-emphesis">
          {tokens[inputTokenAddress]
            ? i18n._(t`Your ${tokens[inputTokenAddress].symbol} will be split into:`)
            : i18n._(t`Your selected token will be split into:`)}
        </Typography>
        <ListPanel
          items={pool.tokens.map((token, index) => (
            <ListPanel.CurrencyAmountItem amount={parsedOutputAmounts[token.address]} key={index} />
          ))}
        />
      </div>
      <TransactionDetails />
    </div>
  )
}

export default HybridZapMode
