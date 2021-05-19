import { PaddedColumn, Separator } from './styleds'
import React, { useState } from 'react'

import { ArrowLeft } from 'react-feather'
import CloseIcon from '../CloseIcon'
import CurrencyModalView from './CurrencyModalView'
import ManageLists from './ManageLists'
import ManageTokens from './ManageTokens'
import { RowBetween } from '../Row'
import { Text } from 'rebass'
import { Token } from '@sushiswap/sdk'
import { TokenList } from '@uniswap/token-lists'
import styled from 'styled-components'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

const Wrapper = styled.div`
    width: 100%;
    position: relative;
    padding-bottom: 80px;
`

const ToggleWrapper = styled(RowBetween)`
    background-color: ${({ theme }) => theme.bg3};
    border-radius: ${({ theme }) => theme.borderRadius};
    padding: 6px;
`

const ToggleOption = styled.div<{ active?: boolean }>`
    width: 48%;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${({ theme }) => theme.borderRadius};
    font-weight: 600;
    background-color: ${({ theme, active }) => (active ? theme.bg1 : theme.bg3)};
    color: ${({ theme, active }) => (active ? theme.text1 : theme.text2)};
    user-select: none;

    :hover {
        cursor: pointer;
        opacity: 0.7;
    }
`

function Manage({
    onDismiss,
    setModalView,
    setImportList,
    setImportToken,
    setListUrl
}: {
    onDismiss: () => void
    setModalView: (view: CurrencyModalView) => void
    setImportToken: (token: Token) => void
    setImportList: (list: TokenList) => void
    setListUrl: (url: string) => void
}) {
    const { i18n } = useLingui()

    // toggle between tokens and lists
    const [showLists, setShowLists] = useState(true)

    return (
        <Wrapper>
            <PaddedColumn>
                <RowBetween>
                    <ArrowLeft style={{ cursor: 'pointer' }} onClick={() => setModalView(CurrencyModalView.search)} />
                    <Text fontWeight={500} fontSize={20}>
                        {i18n._(t`Manage`)}
                    </Text>
                    <CloseIcon onClick={onDismiss} />
                </RowBetween>
            </PaddedColumn>
            <Separator />
            <PaddedColumn style={{ paddingBottom: 0 }}>
                <ToggleWrapper>
                    <ToggleOption onClick={() => setShowLists(!showLists)} active={showLists}>
                        {i18n._(t`Lists`)}
                    </ToggleOption>
                    <ToggleOption onClick={() => setShowLists(!showLists)} active={!showLists}>
                        {i18n._(t`Tokens`)}
                    </ToggleOption>
                </ToggleWrapper>
            </PaddedColumn>
            {showLists ? (
                <ManageLists setModalView={setModalView} setImportList={setImportList} setListUrl={setListUrl} />
            ) : (
                <ManageTokens setModalView={setModalView} setImportToken={setImportToken} />
            )}
        </Wrapper>
    )
}

export default Manage
