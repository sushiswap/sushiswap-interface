import Alert from '../../../components/Alert'
import { t } from '@lingui/macro'
import Button from '../../../components/Button'
import { useTridentAddLiquidityPageContext, useTridentAddLiquidityPageState } from './context'
import { ActionType } from './context/types'
import { useLingui } from '@lingui/react'
import Typography from '../../../components/Typography'
import ListPanel from '../../../components/ListPanel'
import AssetInput from '../../../components/AssetInput'
import { Currency } from '@sushiswap/sdk'
import { useTokenBalance } from '../../../state/wallet/hooks'
import { useActiveWeb3React } from '../../../hooks'
import ZapModeTransactionDetails from './ZapModeTransactionDetails'
import React, { useCallback } from 'react'
import ZapModeTransactionReviewModal from './ZapModeTransactionReviewModal'
import { tryParseAmount } from '../../../functions'
import { useUSDCValue } from '../../../hooks/useUSDCPrice'

const ZapMode = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const { currencies, inputAmounts } = useTridentAddLiquidityPageState()
  const { pool, dispatch } = useTridentAddLiquidityPageContext()
  const balance = useTokenBalance(account, currencies[0])
  const usdcValue = useUSDCValue(tryParseAmount(inputAmounts[0], currencies[0]))

  const handleInput = useCallback(
    (amount: string) => {
      dispatch({
        type: ActionType.SET_INPUT_AMOUNT,
        payload: {
          position: 0,
          amount,
        },
      })
    },
    [dispatch]
  )

  const handleSelect = useCallback(
    (currency: Currency) => {
      dispatch({
        type: ActionType.SET_CURRENCY,
        payload: {
          position: 0,
          currency,
        },
      })
    },
    [dispatch]
  )

  const handleClick = useCallback(() => {
    dispatch({
      type: ActionType.SHOW_ZAP_REVIEW,
      payload: true,
    })
  }, [dispatch])

  return (
    <>
      <div className="px-5 mt-5">
        <Alert
          dismissable={false}
          type="information"
          showIcon
          message={i18n._(t`In Zap mode, your selected asset will be split and rebalanced into the corresponding tokens and their weights
          automatically.`)}
        />
      </div>
      <div className="flex flex-col gap-4 px-5">
        <AssetInput
          value={inputAmounts[0]}
          currency={currencies[0]}
          onChange={handleInput}
          onSelect={handleSelect}
          onMax={() => handleInput(balance?.toExact())}
        />
        <Button
          color={inputAmounts[0] ? 'gradient' : 'gray'}
          disabled={!inputAmounts[0]}
          className="font-bold text-sm"
          onClick={handleClick}
        >
          {inputAmounts[0] ? i18n._(t`Confirm Deposit`) : i18n._(t`Select token & enter amount`)}
        </Button>
      </div>
      <div className="flex flex-col gap-4 px-5 mt-10">
        <Typography weight={700} className="text-high-emphesis">
          {currencies[0]
            ? i18n._(t`Your ${currencies[0].symbol} will be split into:`)
            : i18n._(t`Your selected token will be split into:`)}
        </Typography>
        <ListPanel
          items={pool.tokens.map((token, index) => (
            <ListPanel.Item
              left={<ListPanel.Item.Left amount={tryParseAmount(inputAmounts[0], token)} />}
              right={<ListPanel.Item.Right>${usdcValue?.divide(pool.tokens.length)?.toFixed(2)}</ListPanel.Item.Right>}
              key={index}
            />
          ))}
        />
      </div>
      <ZapModeTransactionDetails />
      <ZapModeTransactionReviewModal />
    </>
  )
}

export default ZapMode
