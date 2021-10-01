import React, { useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

import Column from '../../components/Column'
import CurrencyModalView from './CurrencyModalView'
import ManageLists from './ManageLists'
import ManageTokens from './ManageTokens'
import ModalHeader from '../../components/ModalHeader'
import { Token } from '@sushiswap/sdk'
import { TokenList } from '@uniswap/token-lists'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { classNames } from '../../functions'

function Manage({
  onDismiss,
  setModalView,
  setImportList,
  setImportToken,
  setListUrl,
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
    <div className="flex flex-col max-h-[inherit]">
      <ModalHeader
        onClose={onDismiss}
        title={i18n._(t`Manage`)}
        onBack={() => setModalView(CurrencyModalView.search)}
      />
      <div className="flex p-1 rounded bg-dark-800">
        {[i18n._(t`Lists`), i18n._(t`Tokens`)].map((title, i) => (
          <div
            className={classNames(
              tabIndex === i && 'bg-dark-900 text-high-emphesis',
              'flex items-center justify-center flex-1 px-1 py-2 text-lg rounded cursor-pointer select-none text-secondary hover:text-primary focus:outline-none'
            )}
            onClick={() => setTabIndex(i)}
          >
            {title}
          </div>
        ))}
      </div>
      <div className="h-screen">
        {tabIndex === 0 && (
          <AutoSizer disableWidth>
            {({ height }) => (
              <ManageLists
                height={height}
                setModalView={setModalView}
                setImportList={setImportList}
                setListUrl={setListUrl}
              />
            )}
          </AutoSizer>
        )}
        {tabIndex === 1 && <ManageTokens setModalView={setModalView} setImportToken={setImportToken} />}
      </div>
    </div>
  )
}

export default Manage
