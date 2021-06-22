import { AlertCircle, CheckCircle } from 'react-feather'

import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'
import ExternalLink from '../../components/ExternalLink'
import React from 'react'
import { getExplorerLink } from '../../functions/explorer'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`

export default function TransactionPopup({
  hash,
  success,
  summary,
}: {
  hash: string
  success?: boolean
  summary?: string
}) {
  const { chainId } = useActiveWeb3React()

  return (
    <RowNoFlex style={{ zIndex: 1000 }}>
      <div style={{ paddingRight: 16 }}>
        {success ? <CheckCircle className="text-2xl text-green" /> : <AlertCircle className="text-2xl text-red" />}
      </div>
      <AutoColumn gap="sm">
        <div className="font-medium">{summary ?? 'Hash: ' + hash.slice(0, 8) + '...' + hash.slice(58, 65)}</div>
        {chainId && <ExternalLink href={getExplorerLink(chainId, hash, 'transaction')}>View on explorer</ExternalLink>}
      </AutoColumn>
    </RowNoFlex>
  )
}
