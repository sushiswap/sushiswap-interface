import { AddressZero } from '@ethersproject/constants'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, NATIVE, ZERO } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import SumUSDCValues from 'app/features/trident/SumUSDCValues'
import { useTridentLiquidityPositions } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import { useBentoBalancesV2 } from 'app/state/bentobox/hooks'
import { useAllTokenBalances, useCurrencyBalance } from 'app/state/wallet/hooks'
import React, { FC, useMemo } from 'react'

export const LiquidityPositionsBalancesSum = () => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()

  const { data: positions } = useTridentLiquidityPositions({
    chainId,
    variables: { where: { user: account?.toLowerCase(), balance_gt: 0 } },
    shouldFetch: !!chainId && !!account,
  })

  const sum = positions?.reduce((acc, cur) => acc + cur.value, 0)

  return (
    <div className="flex gap-14">
      <div className="flex flex-col gap-1">
        <Typography variant="sm">{i18n._(t`Total Value`)}</Typography>
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          ${sum?.toFixed(2) || '0.00'}
        </Typography>
      </div>
      <div className="flex flex-col gap-1">
        <Typography variant="sm">{i18n._(t`Number of Assets`)}</Typography>
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          {positions?.length}
        </Typography>
      </div>
    </div>
  )
}

const useWalletBalances = () => {
  const { chainId, account } = useActiveWeb3React()
  const tokenBalances = useAllTokenBalances()
  // @ts-ignore TYPE NEEDS FIXING
  const ethBalance = useCurrencyBalance(account ? account : undefined, chainId ? NATIVE[chainId] : undefined)
  return useMemo(() => {
    const res: CurrencyAmount<Currency>[] = Object.values(tokenBalances).filter((cur) => cur.greaterThan(ZERO))

    if (ethBalance) {
      res.push(ethBalance)
    }
    return res
  }, [tokenBalances, ethBalance])
}

export const BalancesSum = () => {
  const walletBalances = useWalletBalances()
  const bentoBalances = useBentoBalancesV2()
  const balances = useMemo(() => {
    return Object.values(
      [...walletBalances, ...bentoBalances].reduce<Record<string, CurrencyAmount<Currency>>>((acc, cur) => {
        if (cur.currency.isNative) {
          if (acc[AddressZero]) acc[AddressZero] = acc[AddressZero].add(cur)
          else acc[AddressZero] = cur
        } else if (acc[cur.currency.wrapped.address]) {
          acc[cur.currency.wrapped.address] = acc[cur.currency.wrapped.address].add(cur)
        } else {
          acc[cur.currency.wrapped.address] = cur
        }

        return acc
      }, {})
    )
  }, [bentoBalances, walletBalances])

  return <_BalancesSum amounts={balances} />
}

interface BalancesSumProps {
  amounts: (CurrencyAmount<Currency> | undefined)[]
}

const _BalancesSum: FC<BalancesSumProps> = ({ amounts }) => {
  const { i18n } = useLingui()

  return (
    <SumUSDCValues amounts={amounts}>
      {({ amount }) => (
        <div className="flex gap-14">
          <div className="flex flex-col gap-1">
            <Typography variant="sm">{i18n._(t`Total Value`)}</Typography>
            <Typography variant="lg" weight={700} className="text-high-emphesis">
              ${amount ? amount.toExact() : '0.00'}
            </Typography>
          </div>
          <div className="flex flex-col gap-1">
            <Typography variant="sm">{i18n._(t`Assets`)}</Typography>
            <Typography variant="lg" weight={700} className="text-high-emphesis">
              {amounts.length}
            </Typography>
          </div>
        </div>
      )}
    </SumUSDCValues>
  )
}
