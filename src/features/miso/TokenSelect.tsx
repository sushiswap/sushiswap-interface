import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Token } from '@sushiswap/sdk'
import { TokenInfo } from '@uniswap/token-lists'
import React from 'react'

import { useTokenComparator } from './sorting'

import CurrencyLogo from '../../components/CurrencyLogo'
import Loader from '../../components/Loader'
import NavLink from '../../components/NavLink'
import Typography from '../../components/Typography'
import { useSortedTokensByQuery } from '../../functions/filtering'
import { isAddress } from '../../functions/validate'
import { useListTokens } from '../../hooks/miso/useTokens'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import useDebounce from '../../hooks/useDebounce'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { useTokenBalance } from '../../state/wallet/hooks'

const alwaysTrue = () => true

function createTokenFilterFunction<T extends Token | TokenInfo>(search: string): (tokens: T) => boolean {
  const searchingAddress = isAddress(search)

  if (searchingAddress) {
    const lower = searchingAddress.toLowerCase()
    return (t: T) => ('isToken' in t ? searchingAddress === t.address : lower === t.address.toLowerCase())
  }

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter((s) => s.length > 0)

  if (lowerSearchParts.length === 0) return alwaysTrue

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0)

    return lowerSearchParts.every((p) => p.length === 0 || sParts.some((sp) => sp.includes(p)))
  }

  return ({ address, name, symbol }: T): boolean =>
    Boolean((address && matchesSearch(address)) || (symbol && matchesSearch(symbol)) || (name && matchesSearch(name)))
}

function filterTokens<T extends Token | TokenInfo>(tokens: T[], search: string): T[] {
  return tokens.filter(createTokenFilterFunction(search))
}

function TokenRow({ token, onClick }: { token: Token; onClick: (selectedToken: Token) => void }) {
  const { account } = useActiveWeb3React()
  const balance = useTokenBalance(account ?? undefined, token)

  return (
    <div
      className="my-3 cursor-pointer flex flex-row items-center"
      onClick={() => {
        onClick(token)
      }}
    >
      <CurrencyLogo currency={token} size={32} />
      <Typography className="ml-3 w-[115px] text-white">{token.symbol}</Typography>
      <Typography>{token.address}</Typography>
      <Typography className="flex-1 flex justify-end">
        {balance ? balance?.toSignificant(4) : account ? <Loader stroke="white" /> : null}
      </Typography>
    </div>
  )
}

export const TokenSelect = React.memo(
  ({
    onTokenSelect,
    className,
    ...rest
  }: {
    onTokenSelect?: (token: Token) => void
  } & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) => {
    const { i18n } = useLingui()

    const [searchQuery, setSearchQuery] = React.useState('')
    const [token, setToken] = React.useState<Token>(null)
    const [searchVisible, showSearch] = React.useState(false)

    React.useEffect(() => {
      onTokenSelect(token)
    }, [token, onTokenSelect])

    const selectToken = (token: Token) => {
      setSearchQuery(token.address)
      setToken(token)
      showSearch(false)
    }

    const debouncedQuery = useDebounce(searchQuery, 200)
    const allTokens = useListTokens()
    const filteredTokens: Token[] = React.useMemo(() => {
      const result = filterTokens(Object.values(allTokens), debouncedQuery)
      return result
    }, [allTokens, debouncedQuery])
    const tokenComparator = useTokenComparator(false)
    const sortedTokens: Token[] = React.useMemo(() => {
      return filteredTokens.sort(tokenComparator)
    }, [filteredTokens, tokenComparator])
    const filteredSortedTokens = useSortedTokensByQuery(sortedTokens, debouncedQuery)

    const node = React.useRef<HTMLDivElement>()
    useOnClickOutside(node, searchVisible ? () => showSearch(false) : undefined)

    return (
      <div className="mb-3">
        <Typography className="text-white text-xl">{i18n._(t`Auction Token`)}*</Typography>
        <div className="mt-2 py-2 px-5 rounded bg-dark-800 w-full relative" ref={node}>
          <input
            className="bg-transparent placeholder-low-emphesis w-full"
            placeholder={i18n._(t`Search by symbol or Enter the address of the token you would like to auction.`)}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setToken(null)
            }}
            onFocus={() => {
              showSearch(true)
            }}
            {...rest}
          />

          <div className="absolute top-2 right-5">{token?.symbol}</div>

          {searchVisible && (
            <div className="absolute w-full left-0 top-[48px] z-10">
              <div className="w-full rounded">
                <Typography className="rounded-t bg-dark-900 px-3 py-2">
                  {searchQuery ? i18n._(t`Results`) : i18n._(t`Suggested`)}
                </Typography>
                <div className="rounded-b bg-dark-800 px-3 py-2 h-[232px] overflow-y-scroll">
                  {filteredSortedTokens.map((token: Token) => {
                    return <TokenRow key={token.address} token={token} onClick={(token) => selectToken(token)} />
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
        <Typography className="mt-2 flex flex-row items-center">
          {i18n._(t`Don't have a token?`)}
          <NavLink href="/miso/create-token">
            <Typography className="text-blue underline ml-2">{i18n._(t`Create it now!`)}</Typography>
          </NavLink>
        </Typography>
      </div>
    )
  }
)

TokenSelect.displayName = 'TokenSelect'

export default TokenSelect
