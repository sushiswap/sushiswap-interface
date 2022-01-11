import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, Token, ZERO } from '@sushiswap/core-sdk'
import Chip from 'app/components/Chip'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Image from 'app/components/Image'
import Loader from 'app/components/Loader'
import QuestionHelper from 'app/components/QuestionHelper'
import { MouseoverTooltip } from 'app/components/Tooltip'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import { isTokenOnList } from 'app/functions/validate'
import { useIsUserAddedToken } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import { useCombinedActiveList } from 'app/state/lists/hooks'
import { WrappedTokenInfo } from 'app/state/lists/wrappedTokenInfo'
import { useCurrencyBalance } from 'app/state/wallet/hooks'
import React, { CSSProperties, MutableRefObject, useCallback, useMemo } from 'react'
import { FixedSizeList } from 'react-window'

import ImportRow from './ImportRow'

function currencyKey(currency: Currency): string {
  return currency.isToken ? currency.address : 'ETHER'
}

function Balance({ balance }: { balance: CurrencyAmount<Currency> }) {
  return (
    <Typography
      weight={balance.greaterThan(ZERO) ? 700 : 400}
      className={classNames(
        balance.greaterThan(ZERO) ? 'text-high-emphesis' : 'text-low-emphesis',
        'whitespace-nowrap overflow-hidden max-w-[5rem] overflow-ellipsis'
      )}
      title={balance.toExact()}
    >
      {balance.greaterThan(ZERO) ? balance.toSignificant(4) : '0.00'}
    </Typography>
  )
}

function TokenTags({ currency }: { currency: Currency }) {
  if (!(currency instanceof WrappedTokenInfo)) {
    return <span />
  }

  const tags = currency.tags
  if (!tags || tags.length === 0) return <span />

  const tag = tags[0]

  return (
    <div className="flex justify-end">
      <MouseoverTooltip text={tag.description}>
        <Chip color="purple" key={tag.id} label={tag.name} />
      </MouseoverTooltip>
      {tags.length > 1 ? (
        <MouseoverTooltip
          text={tags
            .slice(1)
            .map(({ name, description }) => `${name}: ${description}`)
            .join('; \n')}
        >
          <Chip color="purple" key={tag.id} label="..." />
        </MouseoverTooltip>
      ) : null}
    </div>
  )
}

function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
  hideBalance = false,
}: {
  currency: Currency
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  hideBalance: boolean
  style: CSSProperties
}) {
  const { account } = useActiveWeb3React()
  const key = currencyKey(currency)
  const selectedTokenList = useCombinedActiveList()
  const isOnSelectedList = isTokenOnList(selectedTokenList, currency.isToken ? currency : undefined)
  const customAdded = useIsUserAddedToken(currency)
  const balance = useCurrencyBalance(account ?? undefined, currency)
  // only show add or remove buttons if not on selected list
  return (
    <div
      className="flex items-center w-full hover:bg-dark-800/40 px-6"
      id={`token-item-${key}`}
      style={style}
      onClick={() => (isSelected ? null : onSelect())}
      // disabled={isSelected}
      // selected={otherSelected}
    >
      <div className="flex items-center justify-between rounded cursor-pointer gap-2 flex-grow">
        <div className="flex flex-row items-center gap-3 flex-grow">
          <CurrencyLogo currency={currency} size={32} className="rounded-full" />
          <div className="flex flex-col">
            <Typography variant="xs" className="text-secondary">
              {currency.name} {!isOnSelectedList && customAdded && '• Added by user'}
            </Typography>
            <Typography variant="sm" weight={700} className="text-high-emphesis">
              {currency.symbol}
            </Typography>
          </div>
          <TokenTags currency={currency} />
        </div>
        <div className="flex items-center pr-3">
          {balance ? <Balance balance={balance} /> : account ? <Loader /> : null}
        </div>
      </div>
    </div>
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
    <div className="flex items-center w-full hover:bg-dark-800 px-6" style={style}>
      <div className="flex items-center justify-between rounded cursor-pointer gap-2 flex-grow">
        <div className="flex flex-row items-center gap-3 flex-grow">
          <Image src="/images/tokenlist.svg" alt="Token List" width={32} height={32} />
          <div className="flex flex-col">
            <Typography variant="sm" className="ml-3">
              {i18n._(t`Expanded results from inactive Token Lists`)}
              <QuestionHelper
                text={i18n._(t`Tokens from inactive lists. Import specific tokens below or
            click Manage to activate more lists.`)}
              />
            </Typography>
          </div>
        </div>
      </div>
    </div>
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
  hideBalance = false,
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
  hideBalance: boolean
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
            hideBalance={hideBalance}
          />
        )
      } else {
        return null
      }
    },
    [currencies.length, hideBalance, onCurrencySelect, otherCurrency, selectedCurrency, setImportToken, showImportView]
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
