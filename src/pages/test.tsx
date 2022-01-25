import dynamic from 'next/dynamic'

const TestNoSSR = dynamic(() => import('../components/test-chart'), { ssr: false })

export default function Test() {
  console.log({ TestNoSSR })
  return (
    <div className="w-full h-full">
      <TestNoSSR />
    </div>
  )
}
