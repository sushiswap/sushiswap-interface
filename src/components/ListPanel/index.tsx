import { FC, ReactNode } from 'react'

interface ListPanelProps {
  header?: ReactNode
  items?: ReactNode[]
  footer?: ReactNode
}

const ListPanel: FC<ListPanelProps> = ({ header, items, footer }) => {
  return (
    <div className="flex flex-col border border-dark-700 rounded overflow-hidden">
      {header && <div className="border-b border-dark-700">{header}</div>}
      {items && <div className="bg-dark-800 divide-y">{items}</div>}
      {footer && <div className="bg-dark-900 border-t border-dark-700">{footer}</div>}
    </div>
  )
}

export default ListPanel
