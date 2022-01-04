import { localPoint } from '@visx/event'
import { LinearGradient } from '@visx/gradient'
import { scaleLinear } from '@visx/scale'
import { Bar, LinePath } from '@visx/shape'
import { bisector } from 'd3-array'
import { FC, MouseEvent, TouchEvent, useRef } from 'react'
import { useCallback, useMemo } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

interface LineGraphProps {
  data: {
    x: number
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
  setSelectedIndex?: (x: number) => void
}

interface GraphProps extends LineGraphProps {
  width: number
  height: number
}

const bisect = bisector((d) => d.x).center

const Graph: FC<GraphProps> = ({ data, stroke, strokeWidth, width, height, setSelectedIndex }) => {
  const dRef = useRef<number>()
  const circleRef = useRef<SVGCircleElement>()
  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [Math.min(data[0].x, data[data.length - 1].x), Math.max(data[0].x, data[data.length - 1].x)],
        range: [10, width - 10],
      }),
    [data, width]
  )

  const yScale = useMemo(() => {
    const y = data.map((el) => el.y)
    return scaleLinear<number>({
      domain: [Math.max.apply(Math, y), Math.min.apply(Math, y)],
      range: [10, height - 10],
    })
  }, [data, height])

  const handleTooltip = useCallback(
    (event: TouchEvent<SVGRectElement> | MouseEvent<SVGRectElement>) => {
      const { x } = localPoint(event) || { x: 0 }
      const x0 = xScale.invert(x)
      const index = bisect(data, x0, 0)
      const d = data[index]

      // Add check to avoid unnecessary changes and setState to DOM
      if (d && dRef.current !== index) {
        dRef.current = index
        circleRef.current.setAttribute('cx', xScale(d.x).toString())
        circleRef.current.setAttribute('cy', yScale(d.y).toString())
        setSelectedIndex(index)
      }
    },
    [data, setSelectedIndex, xScale, yScale]
  )

  const showTooltip = useCallback(() => {
    circleRef.current.setAttribute('display', 'block')
  }, [])

  const hideTooltip = useCallback(() => {
    setSelectedIndex(data.length - 1)
    circleRef.current.setAttribute('display', 'none')
  }, [data, setSelectedIndex])

  return (
    <div className="w-full h-full">
      <svg width={width} height={height}>
        {'gradient' in stroke && (
          <LinearGradient id="gradient" from={stroke.gradient.from} to={stroke.gradient.to} vertical={false} />
        )}
        {setSelectedIndex && (
          <g>
            <circle ref={circleRef} r={4} fill={'solid' in stroke ? stroke.solid : '#ffffff'} display="none" />
          </g>
        )}
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
          fill={'transparent'}
          {...(setSelectedIndex && {
            onTouchStart: handleTooltip,
            onTouchMove: handleTooltip,
            onMouseEnter: showTooltip,
            onMouseMove: handleTooltip,
            onMouseLeave: hideTooltip,
          })}
        />
      </svg>
    </div>
  )
}

const LineGraph: FC<LineGraphProps> = ({
  data,
  stroke = { solid: '#0993EC' },
  strokeWidth = 1.5,
  setSelectedIndex,
}) => {
  if (data)
    return (
      <AutoSizer>
        {({ width, height }) => <Graph {...{ data, stroke, strokeWidth, width, height, setSelectedIndex }} />}
      </AutoSizer>
    )

  return <></>
}

export default LineGraph
