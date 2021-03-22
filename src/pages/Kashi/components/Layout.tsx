import React from 'react'
import { Card, TeardropCard, Navigation } from '.'
import styled from 'styled-components'
import { TYPE } from 'theme'
import KashiLogo from 'assets/images/kashi-kanji-wires.png'
import { RowBetween } from 'components/Row'
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

const Kashi = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 8px;
`

interface LayoutProps {
  left?: JSX.Element
  children?: React.ReactChild | React.ReactChild[]
  right?: JSX.Element
}

export default function Layout({ left = undefined, children = undefined, right = undefined }: LayoutProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <RowBetween padding="0 16px 8px" align="flex-end">
        <Kashi>
          <img src={KashiLogo} style={{ width: '116px', marginRight: '12px' }} />
          <TYPE.extraLargeHeader color="extraHighEmphesisText">Kashi</TYPE.extraLargeHeader>
        </Kashi>
        <Navigation />
      </RowBetween>
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%'
        }}
      >
        <Left>
          <TYPE.largeHeader>Lorem Ipsum</TYPE.largeHeader>
          <TYPE.body>Lorem Ipsum</TYPE.body>
          Button
        </Left>
        <Center>{children}</Center>
        {right && <Right>{right}</Right>}
      </div>
    </div>
  )
}
