import { Currency, Token } from '@sushiswap/core-sdk'
import { TokenList } from '@uniswap/token-lists'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import useLast from 'app/hooks/useLast'
import usePrevious from 'app/hooks/usePrevious'
import { WrappedTokenInfo } from 'app/state/lists/wrappedTokenInfo'
import React, { useCallback, useEffect, useState } from 'react'

import CurrencyModalView from './CurrencyModalView'
import { CurrencySearch } from './CurrencySearch'
import ImportList from './ImportList'
import { ImportToken } from './ImportToken'
import Manage from './Manage'

interface CurrencySearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  currencyList?: string[]
  includeNativeCurrency?: boolean
  allowManageTokenList?: boolean
  hideBalance?: boolean
  showSearch?: boolean
}

function CurrencySearchModal({
  isOpen,
  onDismiss,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  currencyList,
  showCommonBases = false,
  showSearch = true,
  includeNativeCurrency = true,
  allowManageTokenList = true,
  hideBalance = false,
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
  const minHeight = modalView === CurrencyModalView.importToken || modalView === CurrencyModalView.importList ? 40 : 75

  return (
    <HeadlessUiModal.Controlled isOpen={isOpen} onDismiss={onDismiss}>
      <div className="lg:max-h-[92vh] lg:h-[40rem] h-full">
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
            currencyList={currencyList}
            includeNativeCurrency={includeNativeCurrency}
            allowManageTokenList={allowManageTokenList}
          />
        ) : modalView === CurrencyModalView.importToken && importToken ? (
          <ImportToken
            tokens={[importToken]}
            onDismiss={onDismiss}
            list={importToken instanceof WrappedTokenInfo ? importToken.list : undefined}
            onBack={() =>
              setModalView(prevView && prevView !== CurrencyModalView.importToken ? prevView : CurrencyModalView.search)
            }
            handleCurrencySelect={handleCurrencySelect}
          />
        ) : modalView === CurrencyModalView.importList && importList && listURL ? (
          <ImportList list={importList} listURL={listURL} onDismiss={onDismiss} setModalView={setModalView} />
        ) : modalView === CurrencyModalView.manage ? (
          <Manage
            onDismiss={onDismiss}
            setModalView={setModalView}
            setImportToken={setImportToken}
            setImportList={setImportList}
            setListUrl={setListUrl}
          />
        ) : (
          ''
        )}
      </div>
    </HeadlessUiModal.Controlled>
  )
}

export default CurrencySearchModal
