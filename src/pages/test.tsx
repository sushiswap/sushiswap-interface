import Container from '../components/Container'
import React from 'react'
import { useBlock } from '../services/graph'

export default function Test() {
  const block = useBlock()
  const block2 = useBlock({ daysAgo: 1 })
  const block3 = useBlock({ daysAgo: 7 })
  const block4 = useBlock({ timestamp: 1597579276 })

  console.log(block, block2, block3, block4)

  return (
    <Container>
      <div className="p-8 w-full bg-transparent border-2 border-transparent border-gradient-r-blue-pink-dark-900 rounded placeholder-secondary focus:placeholder-primary font-bold text-base px-6 py-3.5">
        Test
      </div>
    </Container>
  )
}
