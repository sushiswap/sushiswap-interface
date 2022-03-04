import { AxisBottom, AxisLeft } from '@visx/axis'
import { Brush } from '@visx/brush'
import { GridColumns, GridRows } from '@visx/grid'
import { Group } from '@visx/group'
import { LegendOrdinal } from '@visx/legend'
import { MarkerArrow, MarkerCross, MarkerLine, MarkerX } from '@visx/marker'
import { PatternLines } from '@visx/pattern'
import { scaleLinear, scaleOrdinal, scaleTime } from '@visx/scale'
// @ts-ignore TYPE NEEDS FIXING
import { extent } from 'd3-array'
// @ts-ignore TYPE NEEDS FIXING
import { timeFormat, timeParse } from 'd3-time-format'
import millify from 'millify'
import { useMemo, useState } from 'react'
import React from 'react'

import Curve from './Curve'

// @ts-ignore TYPE NEEDS FIXING
export const getX = (data) => new Date(data.date)
// @ts-ignore TYPE NEEDS FIXING
export const getY = (data) => data.value

const brushMargin = { top: 10, bottom: 15, left: 50, right: 20 }
const chartSeparation = 30
const PATTERN_ID = 'brush_pattern'

const accentColor = '#6c5efb'

const selectedBrushStyle = {
  fill: `url(#${PATTERN_ID})`,
  stroke: 'currentColor',
}

const parseDate = timeParse('%Y-%m-%d')

const format = timeFormat('%b %d')

// @ts-ignore TYPE NEEDS FIXING
const formatDate = (date) => format(parseDate(date))

const axisColor = 'currentColor'

const axisBottomTickLabelProps = {
  textAnchor: 'middle' as 'middle',
  fontFamily: 'Arial',
  fontSize: 10,
  fill: axisColor,
}
const axisLeftTickLabelProps = {
  dx: '-0.25em',
  dy: '0.25em',
  fontFamily: 'Arial',
  fontSize: 10,
  textAnchor: 'end' as 'end',
  fill: axisColor,
}

const purple1 = '#6c5efb'
const purple2 = '#c998ff'
const purple3 = '#a44afe'

