import React from 'react'
import { formatPercent } from '../../../functions'

interface AllocationTableProps {
  allocations: {
    name: string
    allocation: number
  }[]
}

export default function AllocationTable({ allocations }: AllocationTableProps) {
  return (
    <table>
      <tbody>
        {allocations.map((alloc, i) => (
          <tr
            key={i}
            className={alloc.allocation === 0 ? 'hidden' : ''}
            style={{ borderBottom: '24px solid transparent' }}
          >
            <td>
              <div className="text-sm font-bold text-high-emphesis whitespace-nowrap">{alloc.name}</div>
            </td>
            <td className="w-full px-2">
              <div className="w-full h-3 overflow-hidden rounded-lg bg-dark-800">
                <div className="h-full bg-gradient-to-r from-blue to-pink" style={{ width: `${alloc.allocation}%` }} />
              </div>
            </td>
            <td>
              <div className="text-sm font-bold text-high-emphesis whitespace-nowrap">
                {formatPercent(alloc.allocation)}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
