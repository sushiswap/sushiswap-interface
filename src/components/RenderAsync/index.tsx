import { ReactNode, useEffect, useState } from 'react'

interface RenderAsyncProps<ObjectType> {
  children: (data: ObjectType) => ReactNode
  promise: Promise<ObjectType>
  loader: ReactNode
}

// @ts-ignore TYPE NEEDS FIXING
function RenderAsync<ObjectType extends RenderAsyncProps<ObjectType>>({ children, promise, loader }) {
  const [data, setData] = useState()

  useEffect(() => {
    if (promise instanceof Promise) {
      ;(async () => {
        const resp = await promise
        setData(resp)
      })()
    }
  }, [promise])

  if (data) {
    return children(data)
  } else {
    return loader
  }
}

export default RenderAsync
