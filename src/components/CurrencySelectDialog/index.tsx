import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, NATIVE } from '@sushiswap/core-sdk'
import { isValidAddress } from '@walletconnect/utils'
import loadingCircle from 'app/animation/loading-circle.json'
import Button from 'app/components/Button'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import { useAllTokens, useToken } from 'app/hooks/Tokens'
import { useTokenComparator } from 'app/modals/SearchModal/sorting'
import { useActiveWeb3React } from 'app/services/web3/hooks'
import { useAllTokenBalances, useCurrencyBalance, useCurrencyBalances, useTokenBalance } from 'app/state/wallet/hooks'
import Lottie from 'lottie-react'
import React, { FC, useCallback, useMemo, useState } from 'react'

interface ProvidedCurrenciesProps {
  currencies: Currency[]
  handleSelect: (x: Currency) => void
}

const ProvidedCurrencies: FC<ProvidedCurrenciesProps> = ({ currencies, handleSelect }) => {
  const { account } = useActiveWeb3React()
  const balances = useCurrencyBalances(account ? account : undefined, currencies)

  return (
    <div className="h-full overflow-y-auto">
      {balances.map((balance, index) => (
        <div
          className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-dark-800 hover:border-dark-1000"
          onClick={() => balance && handleSelect(balance.currency)}
          key={index}
        >
          <div className="flex items-center gap-1.5">
            <div className="overflow-hidden rounded-full">
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
    </div>
  )
}

interface AllCurrenciesProps {
  handleSelect: (x: Currency) => void
  search?: string
}

const AllCurrencies: FC<AllCurrenciesProps> = ({ handleSelect, search }) => {
  const { account, chainId } = useActiveWeb3React()
  const balances = useAllTokenBalances()
  const tokens = useAllTokens()

  const token = useToken(isValidAddress(search || '') ? (search as string) : undefined)
  const customBalance = useTokenBalance(account ? account : undefined, token ? token : undefined)
  const ethBalance = useCurrencyBalance(account ? account : undefined, chainId ? NATIVE[chainId] : undefined)

  const tokenComparator = useTokenComparator()

  // Create a lightweight arr for searching
  const tokensArr = useMemo(() => {
    if (!chainId) return []

    return Object.values(tokens)
      .sort(tokenComparator)
      .map((token) => `${token.address}-${token.symbol}`)
  }, [chainId, tokenComparator, tokens])

  const items = useMemo(() => {
    return tokensArr.filter((el) => (search ? el.toLowerCase().includes(search) : el))
  }, [search, tokensArr])

  return (
    <div className="overflow-y-auto" style={{ height: 'calc(100% - 204px)' }}>
      <div className="flex flex-col flex-1 flex-grow" id="all-currencies-list">
        {token && (
          <div
            className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-dark-800"
            onClick={() => handleSelect(token)}
          >
            <div className="flex items-center gap-1.5">
              <div className="overflow-hidden rounded-full">
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
        {chainId && !search && (
          <div
            className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-dark-800"
            onClick={() => handleSelect(NATIVE[chainId])}
          >
            <div className="flex items-center gap-1.5">
              <div className="overflow-hidden rounded-full">
                <CurrencyLogo currency={NATIVE[chainId]} size={24} />
              </div>
              <Typography
                id={`all-currencies-${NATIVE[chainId].symbol}`}
                variant="sm"
                className="text-high-emphesis"
                weight={700}
              >
                {NATIVE[chainId].symbol}
              </Typography>
            </div>
            <Typography variant="sm" className="text-high-emphesis" weight={700}>
              {ethBalance ? ethBalance.toSignificant(6) : '0.000'}
            </Typography>
          </div>
        )}
        {items.map((tokenString, index) => {
          const [address, symbol] = tokenString.split('-')
          return (
            <div
              className="flex items-center justify-between px-5 py-3 cursor-pointer"
              onClick={() => handleSelect(tokens[address])}
              key={index}
            >
              <div className="flex items-center gap-1.5">
                <div className="overflow-hidden rounded-full">
                  <CurrencyLogo currency={tokens[address]} size={24} />
                </div>
                <Typography id={`all-currencies-${symbol}`} variant="sm" className="text-high-emphesis" weight={700}>
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
      </div>
    </div>
  )
}

interface CurrencySelectDialogProps {
  currency?: Currency
  onChange?: (x: Currency) => void | Promise<void>
  onDismiss: () => void | Promise<void>
  currencies?: Currency[]
}

const CurrencySelectDialog: FC<CurrencySelectDialogProps> = ({ currency, currencies = [], onChange, onDismiss }) => {
  const [search, setSearch] = useState<string | undefined>(undefined)
  const { i18n } = useLingui()

  const handleSelect = useCallback(
    async (x: Currency) => {
      if (onChange) await onChange(x)
      await onDismiss()
      setSearch(undefined)
    },
    [onChange, onDismiss, setSearch]
  )

  return (
    <div className="bg-dark-900 h-full lg:max-w-lg lg:w-[32rem] lg:max-h-[92vh] lg:h-[40rem]">
      <div className="relative border-b shadow-lg border-dark-1000">
        <div className="absolute w-full h-full pointer-events-none bg-gradient-to-r from-opaque-blue to-opaque-pink opacity-20" />
        <div className="flex flex-col gap-4 p-5">
          <div className="flex flex-row justify-between">
            <Button
              color="blue"
              variant="outlined"
              size="sm"
              className="py-1 pl-2 rounded-full cursor-pointer"
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
            <div className="border border-transparent rounded border-gradient-r-blue-pink-dark-1000">
              <input
                id="txt-select-token"
                value={search || ''}
                onChange={(e) => setSearch(e.target.value.toLowerCase())}
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
