import { PaddedColumn, Separator } from './styleds'
import React, { useState } from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'

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
    height: 100%;
    position: relative;
    padding-bottom: 80px;
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

    const [tabIndex, setTabIndex] = useState(0)

    return (
        <Wrapper>
            <PaddedColumn>
                <RowBetween>
                    <ArrowLeft style={{ cursor: 'pointer' }} onClick={() => setModalView(CurrencyModalView.search)} />
                    <Text className="font-medium text-lg">{i18n._(t`Manage`)}</Text>
                    <CloseIcon onClick={onDismiss} />
                </RowBetween>
            </PaddedColumn>
            <Separator />

            <Tabs forceRenderTabPanel selectedIndex={tabIndex} onSelect={(index: number) => setTabIndex(index)}>
                <TabList className="flex p-1 rounded bg-dark-800">
                    <Tab
                        className="flex items-center justify-center flex-1 px-3 py-4 text-lg rounded cursor-pointer select-none text-secondary hover:text-primary focus:outline-none"
                        selectedClassName="bg-dark-900 text-high-emphesis"
                    >
                        {i18n._(t`Lists`)}
                    </Tab>
                    <Tab
                        className="flex items-center justify-center flex-1 px-3 py-4 text-lg rounded cursor-pointer select-none text-secondary hover:text-primary focus:outline-none"
                        selectedClassName="bg-dark-900 text-high-emphesis"
                    >
                        {i18n._(t`Tokens`)}
                    </Tab>
                </TabList>
                <TabPanel>
                    <ManageLists setModalView={setModalView} setImportList={setImportList} setListUrl={setListUrl} />
                </TabPanel>
                <TabPanel>
                    <ManageTokens setModalView={setModalView} setImportToken={setImportToken} />
                </TabPanel>
            </Tabs>
        </Wrapper>
    )
}

export default Manage
