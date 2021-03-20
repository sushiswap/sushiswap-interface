import React from 'react'

interface Card {
  children?: React.ReactChild | React.ReactChild[]
}

export default function Card({ children }: Card) {
  return <div>{children}</div>
}
