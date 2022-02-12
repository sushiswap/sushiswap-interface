// @ts-ignore TYPE NEEDS FIXING
import AutoSizer from 'react-virtualized-auto-sizer'

import Curves from './Curves'

interface ScrollableGraphProps {
  compact?: boolean
  margin?: {
    top: number
    right: number
    bottom: number
    left: number
  }
  data: any
  title?: string
  labels?: string[]
  note?: string
  colors?: any[]
}

export default function ScrollableGraph(props: ScrollableGraphProps) {
  return (
    <>
      {props.data && props.data[0]?.length !== 0 && (
        // @ts-ignore TYPE NEEDS FIXING
        <AutoSizer>{({ width, height }) => <Curves {...props} width={width} height={height} />}</AutoSizer>
      )}
    </>
  )
}
