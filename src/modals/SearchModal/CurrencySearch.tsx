import { ChainId, Currency, NATIVE, Token } from '@sushiswap/sdk'
import React, { KeyboardEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Row, { RowFixed } from '../../components/Row'
import { filterTokens, useSortedTokensByQuery } from '../../functions/filtering'
import { useAllTokens, useIsUserAddedToken, useSearchInactiveTokenLists, useToken } from '../../hooks/Tokens'

import AutoSizer from 'react-virtualized-auto-sizer'
import Button from '../../components/Button'
import ButtonText from '../../components/ButtonText'
import CHAINLINK_TOKENS from '@sushiswap/chainlink-whitelist/dist/sushiswap-chainlink.whitelist.json'
import Column from '../../components/Column'
import CommonBases from './CommonBases'
import CurrencyList from './CurrencyList'
import { Edit } from 'react-feather'
import { ExtendedEther } from '../../constants'
import { FixedSizeList } from 'react-window'
import IconWrapper from '../../components/IconWrapper'
import ImportRow from './ImportRow'
import ModalHeader from '../../components/ModalHeader'
import ReactGA from 'react-ga'
import { isAddress } from '../../functions/validate'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import useDebounce from '../../hooks/useDebounce'
import { useLingui } from '@lingui/react'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { useRouter } from 'next/router'
import useToggle from '../../hooks/useToggle'
import { useTokenComparator } from './sorting'

interface CurrencySearchProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  showManageView: () => void
  showImportView: () => void
  setImportToken: (token: Token) => void
  currencyList?: string[]
  includeNativeCurrency?: boolean
  allowManageTokenList?: boolean
}

export function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  onDismiss,
  isOpen,
  showManageView,
  showImportView,
  setImportToken,
  currencyList,
  includeNativeCurrency = true,
  allowManageTokenList = true,
}: CurrencySearchProps) {
  const { i18n } = useLingui()

  const { chainId } = useActiveWeb3React()

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)

  const [invertSearchOrder] = useState<boolean>(false)

  let allTokens = useAllTokens()

  const router = useRouter()

  if (router.asPath.startsWith('/kashi/create')) {
    allTokens = Object.keys(allTokens).reduce((obj, key) => {
      if (CHAINLINK_TOKENS[chainId].find((address) => address === key)) obj[key] = allTokens[key]
      return obj
    }, {})
  }

  if (currencyList) {
    allTokens = Object.keys(allTokens).reduce((obj, key) => {
      if (currencyList.includes(key)) obj[key] = allTokens[key]
      return obj
    }, {})
  }

  // if they input an address, use it
  const isAddressSearch = isAddress(debouncedQuery)

  const searchToken = useToken(debouncedQuery)

  const searchTokenIsAdded = useIsUserAddedToken(searchToken)

  useEffect(() => {
    if (isAddressSearch) {
      ReactGA.event({
        category: 'Currency Select',
        action: 'Search by address',
        label: isAddressSearch,
      })
    }
  }, [isAddressSearch])

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(Object.values(allTokens), debouncedQuery)
  }, [allTokens, debouncedQuery])

  const sortedTokens: Token[] = useMemo(() => {
    return filteredTokens.sort(tokenComparator)
  }, [filteredTokens, tokenComparator])

  const filteredSortedTokens = useSortedTokensByQuery(sortedTokens, debouncedQuery)

  // const ether = useMemo(() => chainId && ExtendedEther.onChain(chainId), [chainId])

  const ether = useMemo(() => chainId && ![ChainId.CELO].includes(chainId) && NATIVE[chainId], [chainId])

  const filteredSortedTokensWithETH: Currency[] = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim()
    if (s === '' || s === 'e' || s === 'et' || s === 'eth') {
      return ether ? [ether, ...filteredSortedTokens] : filteredSortedTokens
    }
    return filteredSortedTokens
  }, [debouncedQuery, ether, filteredSortedTokens])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = debouncedQuery.toLowerCase().trim()
        if (s === 'eth' && ether) {
          handleCurrencySelect(ether)
        } else if (filteredSortedTokensWithETH.length > 0) {
          if (
            filteredSortedTokensWithETH[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokensWithETH.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokensWithETH[0])
          }
        }
      }
    },
    [debouncedQuery, ether, filteredSortedTokensWithETH, handleCurrencySelect]
  )

  // menu ui
  const [open, toggle] = useToggle(false)
  const node = useRef<HTMLDivElement>()
  useOnClickOutside(node, open ? toggle : undefined)

  // if no results on main list, show option to expand into inactive
  const filteredInactiveTokens = useSearchInactiveTokenLists(
    filteredTokens.length === 0 || (debouncedQuery.length > 2 && !isAddressSearch) ? debouncedQuery : undefined
  )

  return (
    <div className="w-full h-full">
      <ModalHeader onClose={onDismiss} title="Select a token" />
      {!currencyList && (
        <div className="mt-0 mb-3 sm:mt-3 sm:mb-8">
          <input
            type="text"
            id="token-search-input"
            placeholder={i18n._(t`Search name or paste address`)}
            autoComplete="off"
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
            onKeyDown={handleEnter}
            className="w-full bg-transparent border border-dark-700 focus:border-transparent focus:border-gradient-r-blue-pink-dark-900 rounded placeholder-secondary focus:placeholder-primary font-bold text-base px-6 py-3.5"
          />
        </div>
      )}
      {showCommonBases && (
        <div className="mb-4">
          <CommonBases chainId={chainId} onSelect={handleCurrencySelect} selectedCurrency={selectedCurrency} />
        </div>
      )}

      {searchToken && !searchTokenIsAdded ? (
        <Column style={{ padding: '20px 0', height: '100%' }}>
          <ImportRow token={searchToken} showImportView={showImportView} setImportToken={setImportToken} />
        </Column>
      ) : filteredSortedTokens?.length > 0 || filteredInactiveTokens?.length > 0 ? (
        <div className="flex-1 h-full">
          <AutoSizer disableWidth>
            {({ height }) => (
              <CurrencyList
                height={height}
                currencies={includeNativeCurrency ? filteredSortedTokensWithETH : filteredSortedTokens}
                otherListTokens={filteredInactiveTokens}
                onCurrencySelect={handleCurrencySelect}
                otherCurrency={otherSelectedCurrency}
                selectedCurrency={selectedCurrency}
                fixedListRef={fixedList}
                showImportView={showImportView}
                setImportToken={setImportToken}
              />
            )}
          </AutoSizer>
        </div>
      ) : (
        <Column style={{ padding: '20px', height: '100%' }}>
          <div className="mb-8 text-center">{i18n._(t`No results found`)}</div>
        </Column>
      )}
      {allowManageTokenList && (
        <div className="mt-3">
          <Button id="list-token-manage-button" onClick={showManageView} color="gray">
            {i18n._(t`Manage Token Lists`)}
          </Button>
        </div>
      )}
    </div>
  )
}
