import { Currency, Token } from '@sushiswap/sdk'
import { TokenList } from '@uniswap/token-lists'
import usePrevious from 'hooks/usePrevious'
import React, { useCallback, useEffect, useState } from 'react'
import useLast from '../../hooks/useLast'
import Modal from '../Modal'
import { CurrencySearch } from './CurrencySearch'
import { ImportToken } from './ImportToken'
import ImportList from './ImportList'
import Manage from './Manage'
import CurrencyModalView from './CurrencyModalView'

interface CurrencySearchModalProps {
    isOpen: boolean
    onDismiss: () => void
    selectedCurrency?: Currency | null
    onCurrencySelect: (currency: Currency) => void
    otherSelectedCurrency?: Currency | null
    showCommonBases?: boolean
}

function CurrencySearchModal({
    isOpen,
    onDismiss,
    onCurrencySelect,
    selectedCurrency,
    otherSelectedCurrency,
    showCommonBases = false
}: CurrencySearchModalProps) {
    const [modalView, setModalView] = useState<CurrencyModalView>(CurrencyModalView.manage)
    const lastOpen = useLast(isOpen)

    useEffect(() => {
        if (isOpen && !lastOpen) {
            setModalView(CurrencyModalView.search)
        }
    }, [isOpen, lastOpen])

    const handleCurrencySelect = useCallback(
        (currency: Currency) => {
            onCurrencySelect(currency)
            onDismiss()
        },
        [onDismiss, onCurrencySelect]
    )

    // for token import view
    const prevView = usePrevious(modalView)

    // used for import token flow
    const [importToken, setImportToken] = useState<Token | undefined>()

    // used for import list
    const [importList, setImportList] = useState<TokenList | undefined>()
    const [listURL, setListUrl] = useState<string | undefined>()

    // change min height if not searching
    const minHeight =
        modalView === CurrencyModalView.importToken || modalView === CurrencyModalView.importList ? 40 : 80

    return (
        <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={80} minHeight={minHeight} noPadding={true}>
            {modalView === CurrencyModalView.search ? (
                <CurrencySearch
                    isOpen={isOpen}
                    onDismiss={onDismiss}
                    onCurrencySelect={handleCurrencySelect}
                    selectedCurrency={selectedCurrency}
                    otherSelectedCurrency={otherSelectedCurrency}
                    showCommonBases={showCommonBases}
                    showImportView={() => setModalView(CurrencyModalView.importToken)}
                    setImportToken={setImportToken}
                    showManageView={() => setModalView(CurrencyModalView.manage)}
                />
            ) : modalView === CurrencyModalView.importToken && importToken ? (
                <div className="p-0">
                    <ImportToken
                        tokens={[importToken]}
                        onDismiss={onDismiss}
                        onBack={() =>
                            setModalView(
                                prevView && prevView !== CurrencyModalView.importToken
                                    ? prevView
                                    : CurrencyModalView.search
                            )
                        }
                        handleCurrencySelect={handleCurrencySelect}
                    />
                </div>
            ) : modalView === CurrencyModalView.importList && importList && listURL ? (
                <div className="p-0">
                    <ImportList list={importList} listURL={listURL} onDismiss={onDismiss} setModalView={setModalView} />
                </div>
            ) : modalView === CurrencyModalView.manage ? (
                <div className="p-0">
                    <Manage
                        onDismiss={onDismiss}
                        setModalView={setModalView}
                        setImportToken={setImportToken}
                        setImportList={setImportList}
                        setListUrl={setListUrl}
                    />
                </div>
            ) : (
                ''
            )}
        </Modal>
    )
}

export default CurrencySearchModal
