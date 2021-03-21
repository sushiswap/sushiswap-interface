import styled from 'styled-components'

export const Warning = styled.div<{ predicate: boolean }>`
  display: ${({ predicate }) => (predicate ? 'block' : 'none')} 
  color: ${({ theme }) => theme.alertYellow};
  font-size: 16px;
`
