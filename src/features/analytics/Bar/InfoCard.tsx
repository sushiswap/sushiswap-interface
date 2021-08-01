import React from 'react'
import { formatNumber } from '../../../functions'

interface InfoCardProps {
  text: string
  number: string
}

export default function InfoCard({ text, number }: InfoCardProps) {
  return (
    <div className="w-full p-6 rounded bg-dark-900">
      <div className="text-lg whitespace-nowrap">{text}</div>
      <div className="text-2xl font-bold text-high-emphesis">{number}</div>
    </div>
  )
}
