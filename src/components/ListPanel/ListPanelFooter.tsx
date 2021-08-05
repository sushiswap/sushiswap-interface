import { FC } from 'react'
import Typography from '../Typography'

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

export default ListPanelFooter
