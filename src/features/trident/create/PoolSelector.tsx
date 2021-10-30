import Typography from 'components/Typography'
import { classNames } from 'functions'
import React, { FC } from 'react'

interface PoolSelectorProps {
  title: string
  comingSoon?: boolean
  active: boolean
}

export const PoolSelector: FC<PoolSelectorProps> = ({ title, comingSoon, active }) => {
  return (
    <div
      style={active ? { boxShadow: '#27b0e6 0px 7px 67px -33px' } : {}}
      className={classNames(
        'flex flex-col rounded justify-center border p-8 border-dark-700 overflow-hidden',
        active ? 'text-high-emphesis' : 'text-secondary'
      )}
    >
      <Typography variant="h3" weight={700} className="truncate">
        {title}
      </Typography>
      {comingSoon && <div>Coming soon</div>}
    </div>
  )
}
