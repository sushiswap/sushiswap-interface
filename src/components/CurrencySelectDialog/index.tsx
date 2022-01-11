import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, NATIVE } from '@sushiswap/core-sdk'
import { isValidAddress } from '@walletconnect/utils'
import loadingCircle from 'app/animation/loading-circle.json'
import Chip from 'app/components/Chip'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import { HeadlessUiModal } from 'app/components/Modal'
import Typography from 'app/components/Typography'
import { isAddress, shortenAddress } from 'app/functions'
import { useAllTokens, useIsUserAddedToken, useToken } from 'app/hooks/Tokens'
import useDebounce from 'app/hooks/useDebounce'
import CommonBases from 'app/modals/SearchModal/CommonBases'
import ImportToken from 'app/modals/SearchModal/ImportToken'
import { useTokenComparator } from 'app/modals/SearchModal/sorting'
import { useActiveWeb3React } from 'app/services/web3/hooks'
import { useAllTokenBalances, useCurrencyBalance, useCurrencyBalances, useTokenBalance } from 'app/state/wallet/hooks'
import Lottie from 'lottie-react'
import React, { FC, useCallback, useMemo, useState } from 'react'

enum View {
  DEFAULT,
  IMPORT,
}

interface ProvidedCurrenciesProps {
  currencies: Currency[]
  handleSelect: (x: Currency) => void
}

const ProvidedCurrencies: FC<ProvidedCurrenciesProps> = ({ currencies, handleSelect }) => {
  const { account } = useActiveWeb3React()
  const balances = useCurrencyBalances(account ? account : undefined, currencies)

  return (
    <div className="h-full divide-y divider-dark-800">
      {balances.map((balance, index) => (
        <div
          className="flex items-center justify-between py-3 cursor-pointer hover:bg-dark-800/40"
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
  const tokenIsAdded = useIsUserAddedToken(token)

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
    <div className="divide-y divide-dark-800 flex flex-col flex-1 flex-grow" id="all-currencies-list">
      {token && tokenIsAdded && (
        <div
          className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-dark-800/40"
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
          className="flex items-center justify-between px-5 py-3 cursor-pointer  hover:bg-dark-800/40"
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
            className="flex items-center justify-between px-5 py-3 cursor-pointer  hover:bg-dark-800/40"
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
  )
}

interface CurrencySelectDialogProps {
  currency?: Currency
  onChange?: (x: Currency) => void | Promise<void>
  onDismiss: () => void | Promise<void>
  currencies?: Currency[]
}

const CurrencySelectDialog: FC<CurrencySelectDialogProps> = ({ currency, currencies = [], onChange, onDismiss }) => {
  const { chainId } = useActiveWeb3React()
  const [search, setSearch] = useState<string | undefined>(undefined)
  const { i18n } = useLingui()
  const debouncedSearch = useDebounce(search, 200)
  const searchToken = useToken(debouncedSearch)
  const searchTokenIsAdded = useIsUserAddedToken(searchToken)
  const [view, setView] = useState<View>(View.DEFAULT)

  const handleSelect = useCallback(
    async (x: Currency) => {
      if (onChange) await onChange(x)
      await onDismiss()
      setSearch(undefined)
    },
    [onChange, onDismiss, setSearch]
  )

  const handleInput = useCallback((event) => {
    const input = event.target.value
    setSearch(isAddress(input) || input)
  }, [])

  if (searchToken && !searchTokenIsAdded && view === View.IMPORT) {
    return (
      <ImportToken
        tokens={[searchToken]}
        onBack={() => setView(View.DEFAULT)}
        onDismiss={onDismiss}
        handleCurrencySelect={handleSelect}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4 lg:max-h-[92vh] lg:h-[40rem]">
      <HeadlessUiModal.Header header={i18n._(t`Select a Token`)} onClose={onDismiss} />
      <div className="relative">
        <div className="flex flex-col gap-4">
          {currencies.length === 0 && (
            <div className="border border-dark-700 rounded bg-[rgba(0,0,0,0.2)]">
              <input
                id="txt-select-token"
                value={search || ''}
                onChange={handleInput}
                className="bg-transparent font-bold h-[54px] w-full px-5"
                placeholder={i18n._(t`Select name or paste address`)}
              />
            </div>
          )}
        </div>
      </div>
      <CommonBases onSelect={handleSelect} chainId={chainId} selectedCurrency={currency} />
      {searchToken && !searchTokenIsAdded && (
        <HeadlessUiModal.BorderedContent
          className="border hover:border-gray-700 cursor-pointer flex flex-col gap-4"
          onClick={() => setView(View.IMPORT)}
        >
          <Typography variant="xs" weight={700} className="text-secondary">
            {i18n._(t`Import token`)}
          </Typography>
          <div className="flex justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full overflow-hidden border border-dark-700">
                <CurrencyLogo currency={searchToken} size={48} />
              </div>
              <div className="flex flex-col">
                <div className="flex gap-2 items-center">
                  <Typography variant="lg" weight={700} component="span" className="text-white">
                    {searchToken.symbol}{' '}
                    <Typography variant="xs" component="span">
                      {searchToken.name}
                    </Typography>
                  </Typography>

                  <Chip color="yellow" size="sm" label={i18n._(t`Unknown Source`)}>
                    {i18n._(t`Unknown Source`)}
                  </Chip>
                </div>
                <Typography variant="xxs" weight={700}>
                  {shortenAddress(searchToken.address)}
                </Typography>
              </div>
            </div>
          </div>
        </HeadlessUiModal.BorderedContent>
      )}
      <HeadlessUiModal.BorderedContent className="!p-0 bg-[rgba(0,0,0,0.2)] h-full overflow-hidden overflow-y-auto">
        {currencies.length > 0 ? (
          <ProvidedCurrencies currencies={currencies} handleSelect={handleSelect} />
        ) : (
          <AllCurrencies handleSelect={handleSelect} search={search} />
        )}
      </HeadlessUiModal.BorderedContent>
    </div>
  )
}

export default CurrencySelectDialog
