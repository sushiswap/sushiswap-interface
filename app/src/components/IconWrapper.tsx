import styled from 'styled-components'

// for wrapper react feather icons
const IconWrapper = styled.div<{
    stroke?: string
    size?: string
    marginRight?: string
    marginLeft?: string
}>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${({ size }) => size ?? '20px'};
    height: ${({ size }) => size ?? '20px'};
    margin-right: ${({ marginRight }) => marginRight ?? 0};
    margin-left: ${({ marginLeft }) => marginLeft ?? 0};
    & > * {
        // stroke: ${({ theme, stroke }) => stroke ?? theme.blue1};
    }
`

export default IconWrapper
