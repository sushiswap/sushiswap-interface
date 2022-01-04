import { Token } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import CurrencyLogo from 'app/components/CurrencyLogo'
import ListLogo from 'app/components/ListLogo'
import { RowFixed } from 'app/components/Row'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import { useIsTokenActive, useIsUserAddedToken } from 'app/hooks/Tokens'
import { WrappedTokenInfo } from 'app/state/lists/wrappedTokenInfo'
import React, { CSSProperties } from 'react'

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
        'flex items-center w-full hover:bg-dark-800 px-6 h-[56px]',
        dim ? 'opacity-60' : 'opacity-100'
      )}
      style={style}
      // disabled={isSelected}
      // selected={otherSelected}
    >
      <div className="flex items-center justify-between rounded cursor-pointer gap-2 flex-grow">
        <div className="flex flex-row items-center gap-3 flex-grow">
          <CurrencyLogo currency={token} size={32} className="rounded-full" />
          <div className="flex flex-col">
            <Typography variant="xs" className="text-secondary">
              {token.name}
            </Typography>
            <Typography variant="sm" weight={700} className="text-high-emphesis">
              {token.symbol}
            </Typography>
          </div>
          {list && list.logoURI && (
            <RowFixed align="center">
              <div className="mr-1 text-sm">via {list?.name}</div>
              <ListLogo logoURI={list?.logoURI} size="12px" />
            </RowFixed>
          )}
        </div>
        <div className="flex items-center">
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
      </div>
    </div>
  )
}
