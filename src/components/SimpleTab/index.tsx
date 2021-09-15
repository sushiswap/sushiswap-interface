import React from 'react'
import { classNames } from '../../functions'

function SimpleTab({ className, tabs, active, onChange }: any) {
  return (
    <div
      className={classNames(
        className,
        'relative flex justify-between h-full w-full h-16 px-5 border-b border-t border-dark-700'
      )}
    >
      {tabs.map((tab, index) => (
        <div key={index} className="cursor-pointer flex flex-col h-full" onClick={() => onChange(index)}>
          <div className={classNames('flex-1 pt-5', index == active ? 'text-high-emphesis' : null)}>{tab.heading}</div>
          {index == active && <div className="h-2 bg-dark-700"></div>}
        </div>
      ))}
    </div>
  )
}

export default SimpleTab
