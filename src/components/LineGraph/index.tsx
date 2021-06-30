import AutoSizer from 'react-virtualized-auto-sizer'
import { useMemo } from 'react'
import { scaleLinear } from '@visx/scale'
import { LinePath } from '@visx/shape'

import { minBy, maxBy } from 'lodash'

interface LineGraphProps {
  data: {
    x: number
    y: number
  }[]
  stroke?: string
}

interface GraphProps extends LineGraphProps {
  width: number
  height: number
}

function Graph({ data, stroke, width, height }: GraphProps): JSX.Element {
  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [minBy(data, 'x').x, maxBy(data, 'x').x],
        range: [0, width],
      }),
    [JSON.stringify(data), width]
  )
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [maxBy(data, 'y').y, minBy(data, 'y').y],
        range: [0, height],
      }),
    [JSON.stringify(data), height]
  )

  return (
    <div className="w-full h-full">
      <svg width={width} height={height}>
        <LinePath data={data} x={(d) => xScale(d.x) ?? 0} y={(d) => yScale(d.y) ?? 0} stroke={stroke} strokeWidth={2} />
      </svg>
    </div>
  )
}

export default function LineGraph({ data, stroke = '#0993EC' }: LineGraphProps): JSX.Element {
  return (
    <AutoSizer>{({ width, height }) => <Graph data={data} stroke={stroke} width={width} height={height} />}</AutoSizer>
  )
}
