import React, { useState } from 'react'
import styled from 'styled-components'
import { useActiveWeb3React } from 'hooks'
import useTheme from 'hooks/useTheme'
import DepositGraphic from 'assets/kashi/deposit-graphic.png'
import { Card, Layout, LendCardHeader, BackButton } from '../components'

import { Input as NumericalInput } from 'components/NumericalInput'

export const InputRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 10px;
  // background-color: #2e3348;
  // padding: 0.75rem 0.5rem 0.75rem 1rem;
`

export const StyledBalanceMax = styled.button`
  height: 28px;
  padding-right: 8px;
  padding-left: 8px;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: ${({ theme }) => theme.borderRadius};
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.primaryText1};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

export const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.mediumEmphesisText};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 0;
`

const CreatePair = () => {
  const { account, chainId } = useActiveWeb3React()
  const theme = useTheme()

  return (
    <Layout
      left={
        <Card
          backgroundImage={DepositGraphic}
          title={'Add collateral in order to borrow assets'}
          description={
            'Gain exposure to tokens without reducing your assets. Leverage will enable you to take short positions against assets and earn from downside movements.'
          }
        />
      }
    >
      <Card
        header={
          <LendCardHeader>
            <div className="flex items-center">
              <div className="flex space-x-2 mr-4"></div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <BackButton defaultRoute={'/bento/kashi/lend'} />
                  <div className="text-3xl text-high-emphesis">Create a Market</div>
                </div>
              </div>
            </div>
          </LendCardHeader>
        }
      >
        <div className="flex justify-between mb-8 w-full">
          <InputRow>
            <NumericalInput
              value={0.0}
              onUserInput={() => console.log('input')}
              style={{
                display: 'flex',
                backgroundColor: '#2E3348',
                padding: '0.75rem ',
                borderRadius: '10px'
              }}
            />
          </InputRow>
        </div>
      </Card>
    </Layout>
  )
}

export default CreatePair
