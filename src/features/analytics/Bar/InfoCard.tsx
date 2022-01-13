import React from 'react'

interface InfoCardProps {
  text: string
  number: string
}

export default function InfoCard({ text, number }: InfoCardProps) {
  return (
    <div className="w-full py-3 border rounded px-9 bg-dark-900 border-dark-700">
      <div className="whitespace-nowrap">{text}</div>
      <div className="text-2xl font-bold">{number}</div>
    </div>
  )
}
