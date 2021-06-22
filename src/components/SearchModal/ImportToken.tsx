import { AutoRow, RowFixed } from '../../components/Row'
import { Currency, Token } from '@sushiswap/sdk'
import React from 'react'
import { AlertTriangle } from 'react-feather'
import { AutoColumn } from '../Column'
import Button from '../Button'
import Card from '../Card'
import CurrencyLogo from '../CurrencyLogo'
import ExternalLink from '../ExternalLink'
import ListLogo from '../ListLogo'
import ModalHeader from '../ModalHeader'
import { TokenList } from '@uniswap/token-lists/dist/types'
import { getExplorerLink } from '../../functions/explorer'
import styled from 'styled-components'
import { transparentize } from 'polished'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useAddUserToken } from '../../state/user/hooks'
import Typography from '../Typography'
import { Plural, Trans } from '@lingui/macro'
import { shortenAddress } from '../../functions'

const WarningWrapper = styled(Card)<{ highWarning: boolean }>`
  // background-color: ${({ theme, highWarning }) =>
    highWarning ? transparentize(0.8, theme.red1) : transparentize(0.8, theme.yellow2)};
  width: fit-content;
`

interface ImportProps {
  tokens: Token[]
  list?: TokenList
  onBack?: () => void
  onDismiss?: () => void
  handleCurrencySelect?: (currency: Currency) => void
}

export function ImportToken({ tokens, list, onBack, onDismiss, handleCurrencySelect }: ImportProps) {
  const { chainId } = useActiveWeb3React()

  const addToken = useAddUserToken()
  return (
    <div className="relative w-full space-y-3 overflow-auto">
      <ModalHeader onBack={onBack} onClose={onDismiss} title={`Import ${tokens.length > 1 ? 'Tokens' : 'Token'}`} />
      <Typography className="text-center">
        <Trans>
          This token doesn&apos;t appear on the active token list(s). Make sure this is the token that you want to
          trade.
        </Trans>
      </Typography>
      {tokens.map((token) => {
        return (
          <div key={'import' + token.address} className=".token-warning-container bg-dark-800 rounded p-5">
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
                <WarningWrapper borderRadius="4px" padding="4px" highWarning={true}>
                  <RowFixed>
                    <AlertTriangle className="stroke-current text-red" size="10px" />
                    <div className="ml-1 text-xs font-semibold text-red">Unknown Source</div>
                  </RowFixed>
                </WarningWrapper>
              )}
            </AutoColumn>
          </div>
        )
      })}
      <Button
        color="gradient"
        onClick={() => {
          tokens.map((token) => addToken(token))
          handleCurrencySelect && handleCurrencySelect(tokens[0])
        }}
        className=".token-dismiss-button"
      >
        <Trans>Import</Trans>
      </Button>
    </div>
  )
}
