import React, { FC } from 'react'

import styled from 'styled-components'

export const Column: FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...rest }) => (
    <div className="flex flex-col justify-start" {...rest}>
        {children}
    </div>
)

export const ColumnCenter = styled(Column)`
    width: 100%;
    align-items: center;
`

export const AutoColumn = styled.div<{
    gap?: 'sm' | 'md' | 'lg' | string
    justify?: 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'space-between'
}>`
    display: grid;
    grid-auto-rows: auto;
    grid-row-gap: ${({ gap }) =>
        (gap === 'sm' && '8px') || (gap === 'md' && '12px') || (gap === 'lg' && '24px') || gap};
    justify-items: ${({ justify }) => justify && justify};
`

export default Column
