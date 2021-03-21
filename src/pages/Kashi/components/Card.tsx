import React from 'react'
import { BaseCard } from 'components/Card'
import styled from 'styled-components'

export const Card = styled(BaseCard)`
  border: none
  position: relative;
  overflow: hidden;
  padding: 0;
  border-radius: 35px 20px 35px 20px;
`

export const CardHeader = styled.div<{ border?: boolean; market?: string }>`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.mediumDarkPurple};
  border-radius: 30px 20px 0px 0px;
  padding: ${({ border }) => (border ? '32px 32px 26px' : '32px')}
  border-bottom: ${({ market, border, theme }) =>
    border ? `6px solid ${market === 'Supply' ? theme.primaryBlue : theme.primaryPink}` : 'none'};
`

export default Card
