import React from 'react'
import { useKashiPairs } from '../context'
import SyntaxHighlighter from 'react-syntax-highlighter'

// function Pair() {
//   const { pairAddress }: { pairAddress: string } = useParams()
//   return <h3>Requested pair address: {pairAddress}</h3>
// }

function Kashi() {
  const pairs = useKashiPairs()
  console.log('Kashi woop', pairs)
  return (
    <>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <SyntaxHighlighter language="json">{JSON.stringify(pairs, null, 2)}</SyntaxHighlighter>
      </div>
    </>
  )
}

export default Kashi
