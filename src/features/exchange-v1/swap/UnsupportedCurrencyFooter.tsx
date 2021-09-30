import { AutoRow, RowBetween } from '../../../components/Row'
import { Currency, Token } from '@sushiswap/sdk'
import React, { useState } from 'react'

import { AutoColumn } from '../../../components/Column'
import Button from '../../../components/Button'
import CloseIcon from '../../../components/CloseIcon'
import CurrencyLogo from '../../../components/CurrencyLogo'
import ExternalLink from '../../../components/ExternalLink'
import Modal from '../../../components/Modal'
import { getExplorerLink } from '../../../functions/explorer'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../../hooks/useActiveWeb3React'
import { useUnsupportedTokens } from '../../../hooks/Tokens'

const DetailsFooter = styled.div<{ show: boolean }>`
  padding-top: calc(16px + 2rem);
  padding-bottom: 20px;
  margin-top: -2rem;
  width: 100%;
  //max-width: 400px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  // color: ${({ theme }) => theme.text2};
  // background-color: ${({ theme }) => theme.advancedBG};
  z-index: -1;

  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  transition: transform 300ms ease-in-out;
  text-align: center;
`

const AddressText = styled.div`
  font-size: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 10px;
`}
`

export default function UnsupportedCurrencyFooter({
  show,
  currencies,
}: {
  show: boolean
  currencies: (Currency | undefined)[]
}) {
  const { chainId } = useActiveWeb3React()
  const [showDetails, setShowDetails] = useState(false)

  const tokens =
    chainId && currencies
      ? currencies.map((currency) => {
          return currency?.wrapped
        })
      : []

  const unsupportedTokens: { [address: string]: Token } = useUnsupportedTokens()

  return (
    <DetailsFooter show={show}>
      <Modal isOpen={showDetails} onDismiss={() => setShowDetails(false)}>
        <div style={{ padding: '2rem' }}>
          <AutoColumn gap="lg">
            <RowBetween>
              <div>Unsupported Assets</div>

              <CloseIcon onClick={() => setShowDetails(false)} />
            </RowBetween>
            {tokens.map((token) => {
              return (
                token &&
                unsupportedTokens &&
                Object.keys(unsupportedTokens).includes(token.address) && (
                  <div className="border border-dark-700" key={token.address?.concat('not-supported')}>
                    <AutoColumn gap="10px">
                      <AutoRow gap="5px" align="center">
                        <CurrencyLogo currency={token} size={'24px'} />
                        <div className="font-medium">{token.symbol}</div>
                      </AutoRow>
                      {chainId && (
                        <ExternalLink href={getExplorerLink(chainId, token.address, 'address')}>
                          <AddressText>{token.address}</AddressText>
                        </ExternalLink>
                      )}
                    </AutoColumn>
                  </div>
                )
              )
            })}
            <AutoColumn gap="lg">
              <div className="font-medium">
                Some assets are not available through this interface because they may not work well with our smart
                contract or we are unable to allow trading for legal reasons.
              </div>
            </AutoColumn>
          </AutoColumn>
        </div>
      </Modal>
      <Button variant="empty" style={{ padding: '0px' }} onClick={() => setShowDetails(true)}>
        <div>Read more about unsupported assets</div>
      </Button>
    </DetailsFooter>
  )
}
