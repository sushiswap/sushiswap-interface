import React, { FC, useCallback, useMemo, useState } from 'react'
import { Currency } from '@sushiswap/core-sdk'
import Button from '../Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import Typography from '../Typography'
import { useLingui } from '@lingui/react'
import CurrencyLogo from '../CurrencyLogo'
import { useActiveWeb3React } from '../../hooks'
import { useAllTokenBalances, useCurrencyBalances, useTokenBalance } from '../../state/wallet/hooks'
import { useAllTokens, useToken } from '../../hooks/Tokens'
import loadingCircle from '../../animation/loading-circle.json'
import Lottie from 'lottie-react'
import { isValidAddress } from '@walletconnect/utils'

interface ProvidedCurrenciesProps {
  currencies: Currency[]
  handleSelect: (x: Currency) => void
}

const ProvidedCurrencies: FC<ProvidedCurrenciesProps> = ({ currencies, handleSelect }) => {
  const { account } = useActiveWeb3React()
  const balances = useCurrencyBalances(account, currencies)

  return (
    <>
      {balances.map((balance, index) => (
        <div
          className="flex justify-between items-center p-5 cursor-pointer"
          onClick={() => balance && handleSelect(balance.currency)}
          key={index}
        >
          <div className="flex items-center gap-1.5">
            <div className="rounded-full overflow-hidden">
              <CurrencyLogo currency={balance?.currency} size={24} />
            </div>
            <Typography variant="sm" className="text-high-emphesis" weight={700}>
              {balance?.currency.symbol}
            </Typography>
          </div>
          <Typography variant="sm" className="text-high-emphesis" weight={700}>
            {balance?.toSignificant(6)}
          </Typography>
        </div>
      ))}
    </>
  )
}

interface AllCurrenciesProps {
  handleSelect: (x: Currency) => void
  search: string
}

const AllCurrencies: FC<AllCurrenciesProps> = ({ handleSelect, search }) => {
  const { account } = useActiveWeb3React()
  const balances = useAllTokenBalances()
  const tokens = useAllTokens()

  const valid = isValidAddress(search)
  const token = useToken(valid ? search : undefined)
  const customBalance = useTokenBalance(account, token ? token : undefined)

  // Create a lightweight arr for searching
  const tokensArr = useMemo(() => {
    return Object.entries(tokens).map(([k, v]) => `${k}-${v.symbol}`)
  }, [tokens])

  const items = useMemo(() => {
    return tokensArr.filter((el) => (search ? el.toLowerCase().includes(search) : el))
  }, [search, tokensArr])

  return (
    <>
      {token && (
        <div className="flex justify-between items-center px-5 py-3 cursor-pointer" onClick={() => handleSelect(token)}>
          <div className="flex items-center gap-1.5">
            <div className="rounded-full overflow-hidden">
              <CurrencyLogo currency={token} size={24} />
            </div>
            <Typography variant="sm" className="text-high-emphesis" weight={700}>
              {token.symbol}
            </Typography>
          </div>
          <Typography variant="sm" className="text-high-emphesis" weight={700}>
            {customBalance ? customBalance.toSignificant(6) : '0.000'}
          </Typography>
        </div>
      )}
      {items.map((tokenString, index) => {
        const [address, symbol] = tokenString.split('-')
        return (
          <div
            className="flex justify-between items-center px-5 py-3 cursor-pointer"
            onClick={() => handleSelect(tokens[address])}
            key={index}
          >
            <div className="flex items-center gap-1.5">
              <div className="rounded-full overflow-hidden">
                <CurrencyLogo currency={tokens[address]} size={24} />
              </div>
              <Typography variant="sm" className="text-high-emphesis" weight={700}>
                {symbol}
              </Typography>
            </div>
            <Typography variant="sm" className="text-high-emphesis" weight={700}>
              {balances ? (
                balances[address] ? (
                  balances[address].toSignificant(6)
                ) : (
                  '0.000'
                )
              ) : (
                <Lottie animationData={loadingCircle} autoplay loop className="w-5 h-5" />
              )}
            </Typography>
          </div>
        )
      })}
    </>
  )
}

interface CurrencySelectDialogProps {
  currency: Currency
  onChange: (x: Currency) => void
  onDismiss: () => void
  currencies?: Currency[]
}

const CurrencySelectDialog: FC<CurrencySelectDialogProps> = ({ currency, currencies = [], onChange, onDismiss }) => {
  const [search, setSearch] = useState<string>()
  const { i18n } = useLingui()

  const handleSelect = useCallback(
    async (x: Currency) => {
      await onChange(x)
      await onDismiss()
      setSearch(null)
    },
    [onChange, onDismiss, setSearch]
  )

  return (
    <div className="bg-dark-900 h-full">
      <div className="relative">
        <div className="pointer-events-none absolute w-full h-full bg-gradient-to-r from-opaque-blue to-opaque-pink opacity-20" />
        <div className="p-5 flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <Button
              color="blue"
              variant="outlined"
              size="sm"
              className="rounded-full py-1 pl-2 cursor-pointer"
              startIcon={<ChevronLeftIcon width={24} height={24} />}
              onClick={onDismiss}
            >
              {i18n._(t`Back`)}
            </Button>
          </div>
          <Typography variant="h2" weight={700} className="text-high-emphesis">
            {i18n._(t`Select a Token`)}
          </Typography>
          {currencies.length === 0 && (
            <div className="rounded border border-gradient-r-blue-pink-dark-1000 border-transparent">
              <input
                value={search || ''}
                onChange={(e) => e.target.value.length > 0 && setSearch(e.target.value.toLowerCase())}
                className="bg-transparent font-bold h-[54px] w-full px-5"
                placeholder={i18n._(t`Select name or paste address`)}
              />
            </div>
          )}
        </div>
      </div>
      {currencies.length > 0 ? (
        <ProvidedCurrencies currencies={currencies} handleSelect={handleSelect} />
      ) : (
        <AllCurrencies handleSelect={handleSelect} search={search} />
      )}
    </div>
  )
}

export default CurrencySelectDialog
