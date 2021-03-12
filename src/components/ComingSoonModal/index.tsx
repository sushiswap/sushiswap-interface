import React, { useCallback, useState } from 'react'
import { TYPE } from 'theme'
import Modal from '../Modal'
import Row, { AutoRow, RowBetween } from 'components/Row'
import Column, { AutoColumn } from 'components/Column'
import styled from 'styled-components'
import { X, PlusCircle } from 'react-feather'
import ComingSoonImage from '../../assets/images/coming-soon.png'
import BentoBox from '../../assets/images/bento-color.png'
import Kashi from '../../assets/images/kashi-color-flat.png'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  text-align: center;
`

const ModalUpper = styled(Column)`
  padding: 3rem 1rem 2rem;
  position: relative;
  background-color: #18212e;
  background-image: linear-gradient(-55deg, #18212e 50%, #202d3e 50%);
  z-index: 0;
`

const ModalLower = styled(Column)`
  padding: 3rem 1rem;
  background: #222636;
`

const StyledClose = styled(X)`
  position: absolute;
  right: 16px;
  top: 16px;

  :hover {
    cursor: pointer;
  }
`

const StyledPlus = styled(PlusCircle)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  background: white;
  padding: 2px;
  color: grey;
`

const StyledComingSoon = styled.img`
  position: absolute;
  width: 50%;
  height: auto;
  top: 100%;
  left: 50%;
  transform: translate(-50%, -50%);
`

export default function ComingSoonModal() {
  const [isOpen, setIsOpen] = useState(!localStorage.getItem('seenComingSoon'))
  // const isOpen = false
  const handleDismiss = useCallback(() => null, [])
  return (
    <Modal isOpen={isOpen} onDismiss={handleDismiss} maxHeight={90}>
      <Wrapper>
        <ModalUpper>
          <StyledPlus />
          <AutoColumn gap="md">
            <RowBetween>
              <div>
                <img width="66px" height="auto" src={BentoBox} />
                <TYPE.mediumHeader color="white">BentoBox</TYPE.mediumHeader>
              </div>
              <div>
                <img width="80px" height="auto" src={Kashi} />
              </div>
            </RowBetween>
          </AutoColumn>
          <StyledClose
            stroke="gray"
            onClick={() => {
              localStorage.setItem('seenComingSoon', 'true')
              setIsOpen(false)
            }}
          />
          <StyledComingSoon src={ComingSoonImage} />
        </ModalUpper>
        <ModalLower>
          <AutoRow gap="8px" justify="center">
            <TYPE.largeHeader color="white">
              Kashi Margin Trading <br />
              in BentoBox App
            </TYPE.largeHeader>
            <TYPE.subHeader fontWeight={600} fontSize={16} color="gray">
              BentoBox is a revolutionary way from SUSHI
              <br /> to interact with apps on L1 in a highly
              <br /> gas-efficient manner.
            </TYPE.subHeader>
            <TYPE.white fontWeight={400}>
              The first app in the BentoBox system is Kashi, a<br /> gas-optimised margin trading platform with
              <br /> risk-isolated lending pairs and short positions.
            </TYPE.white>
          </AutoRow>
        </ModalLower>
      </Wrapper>
    </Modal>
  )
}
