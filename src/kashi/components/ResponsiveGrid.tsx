import React from 'react'

export default function ResponsiveGrid({ children }: any) {
  return <div className="h-full px-0 md:px-4 grid grid-cols-1 lg:grid-cols-4 gap-4">{children}</div>
}

export function Secondary({ children, marginTop = 0 }: any) {
  return <div className={`hidden lg:block lg:col-span-1 mt-${marginTop}`}>{children}</div>
}

export function Primary({ children, marginTop = 0 }: any) {
  return <div className="col-span-3">{children}</div>
}
