import React from 'react'
import { Card, TeardropCard } from './Card'
import styled from 'styled-components'
import { TYPE } from 'theme'

// function Column() {
//   return (
//     <Card
//       style={{
//         flex: 1,
//         margin: '0 8px',
//         display: 'flex',
//         flexDirection: 'column'
//       }}
//     >
//       <div
//         style={{
//           display: 'flex'
//         }}
//       >
//         Content
//       </div>
//       Button
//     </Card>
//   )
// }

const Aside = styled(Card)`
  flex: 1;
  margin: 0 8px;
  display: flex;
  flex-direction: column;
  padding: 32px;
`

const Left = styled(Aside)`
  display: flex;
  max-width: 20%;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none
  `};
`

const Center = styled(TeardropCard)`
  display: flex;
  width: 50%;

  flex: 1;
  margin: 0 8px;
  display: flex;
  flex-direction: column;
`

const Right = styled(Aside)`
  display: flex;
  max-width: 30%;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none
  `};
`

interface LayoutProps {
  left?: JSX.Element
  children?: React.ReactChild | React.ReactChild[]
  right?: JSX.Element
}

export default function Layout({ left = undefined, children = undefined, right = undefined }: LayoutProps) {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%'
      }}
    >
      <Left>
        <TYPE.largeHeader fontWeight={700}>Lorem Ipsum</TYPE.largeHeader>
        <TYPE.body fontWeight={700}>Lorem Ipsum</TYPE.body>
        Button
      </Left>
      <Center>{children}</Center>
      <Right>
        <TYPE.largeHeader fontWeight={700}>Lorem Ipsum</TYPE.largeHeader>
        <TYPE.body fontWeight={700}>Lorem Ipsum</TYPE.body>
      </Right>
    </div>
  )
}
