import { AxisBottom, AxisLeft } from '@visx/axis'
import { curveNatural } from '@visx/curve'
import { Group } from '@visx/group'
import { LinePath } from '@visx/shape'
import millify from 'millify'
import React from 'react'

// Initialize some variables
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

// accessors
// @ts-ignore TYPE NEEDS FIXING
const getX = (d) => new Date(d.date)
// @ts-ignore TYPE NEEDS FIXING
const getY = (d) => Number(d.value)

export default function CurveChart({
  // @ts-ignore TYPE NEEDS FIXING
  data,
  gradientColor = undefined,
  index = undefined,
  even = undefined,
  height = undefined,
  // @ts-ignore TYPE NEEDS FIXING
  width,
  yMax = undefined,
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  xScale = undefined,
  yScale = undefined,
  hideBottomAxis = false,
  hideLeftAxis = false,
  top = undefined,
  left = undefined,
  children = undefined,
  stroke = undefined,
  strokeWidth = undefined,
  strokeOpacity = undefined,
  markerMid = undefined,
  markerStart = undefined,
  markerEnd = undefined,
}) {
  if (width < 10) return null
  return (
    <Group left={left || margin.left} top={top || margin.top}>
      <LinePath
        curve={curveNatural}
        data={data}
        // @ts-ignore TYPE NEEDS FIXING
        x={(d) => xScale(getX(d)) ?? 0}
        // @ts-ignore TYPE NEEDS FIXING
        y={(d) => yScale(getY(d)) ?? 0}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
        shapeRendering="geometricPrecision"
        markerMid={markerMid}
        markerStart={markerStart}
        markerEnd={markerEnd}
      />
      {!hideBottomAxis && (
        <AxisBottom
          top={yMax}
          // @ts-ignore TYPE NEEDS FIXING
          scale={xScale}
          numTicks={width > 520 ? 10 : 5}
          stroke={axisColor}
          tickStroke={axisColor}
          tickLabelProps={() => axisBottomTickLabelProps}
        />
      )}
      {!hideLeftAxis && (
        <AxisLeft
          // @ts-ignore TYPE NEEDS FIXING
          scale={yScale}
          numTicks={5}
          tickFormat={millify as any}
          stroke={axisColor}
          tickStroke={axisColor}
          tickLabelProps={() => axisLeftTickLabelProps}
        />
      )}
      {children}
    </Group>
  )
}
