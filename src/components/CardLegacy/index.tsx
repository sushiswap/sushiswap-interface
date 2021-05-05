import React from 'react'
import { CardProps, Text } from 'rebass'
import { Box } from 'rebass/styled-components'
import styled, { keyframes } from 'styled-components'

const Card = styled(Box)<{ width?: string; padding?: string; border?: string; borderRadius?: string }>`
    width: ${({ width }) => width ?? '100%'};
    border-radius: 10px;
    padding: 1.25rem;
    padding: ${({ padding }) => padding};
    border: ${({ border }) => border};
    border-radius: ${({ borderRadius }) => borderRadius};
`
export default Card

export const LightCard = styled(Card)`
    border: 1px solid ${({ theme }) => theme.bg2};
    background-color: ${({ theme }) => theme.bg1};
`

const sheen = keyframes`{
    100% {
      transform: rotateZ(60deg) translate(1em, -40em);
    }
  }`

export const DarkCard = styled(Card)`
    overflow: hidden;
    background-origin: border-box;
    position: relative;
    background-color: #0d0d1f;
    &:hover {
        background-origin: border-box;
        &::after {
            animation: ${sheen} 0.4s forwards;
        }
    }
    &::after {
        content: '';
        position: absolute;
        top: -80%;
        right: -20%;
        bottom: -50%;
        left: -120%;
        background: linear-gradient(
            to bottom,
            rgba(229, 172, 142, 0),
            rgba(255, 255, 255, 0.5) 50%,
            rgba(229, 172, 142, 0)
        );
        transform: rotateZ(70deg) translate(-5em, 7.5em);
    }
`

export const DarkBlueCard = styled(Card)`
    overflow: hidden;
    background-origin: border-box;
    position: relative;
    background-color: #12182c;
    &:hover {
        background-origin: border-box;
        &::after {
            animation: ${sheen} 0.4s forwards;
        }
    }
    &::after {
        content: '';
        position: absolute;
        top: -80%;
        right: -20%;
        bottom: -50%;
        left: -120%;
        background: linear-gradient(
            to bottom,
            rgba(229, 172, 142, 0),
            rgba(255, 255, 255, 0.5) 50%,
            rgba(229, 172, 142, 0)
        );
        transform: rotateZ(70deg) translate(-5em, 7.5em);
    }
`

export const LightGreyCard = styled(Card)`
    background-color: ${({ theme }) => theme.bg2};
`

export const GreyCard = styled(Card)`
    background-color: ${({ theme }) => theme.bg3};
`

export const OutlineCard = styled(Card)`
    border: 1px solid ${({ theme }) => theme.bg3};
`

export const YellowCard = styled(Card)`
    background-color: rgba(243, 132, 30, 0.05);
    color: ${({ theme }) => theme.yellow2};
    font-weight: 500;
`

export const PinkCard = styled(Card)`
    background-color: rgba(255, 0, 122, 0.03);
    color: ${({ theme }) => theme.primary1};
    font-weight: 500;
`

const BlueCardStyled = styled(Card)`
    background-color: ${({ theme }) => theme.primary5};
    color: ${({ theme }) => theme.primary1};
    border-radius: ${({ theme }) => theme.borderRadius};
    width: fit-content;
`

export const BlueCard = ({ children, ...rest }: CardProps) => {
    return (
        <BlueCardStyled {...rest}>
            <Text fontWeight={500} color="#0094ec">
                {children}
            </Text>
        </BlueCardStyled>
    )
}
