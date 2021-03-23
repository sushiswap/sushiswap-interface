import React from 'react'
import { BaseCard } from 'components/Card'
import styled from 'styled-components'

export const Card = styled(BaseCard)`
  border: none
  position: relative;
  overflow: hidden;
  padding: 0;
  border-radius: 20px;
`

export const TeardropCard = styled(BaseCard)`
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
  padding: 32px 32px 26px;
  border-bottom: 6px solid
    ${({ market, border, theme }) =>
      border ? `${market === 'Supply' ? theme.primaryBlue : theme.primaryPink}` : 'transparent'};
`

export default Card
