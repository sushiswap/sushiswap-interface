import React, { FC, ReactNode } from 'react'
import Typography from '../Typography'
import { ChainId, CurrencyAmount, Token } from '@sushiswap/sdk'
import CurrencyLogo from '../CurrencyLogo'
import { SUSHI } from '../../constants'
import { classNames, formatNumber } from '../../functions'
import { useUSDCValue } from '../../hooks/useUSDCPrice'

interface ListPanelProps {
  header?: ReactNode
  items?: ReactNode[]
  footer?: ReactNode
}

const ListPanel = ({ header, items, footer }: ListPanelProps) => {
  return (
    <div className="flex flex-col">
      {header && <div className="rounded-t overflow-hidden border border-dark-700">{header}</div>}
      {items && (
        <div
          className={classNames(
            header ? '' : 'border-t rounded-t',
            footer ? '' : 'border-b rounded-b',
            'border-l border-r border-dark-700 bg-dark-800 divide-y overflow-hidden'
          )}
        >
          {items}
        </div>
      )}
      {footer && <div className="rounded-b overflow-hidden border bg-dark-900 border-dark-700">{footer}</div>}
    </div>
  )
}

interface ListPanelFooterProps {
  title: string
  value?: string
}

// Default ListPanelFooter component, please note that you are not obliged to pass this to a ListPanel component
// If you need different styling, please create another component and leave this one as is.
const ListPanelFooter: FC<ListPanelFooterProps> = ({ title, value }) => {
  return (
    <div className="flex flex-row justify-between px-4 py-2 items-center">
      <Typography variant="xs" weight={400} className="text-high-emphesis">
        {title}
      </Typography>
      {value && (
        <Typography className="text-high-emphesis" variant="sm" weight={700}>
          {value}
        </Typography>
      )}
    </div>
  )
}

interface ListPanelHeaderProps {
  title: string
  value?: string
  subValue?: string
}

// Default ListPanelHeader component, please note that you are not obliged to pass this to a ListPanel component
// If you need different styling, please create another component and leave this one as is.
const ListPanelHeader: FC<ListPanelHeaderProps> = ({ title, value, subValue }) => {
  return (
    <div className="flex flex-row justify-between px-4 py-[10px] items-center">
      <Typography variant="lg" className="text-high-emphesis" weight={700}>
        {title}
      </Typography>
      {(value || subValue) && (
        <div className="flex flex-col text-right">
          {value && (
            <Typography className="text-high-emphesis" weight={700}>
              {value}
            </Typography>
          )}
          {subValue && (
            <Typography className="text-secondary" variant="xxs" weight={700}>
              {subValue}
            </Typography>
          )}
        </div>
      )}
    </div>
  )
}

interface ListPanelItemProps {
  left: ReactNode
  right: ReactNode
}

// Default ListPanelFooter component, please note that you are not obliged to pass this to a ListPanel component
// If you need different styling, please create another component and leave this one as is.
const ListPanelItem = ({ left, right }: ListPanelItemProps) => {
  return (
    <div className="grid grid-cols-2 gap-2 px-4 h-11 flex items-center border-dark-700">
      {left}
      {right}
    </div>
  )
}

interface ListPanelItemLeftProps {
  amount: CurrencyAmount<Token>
}

const ListPanelItemLeft: FC<ListPanelItemLeftProps> = ({ amount }) => {
  return (
    <div className="flex flex-row gap-1.5">
      <CurrencyLogo currency={amount?.currency} size={20} />
      <Typography variant="sm" className="text-high-emphesis" weight={700}>
        {amount?.toSignificant(6)} {amount?.currency.symbol}
      </Typography>
    </div>
  )
}

const ListPanelItemRight: FC = ({ children }) => {
  return (
    <Typography variant="xs" weight={400} className="text-right">
      {children}
    </Typography>
  )
}

interface CurrencyAmountItemProps {
  amount: CurrencyAmount<Token>
}

// ListPanelItem for displaying a CurrencyAmount
const CurrencyAmountItem: FC<CurrencyAmountItemProps> = ({ amount }) => {
  const usdcValue = useUSDCValue(amount)

  return (
    <ListPanel.Item
      left={<ListPanel.Item.Left amount={amount} />}
      right={<ListPanel.Item.Right>≈${usdcValue?.toFixed(2)}</ListPanel.Item.Right>}
      key={0}
    />
  )
}

ListPanel.Header = ListPanelHeader
ListPanelItem.Left = ListPanelItemLeft
ListPanelItem.Right = ListPanelItemRight
ListPanel.Item = ListPanelItem
ListPanel.CurrencyAmountItem = CurrencyAmountItem
ListPanel.Footer = ListPanelFooter

export default ListPanel
