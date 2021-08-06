import { FC, ReactNode } from 'react'
import Typography from '../Typography'

interface ListPanelProps {
  header?: ReactNode
  items?: ReactNode[]
  footer?: ReactNode
}

const ListPanel = ({ header, items, footer }: ListPanelProps) => {
  return (
    <div className="flex flex-col border border-dark-700 rounded overflow-hidden">
      {header && <div className="border-b border-dark-700">{header}</div>}
      {items && <div className="bg-dark-800 divide-y">{items}</div>}
      {footer && <div className="bg-dark-900 border-t border-dark-700">{footer}</div>}
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
const ListPanelItem: FC<ListPanelItemProps> = ({ left, right }) => {
  return (
    <div className="grid grid-cols-2 gap-2 px-4 h-11 flex items-center border-dark-700">
      {left}
      {right}
    </div>
  )
}

ListPanel.Header = ListPanelHeader
ListPanel.Item = ListPanelItem
ListPanel.Footer = ListPanelFooter

export default ListPanel
