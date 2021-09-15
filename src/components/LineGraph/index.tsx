import { cloneDeepWith, maxBy, minBy } from 'lodash'

import AutoSizer from 'react-virtualized-auto-sizer'
import { LinePath, Bar } from '@visx/shape'
import { LinearGradient } from '@visx/gradient'
import { scaleLinear, scaleTime } from '@visx/scale'
import { useMemo, useState } from 'react'
import { localPoint } from '@visx/event'
import { bisector } from 'd3-array'

interface LineGraphProps {
  data: {
    x: Date
    y: number
  }[]
  stroke?:
    | {
        solid: string
      }
    | {
        gradient: {
          from: string
          to: string
        }
      }
  strokeWidth?: number
  overrideFigure?: (figure: number) => void
  overrideDate?: (date: Date) => void
}

interface GraphProps extends LineGraphProps {
  width: number
  height: number
}

const bisectDate = bisector((d) => d.x).left

function Graph({ data, stroke, strokeWidth, width, height, overrideFigure, overrideDate }: GraphProps): JSX.Element {
  const [tooltipCords, setTooltipCords] = useState<{ x: number; y: number }>(undefined)

  const xScale = useMemo(
    () =>
      scaleTime<number>({
        domain: [minBy(data, 'x')?.x, maxBy(data, 'x')?.x],
        range: [0, width],
      }),
    [JSON.stringify(data), width]
  )
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [maxBy(data, 'y')?.y, minBy(data, 'y')?.y],
        range: [0, height],
      }),
    [JSON.stringify(data), height]
  )

  const handleTooltip = (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
    const { x } = localPoint(event) || { x: 0 }
    const x0 = xScale.invert(x)
    const index = bisectDate(data, x0.getTime(), 1)
    const d0 = data[index - 1]
    const d1 = data[index]
    let d = d0
    if (d1 && d1.x) {
      d = x0.valueOf() - d0.x.valueOf() > d1.x.valueOf() - x0.valueOf() ? d1 : d0
    }

    const multiplier = -1 * (Math.abs(x - xScale(d.x)) / Math.abs(xScale(d1.x) - xScale(d0.x)))
    const offset = multiplier * (d.x === d1.x ? d.y - d0.y : d.y - d1.y)

    overrideFigure(d.y)
    overrideDate(d.x)

    setTooltipCords({ x, y: yScale(d.y + offset) })
  }

  const hideTooltip = () => {
    overrideFigure(undefined)
    overrideDate(undefined)
    setTooltipCords(undefined)
  }

  return (
    <div className="w-full h-full">
      <svg width={width} height={height}>
        {'gradient' in stroke && (
          <LinearGradient id="gradient" from={stroke.gradient.from} to={stroke.gradient.to} vertical={false} />
        )}
        <g>{tooltipCords && <circle cx={tooltipCords.x} cy={tooltipCords.y} r={4} fill="#FFFFFF" />}</g>
        <LinePath
          data={data}
          x={(d) => xScale(d.x) ?? 0}
          y={(d) => yScale(d.y) ?? 0}
          stroke={'solid' in stroke ? stroke.solid : "url('#gradient')"}
          strokeWidth={strokeWidth}
        />
        <Bar
          width={width}
          height={height}
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
          fill={'transparent'}
        />
      </svg>
    </div>
  )
}

export default function LineGraph({
  data,
  stroke = { solid: '#0993EC' },
  strokeWidth = 1.5,
  overrideFigure = (f) => {},
  overrideDate = (d) => {},
}: LineGraphProps): JSX.Element {
  return (
    <>
      {data && (
        <AutoSizer>
          {({ width, height }) => (
            <Graph {...{ data, stroke, strokeWidth, width, height, overrideDate, overrideFigure }} />
          )}
        </AutoSizer>
      )}
    </>
  )
}
