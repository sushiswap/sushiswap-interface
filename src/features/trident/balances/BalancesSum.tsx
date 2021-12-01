import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, NATIVE, Token, ZERO } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import SumUSDCValues from 'app/features/trident/SumUSDCValues'
import { useActiveWeb3React } from 'app/services/web3'
import { useBentoBalances } from 'app/state/bentobox/hooks'
import { useAllTokenBalances, useCurrencyBalance } from 'app/state/wallet/hooks'
import React, { FC, useMemo } from 'react'

export const LiquidityPositionsBalancesSum = () => {
  return <_BalancesSum amounts={[]} />
}

export const BentoBalancesSum = () => {
  const { chainId } = useActiveWeb3React()
  const bentoBalances = useBentoBalances()
  const balances = useMemo(
    () =>
      chainId
        ? bentoBalances.map(({ address, decimals, name, symbol, balance }) => {
            const token = new Token(chainId, address, decimals, symbol, name)
            return CurrencyAmount.fromRawAmount(token, balance)
          })
        : [],
    [bentoBalances, chainId]
  )

  return <_BalancesSum amounts={balances} />
}

export const WalletBalancesSum = () => {
  const { chainId, account } = useActiveWeb3React()
  const tokenBalances = useAllTokenBalances()
  const ethBalance = useCurrencyBalance(account ? account : undefined, chainId ? NATIVE[chainId] : undefined)
  const amounts = useMemo(() => {
    const res = Object.values(tokenBalances).reduce<CurrencyAmount<Currency>[]>((acc, cur) => {
      if (cur.greaterThan(ZERO)) acc.push(cur)

      return acc
    }, [])

    if (ethBalance) {
      res.push(ethBalance)
    }
    return res
  }, [tokenBalances, ethBalance])

  return <_BalancesSum amounts={amounts} />
}

interface BalancesSumProps {
  amounts: (CurrencyAmount<Currency> | undefined)[]
}

const _BalancesSum: FC<BalancesSumProps> = ({ amounts }) => {
  const { i18n } = useLingui()

  return (
    <SumUSDCValues amounts={amounts}>
      {({ amount }) => {
        return (
          <div className="flex border border-dark-700 bg-dark-900 rounded divide-x divide-dark-700">
            <div className="flex flex-col py-2 px-4 w-6/12">
              <Typography variant="sm">{i18n._(t`Total Value`)}</Typography>
              <Typography variant="lg" className="text-high-emphesis" weight={700}>
                ${amount ? amount.toExact({}) : '0.00'}
              </Typography>
            </div>
            <div className="flex flex-col py-2 px-4 w-6/12">
              <Typography variant="sm">{i18n._(t`Number of Assets`)}</Typography>
              <Typography variant="lg" className="text-high-emphesis" weight={700}>
                {amounts.length}
              </Typography>
            </div>
          </div>
        )
      }}
    </SumUSDCValues>
  )
}
