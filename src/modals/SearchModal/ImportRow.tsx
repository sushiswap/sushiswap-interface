import { AutoRow, RowFixed } from '../../components/Row'
import React, { CSSProperties } from 'react'
import { useIsTokenActive, useIsUserAddedToken } from '../../hooks/Tokens'

import { AutoColumn } from '../../components/Column'
import Button from '../../components/Button'
import { CheckCircle } from 'react-feather'
import CurrencyLogo from '../../components/CurrencyLogo'
import ListLogo from '../../components/ListLogo'
import { Token } from '@sushiswap/sdk'
import styled from 'styled-components'
import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo'

const TokenSection = styled.div<{ dim?: boolean }>`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto;
  grid-gap: 16px;
  align-items: center;

  opacity: ${({ dim }) => (dim ? '0.4' : '1')};
`

const CheckIcon = styled(CheckCircle)`
  height: 16px;
  width: 16px;
  margin-right: 6px;
  // stroke: ${({ theme }) => theme.green1};
`

const NameOverflow = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
  font-size: 12px;
`

export default function ImportRow({
  token,
  style,
  dim,
  showImportView,
  setImportToken,
}: {
  token: Token
  style?: CSSProperties
  dim?: boolean
  showImportView: () => void
  setImportToken: (token: Token) => void
}) {
  // check if already active on list or local storage tokens
  const isAdded = useIsUserAddedToken(token)
  const isActive = useIsTokenActive(token)

  const list = token instanceof WrappedTokenInfo ? token.list : undefined

  return (
    <TokenSection style={style}>
      <CurrencyLogo currency={token} size={'24px'} style={{ opacity: dim ? '0.6' : '1' }} />
      <AutoColumn gap="4px" style={{ opacity: dim ? '0.6' : '1' }}>
        <AutoRow align="center">
          <div className="font-semibold">{token.symbol}</div>
          <div className="ml-2 font-light">
            <NameOverflow title={token.name}>{token.name}</NameOverflow>
          </div>
        </AutoRow>
        {list && list.logoURI && (
          <RowFixed align="center">
            <div className="mr-1 text-sm">via {list.name}</div>
            <ListLogo logoURI={list.logoURI} size="12px" />
          </RowFixed>
        )}
      </AutoColumn>
      {!isActive && !isAdded ? (
        <Button
          color="gradient"
          size="xs"
          style={{
            width: 'fit-content',
            padding: '6px 12px',
          }}
          onClick={() => {
            setImportToken && setImportToken(token)
            showImportView()
          }}
        >
          Import
        </Button>
      ) : (
        <RowFixed style={{ minWidth: 'fit-content' }}>
          <CheckIcon />
          <div className="text-green">Active</div>
        </RowFixed>
      )}
    </TokenSection>
  )
}
