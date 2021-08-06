import Alert from '../../../components/Alert'
import { t } from '@lingui/macro'
import Button from '../../../components/Button'
import { useTridentAddLiquidityPageDispatch, useTridentAddLiquidityPageState } from './context'
import { ActionType } from './context/types'
import { useLingui } from '@lingui/react'
import Typography from '../../../components/Typography'
import ListPanel from '../../../components/ListPanel'
import AssetInput from '../../../components/AssetInput'
import { Currency } from '@sushiswap/sdk'
import { useTokenBalance } from '../../../state/wallet/hooks'
import { useActiveWeb3React } from '../../../hooks'

const ZapMode = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const { currencies, inputAmounts } = useTridentAddLiquidityPageState()
  const dispatch = useTridentAddLiquidityPageDispatch()
  const balance = useTokenBalance(account, currencies[0])

  const handleInput = (amount: string) => {
    dispatch({
      type: ActionType.SET_INPUT_AMOUNT,
      payload: {
        position: 0,
        amount,
      },
    })
  }

  const handleSelect = (currency: Currency) => {
    dispatch({
      type: ActionType.SET_CURRENCY,
      payload: {
        position: 0,
        currency,
      },
    })
  }

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
        <Button color={inputAmounts[0] ? 'gradient' : 'gray'} disabled={!inputAmounts[0]} className="font-bold text-sm">
          {inputAmounts[0] ? i18n._(t`Confirm Deposit`) : i18n._(t`Select token & enter amount`)}
        </Button>
      </div>
      <div className="flex flex-col gap-4 px-5 mt-10">
        <Typography weight={700} className="text-high-emphesis">
          {inputAmounts[0]
            ? i18n._(t`Your ${currencies[0]} will be split into:`)
            : i18n._(t`Your selected token will be split into:`)}
        </Typography>
        <ListPanel
          items={[
            <ListPanel.Item left={<span />} right={<span />} key={0} />,
            <ListPanel.Item left={<span />} right={<span />} key={1} />,
          ]}
        />
      </div>
    </>
  )
}

export default ZapMode
