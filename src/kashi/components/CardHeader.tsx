import styled from 'styled-components'

const CardHeader = styled.div<{ border?: boolean; market?: string }>`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.extraDarkPurple};
  border-radius: 10px 10px 0 0;
  padding: 32px 32px 26px;
  border-bottom: 6px solid
    ${({ market, border, theme }) =>
      border ? `${market === 'Supply' ? theme.primaryBlue : theme.primaryPink}` : 'transparent'};
`

export default CardHeader
