import React, { useCallback, useMemo } from 'react'
import { TokenList, diffTokenLists } from '@uniswap/token-lists'

import { AppDispatch } from '../../state'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'
import { ButtonSecondary } from '../ButtonLegacy'
import ReactGA from 'react-ga'
import { Text } from 'rebass'
import { acceptListUpdate } from '../../state/lists/actions'
import { listVersionLabel } from '../../functions/list'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { useRemovePopup } from '../../state/application/hooks'

export const ChangesList = styled.ul`
    max-height: 400px;
    overflow: auto;
`

export default function ListUpdatePopup({
    popKey,
    listUrl,
    oldList,
    newList,
    auto
}: {
    popKey: string
    listUrl: string
    oldList: TokenList
    newList: TokenList
    auto: boolean
}) {
    const removePopup = useRemovePopup()
    const removeThisPopup = useCallback(() => removePopup(popKey), [popKey, removePopup])
    const dispatch = useDispatch<AppDispatch>()

    const handleAcceptUpdate = useCallback(() => {
        if (auto) return
        ReactGA.event({
            category: 'Lists',
            action: 'Update List from Popup',
            label: listUrl
        })
        dispatch(acceptListUpdate(listUrl))
        removeThisPopup()
    }, [auto, dispatch, listUrl, removeThisPopup])

    const { added: tokensAdded, changed: tokensChanged, removed: tokensRemoved } = useMemo(() => {
        return diffTokenLists(oldList.tokens, newList.tokens)
    }, [newList.tokens, oldList.tokens])
    const numTokensChanged = useMemo(
        () =>
            Object.keys(tokensChanged).reduce(
                (memo, chainId: any) => memo + Object.keys(tokensChanged[chainId]).length,
                0
            ),
        [tokensChanged]
    )

    return (
        <AutoRow>
            <AutoColumn style={{ flex: '1' }} gap="8px">
                {auto ? (
                    <div className="font-medium">
                        The token list &quot;{oldList.name}&quot; has been updated to{' '}
                        <strong>{listVersionLabel(newList.version)}</strong>.
                    </div>
                ) : (
                    <>
                        <div>
                            <Text>
                                An update is available for the token list &quot;{oldList.name}&quot; (
                                {listVersionLabel(oldList.version)} to {listVersionLabel(newList.version)}).
                            </Text>
                            <ChangesList>
                                {tokensAdded.length > 0 ? (
                                    <li>
                                        {tokensAdded.map((token, i) => (
                                            <React.Fragment key={`${token.chainId}-${token.address}`}>
                                                <strong title={token.address}>{token.symbol}</strong>
                                                {i === tokensAdded.length - 1 ? null : ', '}
                                            </React.Fragment>
                                        ))}{' '}
                                        added
                                    </li>
                                ) : null}
                                {tokensRemoved.length > 0 ? (
                                    <li>
                                        {tokensRemoved.map((token, i) => (
                                            <React.Fragment key={`${token.chainId}-${token.address}`}>
                                                <strong title={token.address}>{token.symbol}</strong>
                                                {i === tokensRemoved.length - 1 ? null : ', '}
                                            </React.Fragment>
                                        ))}{' '}
                                        removed
                                    </li>
                                ) : null}
                                {numTokensChanged > 0 ? <li>{numTokensChanged} tokens updated</li> : null}
                            </ChangesList>
                        </div>
                        <AutoRow>
                            <div style={{ flexGrow: 1, marginRight: 12 }}>
                                <ButtonSecondary onClick={handleAcceptUpdate}>Accept update</ButtonSecondary>
                            </div>
                            <div style={{ flexGrow: 1 }}>
                                <ButtonSecondary onClick={removeThisPopup}>Dismiss</ButtonSecondary>
                            </div>
                        </AutoRow>
                    </>
                )}
            </AutoColumn>
        </AutoRow>
    )
}
