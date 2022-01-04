import { plural, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, Token } from '@sushiswap/core-sdk'
import { TokenList } from '@uniswap/token-lists/dist/types'
import Button from 'app/components/Button'
import { AutoColumn } from 'app/components/Column'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import ExternalLink from 'app/components/ExternalLink'
import ListLogo from 'app/components/ListLogo'
import ModalHeader from 'app/components/ModalHeader'
import { RowFixed } from 'app/components/Row'
import Typography from 'app/components/Typography'
import { getExplorerLink, shortenAddress } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { useAddUserToken } from 'app/state/user/hooks'
import React from 'react'
import { AlertTriangle } from 'react-feather'

interface ImportProps {
  tokens: Token[]
  list?: TokenList
  onBack?: () => void
  onDismiss?: () => void
  handleCurrencySelect?: (currency: Currency) => void
}

export function ImportToken({ tokens, list, onBack, onDismiss, handleCurrencySelect }: ImportProps) {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()

  const addToken = useAddUserToken()
  return (
    <div className="flex flex-col h-full">
      <ModalHeader
        onBack={onBack}
        onClose={onDismiss}
        title={`Import ${plural(tokens.length, { one: 'Token', many: 'Tokens' })}`}
      />
      <Typography className="text-center">
        {i18n._(
          t`This token doesn't appear on the active token list(s). Make sure this is the token that you want to trade.`
        )}
      </Typography>
      {tokens.map((token) => {
        return (
          <div key={'import' + token.address} className=".token-warning-container rounded p-5">
            <AutoColumn gap="10px" justify="center">
              <CurrencyLogo currency={token} size={'32px'} />
              <AutoColumn gap="4px" justify="center">
                <div className="mx-2 text-xl font-medium text-high-emphesis">{token.symbol}</div>
                <div className="text-sm font-light text-secondary">{token.name}</div>
              </AutoColumn>
              {chainId && (
                <ExternalLink href={getExplorerLink(chainId, token.address, 'address')}>
                  {shortenAddress(token.address)}
                </ExternalLink>
              )}
              {list !== undefined ? (
                <RowFixed align="center">
                  {list.logoURI && <ListLogo logoURI={list.logoURI} size="16px" />}
                  <div className="ml-2 text-sm text-secondary">via {list.name}</div>
                </RowFixed>
              ) : (
                <div>
                  <RowFixed align="center">
                    <AlertTriangle className="stroke-current text-red" size={24} />
                    <div className="ml-1 text-xs font-semibold text-red">Unknown Source</div>
                  </RowFixed>
                </div>
              )}
            </AutoColumn>
          </div>
        )
      })}
      <div className="flex flex-grow" />
      <Button
        color="gradient"
        onClick={() => {
          tokens.map((token) => addToken(token))
          handleCurrencySelect && handleCurrencySelect(tokens[0])
        }}
        className=".token-dismiss-button"
      >
        {i18n._(t`Import`)}
      </Button>
    </div>
  )
}
