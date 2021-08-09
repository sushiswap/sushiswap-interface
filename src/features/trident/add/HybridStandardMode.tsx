import { FC, useMemo } from 'react'
import Typography from '../../../components/Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import { useTokenBalances } from '../../../state/wallet/hooks'
import { useActiveWeb3React } from '../../../hooks'
import CurrencyLogo from '../../../components/CurrencyLogo'
import { useTridentAddLiquidityPageContext } from './context'
import { Token } from '@sushiswap/sdk'
import { classNames } from '../../../functions'

const TokenTile = ({ token, disabled = false }: { token: Token; disabled?: boolean }) => {
  return (
    <div
      className={classNames(
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        'flex flex-col border border-dark-700 bg-dark-900 rounded p-3 items-center justify-center gap-2'
      )}
    >
      <div className="w-[38px] rounded-full overflow-hidden">
        <CurrencyLogo currency={token} size={38} />
      </div>
      <Typography variant="lg" className="text-high-emphesis">
        {token.symbol}
      </Typography>
    </div>
  )
}

const HybridStandardMode: FC = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { pool } = useTridentAddLiquidityPageContext()
  const balances = useTokenBalances(account, pool.tokens)
  const availableAssets = useMemo(
    () =>
      Object.values(balances)
        .sort((a, b) => (a.lessThan(b.quotient) ? -1 : 1))
        .filter((el) => el.greaterThan('0')),
    [balances]
  )

  const unavailableAssets = useMemo(
    () => pool.tokens.filter((token) => !availableAssets.some((balance) => balance.currency === token)),
    [pool.tokens, availableAssets]
  )

  return (
    <div className="flex flex-col mt-8 px-5 gap-8">
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <Typography variant="lg" weight={700} className="text-high-emphesis">
            {i18n._(t`Available Assets`)}
          </Typography>
          <Typography variant="lg" weight={700} className="text-high-emphesis">
            <span className="text-blue">{availableAssets.length}</span>/{pool.tokens.length}
          </Typography>
        </div>

        <Typography variant="sm" className="text-high-emphesis mt-3">
          {i18n._(t`You have balances of each of the following assets, ordered from greatest to least amount. Tap to toggle which
        ones you would like to deposit`)}
        </Typography>
        <div className="grid grid-cols-4 mt-6 gap-4">
          {availableAssets.map((balance, index) => (
            <TokenTile token={balance.currency} key={index} />
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <Typography variant="lg" weight={700} className="text-high-emphesis">
            {i18n._(t`Unavailable Assets`)}
          </Typography>
          <Typography variant="lg" weight={700} className="text-high-emphesis">
            <span className="text-secondary">{unavailableAssets.length}</span>/{pool.tokens.length}
          </Typography>
        </div>

        <div className="grid grid-cols-4 mt-6 gap-4">
          {unavailableAssets.map((token, index) => (
            <TokenTile token={token} key={index} disabled />
          ))}
        </div>
      </div>
    </div>
  )
}

export default HybridStandardMode
