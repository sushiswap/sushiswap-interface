import { Currency, CurrencyAmount, Token } from '@sushiswap/sdk'
import React, { CSSProperties, MutableRefObject, useCallback, useMemo } from 'react'
import { RowBetween, RowFixed } from '../Row'
import { useCombinedActiveList } from '../../state/lists/hooks'
import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo'
import { useIsUserAddedToken } from '../../hooks/Tokens'
import Card from '../Card'
import Column from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import { FixedSizeList } from 'react-window'
import ImportRow from './ImportRow'
import Loader from '../Loader'
import { MenuItem } from './styleds'
import { MouseoverTooltip } from '../Tooltip'
import QuestionHelper from '../QuestionHelper'
import { useLingui } from '@lingui/react'
import Typography from '../Typography'
import { isTokenOnList } from '../../functions/validate'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'

function currencyKey(currency: Currency): string {
  return currency.isToken ? currency.address : 'ETHER'
}

const Tag = styled.div`
  background-color: ${({ theme }) => theme.bg3};
  // color: ${({ theme }) => theme.text2};
  font-size: 14px;
  border-radius: 4px;
  padding: 0.25rem 0.3rem 0.25rem 0.3rem;
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-self: flex-end;
  margin-right: 4px;
`

const FixedContentRow = styled.div`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-gap: 16px;
  align-items: center;
`

function Balance({ balance }: { balance: CurrencyAmount<Currency> }) {
  return (
    <div className="whitespace-nowrap overflow-hidden max-w-[5rem] overflow-ellipsis" title={balance.toExact()}>
      {balance.toSignificant(4)}
    </div>
  )
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

const TokenListLogoWrapper = styled.img`
  height: 20px;
`

function TokenTags({ currency }: { currency: Currency }) {
  if (!(currency instanceof WrappedTokenInfo)) {
    return <span />
  }

  const tags = currency.tags
  if (!tags || tags.length === 0) return <span />

  const tag = tags[0]

  return (
    <TagContainer>
      <MouseoverTooltip text={tag.description}>
        <Tag key={tag.id}>{tag.name}</Tag>
      </MouseoverTooltip>
      {tags.length > 1 ? (
        <MouseoverTooltip
          text={tags
            .slice(1)
            .map(({ name, description }) => `${name}: ${description}`)
            .join('; \n')}
        >
          <Tag>...</Tag>
        </MouseoverTooltip>
      ) : null}
    </TagContainer>
  )
}

function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
}: {
  currency: Currency
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  style: CSSProperties
}) {
  const { account, chainId } = useActiveWeb3React()
  const key = currencyKey(currency)
  const selectedTokenList = useCombinedActiveList()
  const isOnSelectedList = isTokenOnList(selectedTokenList, currency.isToken ? currency : undefined)
  const customAdded = useIsUserAddedToken(currency)
  const balance = useCurrencyBalance(account ?? undefined, currency)

  console.log({ currency })

  // only show add or remove buttons if not on selected list
  return (
    <MenuItem
      id={`token-item-${key}`}
      style={style}
      className={`hover:bg-dark-800 rounded`}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      <div className="flex items-center">
        <CurrencyLogo currency={currency} size={32} />
      </div>
      <Column>
        <div title={currency.name} className="text-sm font-medium">
          {currency.symbol}
        </div>
        <div className="text-sm font-thin">
          {currency.name} {!isOnSelectedList && customAdded && '• Added by user'}
        </div>
      </Column>
      <TokenTags currency={currency} />
      <div className="flex items-center justify-end">
        {balance ? <Balance balance={balance} /> : account ? <Loader /> : null}
      </div>
    </MenuItem>
  )
}

const BREAK_LINE = 'BREAK'
type BreakLine = typeof BREAK_LINE
function isBreakLine(x: unknown): x is BreakLine {
  return x === BREAK_LINE
}

function BreakLineComponent({ style }: { style: CSSProperties }) {
  const { i18n } = useLingui()
  return (
    <FixedContentRow style={style}>
      <RowBetween>
        <RowFixed>
          <TokenListLogoWrapper src="/tokenlist.svg" />
          <Typography variant="sm" className="ml-3">
            {i18n._(t`Expanded results from inactive Token Lists`)}
          </Typography>
        </RowFixed>
        <QuestionHelper
          text={i18n._(t`Tokens from inactive lists. Import specific tokens below or
            click Manage to activate more lists.`)}
        />
      </RowBetween>
    </FixedContentRow>
  )
}

export default function CurrencyList({
  height,
  currencies,
  otherListTokens,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showImportView,
  setImportToken,
}: {
  height: number
  currencies: Currency[]
  otherListTokens?: WrappedTokenInfo[]
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherCurrency?: Currency | null
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showImportView: () => void
  setImportToken: (token: Token) => void
}) {
  const itemData: (Currency | BreakLine)[] = useMemo(() => {
    if (otherListTokens && otherListTokens?.length > 0) {
      return [...currencies, BREAK_LINE, ...otherListTokens]
    }
    return currencies
  }, [currencies, otherListTokens])

  const Row = useCallback(
    function TokenRow({ data, index, style }) {
      const row: Currency | BreakLine = data[index]

      if (isBreakLine(row)) {
        return <BreakLineComponent style={style} />
      }

      const currency = row

      const isSelected = Boolean(currency && selectedCurrency && selectedCurrency.equals(currency))
      const otherSelected = Boolean(currency && otherCurrency && otherCurrency.equals(currency))
      const handleSelect = () => currency && onCurrencySelect(currency)

      const token = currency?.wrapped

      const showImport = index > currencies.length

      if (showImport && token) {
        return (
          <ImportRow style={style} token={token} showImportView={showImportView} setImportToken={setImportToken} dim />
        )
      } else if (currency) {
        return (
          <CurrencyRow
            style={style}
            currency={currency}
            isSelected={isSelected}
            onSelect={handleSelect}
            otherSelected={otherSelected}
          />
        )
      } else {
        return null
      }
    },
    [currencies.length, onCurrencySelect, otherCurrency, selectedCurrency, setImportToken, showImportView]
  )

  const itemKey = useCallback((index: number, data: typeof itemData) => {
    const currency = data[index]
    if (isBreakLine(currency)) return BREAK_LINE
    return currencyKey(currency)
  }, [])

  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  )
}
