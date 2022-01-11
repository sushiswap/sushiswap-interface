import Typography from 'app/components/Typography'
import React, { FC } from 'react'

export interface ModalHeaderProps {
  header: string
  subheader?: string
}

const ModalHeader: FC<ModalHeaderProps> = ({ header, subheader }) => {
  return (
    <div className="flex flex-col gap-1">
      <Typography variant="lg" weight={700} className="text-high-emphesis">
        {header}
      </Typography>
      {subheader && <Typography variant="sm">{subheader}</Typography>}
    </div>
  )
}

export default ModalHeader
