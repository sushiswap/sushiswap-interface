import React from 'react'
import styled from 'styled-components'

const Left = styled.aside`
  min-width: 300px;
  max-wdith: 300px;
  background: ${({ theme }) => theme.baseCard};
`

const Right = styled.aside`
  min-width: 400px;
  max-wdith: 400px;
  background: ${({ theme }) => theme.baseCard};
`

interface Container {
  left?: JSX.Element
  children?: React.ReactChild | React.ReactChild[]
  right?: JSX.Element
}

export default function Container({ left = undefined, children, right = undefined }: Container) {
  return (
    <div style={{ display: 'flex' }}>
      {left && <Left>{left}</Left>}
      <div style={{ flex: 1 }}>{children}</div>
      {right && <Right>{right}</Right>}
    </div>
  )
}
