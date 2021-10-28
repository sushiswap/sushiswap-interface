import { AutoRow, RowFixed } from '../../components/Row'
import React, { CSSProperties } from 'react'
import { useIsTokenActive, useIsUserAddedToken } from '../../hooks/Tokens'

import { AutoColumn } from '../../components/Column'
import Button from '../../components/Button'
import CurrencyLogo from '../../components/CurrencyLogo'
import ListLogo from '../../components/ListLogo'
import { Token } from '@sushiswap/core-sdk'
import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo'
import { classNames } from '../../functions'

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
    <div
      className={classNames(
        'py-1 px-5 h-[56px] grid gap-4 align-center token-section',
        dim ? 'opacity-60' : 'opacity-100'
      )}
      style={style}
    >
      <CurrencyLogo currency={token} size={'24px'} style={{ opacity: dim ? '0.6' : '1' }} />
      <AutoColumn gap="4px" style={{ opacity: dim ? '0.6' : '1' }}>
        <AutoRow align="center">
          <div className="font-semibold">{token.symbol}</div>
          <div className="ml-2 font-light">
            <div
              title={token.name}
              className="whitespace-nowrap overflow-ellipsis overflow-hidden max-w-[140px] text-xs"
            >
              {token.name}
            </div>
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
          <div className="mr-1.5 w-4 h-4" />
          <div className="text-green">Active</div>
        </RowFixed>
      )}
    </div>
  )
}
