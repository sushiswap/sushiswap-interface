import { AxisBottom, AxisLeft, AxisScale } from '@visx/axis'
import { GradientTealBlue, LinearGradient } from '@visx/gradient'

import { Group } from '@visx/group'
import { LinePath } from '@visx/shape'
import React from 'react'
import { curveNatural } from '@visx/curve'
import millify from 'millify'

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
const getX = (d) => new Date(d.date)
const getY = (d) => Number(d.value)

export default function CurveChart({
  data,
  gradientColor = undefined,
  index = undefined,
  even = undefined,
  height = undefined,
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
        x={(d) => xScale(getX(d)) ?? 0}
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
          scale={xScale}
          numTicks={width > 520 ? 10 : 5}
          stroke={axisColor}
          tickStroke={axisColor}
          tickLabelProps={() => axisBottomTickLabelProps}
        />
      )}
      {!hideLeftAxis && (
        <AxisLeft
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
