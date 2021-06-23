import React from 'react'

export default function SplitPane({ left, right }: { left: JSX.Element; right: JSX.Element }): JSX.Element {
  return (
    <div className="flex flex-1 items-center flex-col md:flex-row justify-between pb-2 px-2 md:px-7">
      <div className="w-full md:w-1/2">{left}</div>
      <div className="w-full md:w-1/2">{right}</div>
    </div>
  )
}
