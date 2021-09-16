import React, { Dispatch, SetStateAction, useMemo } from 'react'
import { Bar } from '@visx/shape'
import { Group } from '@visx/group'
import { scaleBand, scaleLinear } from '@visx/scale'
import AutoSizer from 'react-virtualized-auto-sizer'

const verticalMargin = 40

// accessors
const getTime = (d) => d.time
const getPrice = (d) => Number(d.price)

type Props = {
  data: any
  width: number
  height: number
  events?: boolean
  setSelectedDatum?: any
}

function Graph({ data, width, height, setSelectedDatum, events = false, ...rest }: Props) {
  console.log({ data, width, height, setSelectedDatum, events, rest })
  // bounds
  const xMax = width
  const yMax = height - verticalMargin

  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, xMax],
        round: true,
        domain: data.map(getTime),
        padding: 0.1,
      }),
    [xMax, data]
  )

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        round: true,
        // Make the chart domain as small as possible while showing all bars
        // This allows us to use less height for the graph
        domain: [Math.min(...data.map(getPrice)) * 0.9, Math.max(...data.map(getPrice))],
      }),
    [yMax, data]
  )

  return (
    <svg width={width} height={height}>
      <Group top={verticalMargin / 2}>
        {data.map((d) => {
          const time = getTime(d)
          const barWidth = xScale.bandwidth()
          const barHeight = yMax - (yScale(getPrice(d)) ?? 0)
          const barX = xScale(time)
          const barY = yMax - barHeight
          return (
            <Bar
              key={`bar-${time}`}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill="rgba(0, 160, 233, 1)"
              onClick={() => setSelectedDatum(d)}
              onMouseMove={() => setSelectedDatum(d)}
              onMouseEnter={() => setSelectedDatum(d)}
            />
          )
        })}
      </Group>
    </svg>
  )
}

export const BarGraph = ({ data, ...rest }) => (
  <>
    <AutoSizer>{({ width, height }) => <Graph data={data} width={width} height={height} {...rest} />}</AutoSizer>
  </>
)