const Curves = ({
  compact = false,
  // @ts-ignore TYPE NEEDS FIXING
  width,
  // @ts-ignore TYPE NEEDS FIXING
  height,
  margin = { top: 64, right: 32, bottom: 16, left: 64 },
  // @ts-ignore TYPE NEEDS FIXING
  data,
  title = undefined,
  labels = undefined,
  note = undefined,
  colors = [purple1, purple2, purple3],
}) => {
  // @ts-ignore TYPE NEEDS FIXING
  const allData = data.reduce((previousValue, currentValue) => previousValue.concat(currentValue), [])

  const [filteredData, setFilteredData] = useState(
    // @ts-ignore TYPE NEEDS FIXING
    data.map((curve) => curve.slice(curve.length - 30, curve.length - 1))
  )

  // @ts-ignore TYPE NEEDS FIXING
  const onBrushChange = (domain) => {
    if (!domain) return
    const { x0, x1, y0, y1 } = domain
    // @ts-ignore TYPE NEEDS FIXING
    const stockCopy = data.map((d) =>
      // @ts-ignore TYPE NEEDS FIXING
      d.filter((s) => {
        const x = getX(s).getTime()
        const y = getY(s)
        return x > x0 && x < x1 && y > y0 && y < y1
      })
    )
    setFilteredData(stockCopy)
  }

  const innerHeight = height - margin.top - margin.bottom

  const topChartBottomMargin = compact ? chartSeparation / 2 : chartSeparation + 10

  const topChartHeight = 0.8 * innerHeight - topChartBottomMargin

  const bottomChartHeight = innerHeight - topChartHeight - chartSeparation

  // Max
  const xMax = Math.max(width - margin.left - margin.right, 0)
  const yMax = Math.max(topChartHeight, 0)

  // scales
  const xScale = useMemo(
    () =>
      scaleTime({
        range: [0, xMax],
        domain: extent(
          // @ts-ignore TYPE NEEDS FIXING
          filteredData.reduce((previousValue, currentValue) => previousValue.concat(currentValue), []),
          getX
        ),
      }),
    [xMax, filteredData]
  )

  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [yMax, 0],
        domain: [
          Math.min(
            ...filteredData
              // @ts-ignore TYPE NEEDS FIXING
              .reduce((previousValue, currentValue) => previousValue.concat(currentValue), [])
              // @ts-ignore TYPE NEEDS FIXING
              .map((d) => getY(d))
          ),
          Math.max(
            ...filteredData
              // @ts-ignore TYPE NEEDS FIXING
              .reduce((previousValue, currentValue) => previousValue.concat(currentValue), [])
              // @ts-ignore TYPE NEEDS FIXING
              .map((d) => getY(d))
          ),
        ],
        nice: true,
      }),
    [yMax, filteredData]
  )

  const xBrushMax = Math.max(width - brushMargin.left - brushMargin.right, 0)
  const yBrushMax = Math.max(bottomChartHeight - brushMargin.top - brushMargin.bottom, 0)

  const brushXScale = useMemo(
    () =>
      scaleTime({
        range: [0, xBrushMax],
        domain: extent(allData, getX),
      }),
    [allData, xBrushMax]
  )
  const brushYScale = useMemo(
    () =>
      scaleLinear({
        range: [yBrushMax, 0],
        // @ts-ignore TYPE NEEDS FIXING
        domain: [Math.min(...allData.map((d) => getY(d))), Math.max(...allData.map((d) => getY(d)))],
        nice: true,
      }),
    [allData, yBrushMax]
  )

  const initialBrushPosition = useMemo(
    () => ({
      start: {
        x: brushXScale(getX(data[0][data[0].length >= 60 ? data[0].length - 60 : 0])),
      },
      end: { x: brushXScale(getX(data[0][data[0].length - 1])) },
    }),
    [brushXScale, data]
  )

  const colorScale = scaleOrdinal({
    domain: labels,
    range: colors,
  })

  if (width < 10) {
    return null
  }

  return (
    <div className="w-full h-full">
      {labels && (
        <div
          className="absolute flex justify-center w-full text-base"
          style={{
            top: margin.top / 2 - 10,
          }}
        >
          <LegendOrdinal scale={colorScale} direction="row" labelMargin="0 15px 0 0" />
        </div>
      )}

      {title && (
        <div
          className="absolute flex justify-center w-full text-base"
          style={{
            top: margin.top / 2 - 10,
          }}
        >
          {/*@ts-ignore TYPE NEEDS FIXING*/}
          <LegendOrdinal scale={scaleOrdinal({ domain: [title] })} direction="row" labelMargin="0 15px 0 0" />
        </div>
      )}

      {note && (
        <div
          className="absolute flex justify-end w-full text-sm"
          style={{
            top: margin.top / 2 - 10,
            right: margin.right,
          }}
        >
          {/*@ts-ignore TYPE NEEDS FIXING*/}
          <LegendOrdinal scale={scaleOrdinal({ domain: [note] })} direction="row" labelMargin="0 4px 0 0" />
        </div>
      )}

      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill="transparent" />
        <GridRows
          top={margin.top}
          left={margin.left}
          scale={yScale}
          width={xMax}
          height={yMax}
          strokeDasharray="1,3"
          stroke="currentColor"
          strokeOpacity={0.2}
          pointerEvents="none"
        />
        <GridColumns
          top={margin.top}
          left={margin.left}
          scale={xScale}
          height={yMax}
          strokeDasharray="1,3"
          stroke="currentColor"
          strokeOpacity={0.2}
          pointerEvents="none"
        />
        <Group top={margin.top} left={margin.left}>
          {width > 8 &&
            // @ts-ignore TYPE NEEDS FIXING
            filteredData.map((curve, i) => {
              const even = i % 2 === 0
              let markerStart = even ? 'url(#marker-cross)' : 'url(#marker-x)'
              if (i === 1) markerStart = 'url(#marker-line)'
              const markerEnd = even ? 'url(#marker-arrow)' : 'url(#marker-arrow-odd)'
              return (
                <Group
                  key={`chart-${i}`}
                  // top={margin.top}
                  // left={margin.left}
                  // right={margin.right}
                >
                  <MarkerX id="marker-x" stroke={colors[i]} size={22} strokeWidth={4} markerUnits="userSpaceOnUse" />
                  <MarkerCross
                    id="marker-cross"
                    stroke={colors[i]}
                    size={22}
                    strokeWidth={4}
                    strokeOpacity={0.6}
                    markerUnits="userSpaceOnUse"
                  />
                  {/* <MarkerCircle
                    id="marker-circle"
                    fill={colors[i]}
                    size={2}
                    refX={2}
                  /> */}
                  <MarkerArrow id="marker-arrow-odd" stroke={colors[i]} size={8} strokeWidth={1} />
                  <MarkerLine id="marker-line" fill={colors[i]} size={16} strokeWidth={1} />
                  <MarkerArrow id="marker-arrow" fill={colors[i]} refX={2} size={6} />
                  <Curve
                    hideBottomAxis
                    hideLeftAxis
                    data={curve}
                    width={width}
                    // @ts-ignore TYPE NEEDS FIXING
                    xScale={xScale}
                    // @ts-ignore TYPE NEEDS FIXING
                    yScale={yScale}
                    //@ts-ignore TYPE NEEDS FIXING
                    stroke={colors[i]}
                    // @ts-ignore TYPE NEEDS FIXING
                    strokeWidth={2}
                    // @ts-ignore TYPE NEEDS FIXING
                    strokeOpacity={1}
                    // @ts-ignore TYPE NEEDS FIXING
                    markerMid="url(#marker-circle)"
                    // @ts-ignore TYPE NEEDS FIXING
                    markerStart={markerStart}
                    // @ts-ignore TYPE NEEDS FIXING
                    markerEnd={markerEnd}
                  />
                </Group>
              )
            })}
          <AxisBottom
            top={yMax}
            scale={xScale}
            numTicks={width > 520 ? 10 : 5}
            stroke={axisColor}
            tickStroke={axisColor}
            tickLabelProps={() => axisBottomTickLabelProps}
          />
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={millify as any}
            stroke={axisColor}
            tickStroke={axisColor}
            tickLabelProps={() => axisLeftTickLabelProps}
          />
        </Group>

        <Group top={topChartHeight + topChartBottomMargin + margin.top} left={brushMargin.left}>
          {/*@ts-ignore TYPE NEEDS FIXING*/}
          {data.map((brushData, i) => {
            const even = i % 2 === 0
            let markerStart = even ? 'url(#marker-cross)' : 'url(#marker-x)'
            if (i === 1) markerStart = 'url(#marker-line)'
            const markerEnd = even ? 'url(#marker-arrow)' : 'url(#marker-arrow-odd)'
            return (
              <Curve
                // @ts-ignore TYPE NEEDS FIXING
                stroke={colors[i]}
                // @ts-ignore TYPE NEEDS FIXING
                strokeWidth={2}
                // @ts-ignore TYPE NEEDS FIXING
                strokeOpacity={1}
                hideBottomAxis
                hideLeftAxis
                data={brushData}
                width={width}
                // @ts-ignore TYPE NEEDS FIXING
                yMax={yBrushMax}
                // @ts-ignore TYPE NEEDS FIXING
                xScale={brushXScale}
                // @ts-ignore TYPE NEEDS FIXING
                yScale={brushYScale}
                key={i}
              />
            )
          })}
          <PatternLines
            id={PATTERN_ID}
            height={8}
            width={8}
            stroke={accentColor}
            strokeWidth={1}
            orientation={['diagonal']}
          />
          <Brush
            xScale={brushXScale}
            yScale={brushYScale}
            width={xBrushMax}
            height={yBrushMax}
            margin={brushMargin}
            handleSize={8}
            resizeTriggerAreas={['left', 'right']}
            brushDirection="horizontal"
            initialBrushPosition={initialBrushPosition}
            onChange={onBrushChange}
            onClick={() => setFilteredData(data)}
            selectedBoxStyle={selectedBrushStyle}
          />
        </Group>
      </svg>
    </div>
  )
}
export default Curves
