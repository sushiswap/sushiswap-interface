import { AlertCircle, CheckCircle } from 'react-feather'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'

import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'
import { ExternalLink } from '../../theme/components'
import { getExplorerLink } from '../../utils'
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

    const theme = useContext(ThemeContext)

    return (
        <RowNoFlex>
            <div style={{ paddingRight: 16 }}>
                {success ? (
                    <CheckCircle color={theme.green1} size={24} />
                ) : (
                    <AlertCircle color={theme.red1} size={24} />
                )}
            </div>
            <AutoColumn gap="8px">
                <div fontWeight={500}>{summary ?? 'Hash: ' + hash.slice(0, 8) + '...' + hash.slice(58, 65)}</div>
                {chainId && (
                    <ExternalLink href={getExplorerLink(chainId, hash, 'transaction')}>View on explorer</ExternalLink>
                )}
            </AutoColumn>
        </RowNoFlex>
    )
}
