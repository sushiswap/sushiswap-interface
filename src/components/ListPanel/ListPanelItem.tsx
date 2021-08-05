import { FC, ReactNode } from 'react'

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

export default ListPanelItem
