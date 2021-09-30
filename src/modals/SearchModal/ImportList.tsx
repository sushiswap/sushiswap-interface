import { AlertTriangle } from 'react-feather'
import { Checkbox, TextDot } from './styleds'
import React, { useCallback, useState } from 'react'
import { enableList, removeList } from '../../state/lists/actions'

import { AppDispatch } from '../../state'
import { AutoColumn } from '../../components/Column'
import Button from '../../components/Button'
import CurrencyModalView from './CurrencyModalView'
import ExternalLink from '../../components/ExternalLink'
import ListLogo from '../../components/ListLogo'
import ReactGA from 'react-ga'
import { TokenList } from '@uniswap/token-lists'
import { useAllLists } from '../../state/lists/hooks'
import { useDispatch } from 'react-redux'
import { useFetchListCallback } from '../../hooks/useFetchListCallback'
import ModalHeader from '../../components/ModalHeader'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'

interface ImportProps {
  listURL: string
  list: TokenList
  onDismiss: () => void
  setModalView: (view: CurrencyModalView) => void
}

function ImportList({ listURL, list, setModalView, onDismiss }: ImportProps) {
  const dispatch = useDispatch<AppDispatch>()

  const { i18n } = useLingui()

  // user must accept
  const [confirmed, setConfirmed] = useState(false)

  const lists = useAllLists()
  const fetchList = useFetchListCallback()

  // monitor is list is loading
  const adding = Boolean(lists[listURL]?.loadingRequestId)
  const [addError, setAddError] = useState<string | null>(null)

  const handleAddList = useCallback(() => {
    if (adding) return
    setAddError(null)
    fetchList(listURL)
      .then(() => {
        ReactGA.event({
          category: 'Lists',
          action: 'Add List',
          label: listURL,
        })

        // turn list on
        dispatch(enableList(listURL))
        // go back to lists
        setModalView(CurrencyModalView.manage)
      })
      .catch((error) => {
        ReactGA.event({
          category: 'Lists',
          action: 'Add List Failed',
          label: listURL,
        })
        setAddError(error.message)
        dispatch(removeList(listURL))
      })
  }, [adding, dispatch, fetchList, listURL, setModalView])

  return (
    <div>
      <ModalHeader
        onClose={onDismiss}
        title={i18n._(t`Import List`)}
        onBack={() => setModalView(CurrencyModalView.manage)}
      />
      <div className="px-1 space-y-4">
        <div className="flex flex-row items-center px-4">
          {list.logoURI && <ListLogo logoURI={list.logoURI} size="50px" />}
          <AutoColumn gap="sm" style={{ marginLeft: '20px' }}>
            <div className="flex flex-row">
              <div className="mr-1.5 font-semibold">{list.name}</div>
              <TextDot />
              <div className="ml-1.5">{list.tokens.length} tokens</div>
            </div>
            <ExternalLink className="overflow-hidden" href={`https://tokenlists.org/token-list?url=${listURL}`}>
              <div className="overflow-hidden font-sm text-blue overflow-ellipsis whitespace-nowrap">{listURL}</div>
            </ExternalLink>
          </AutoColumn>
        </div>
        <div className="space-y-2">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertTriangle className="text-red" stroke="currentColor" size={32} />
            <div className="text-lg font-medium text-red">Import at your own risk </div>
          </div>

          <div className="flex flex-col mb-3 space-y-4 text-center whitespace-pre-line">
            <div className="font-semibold text-red">
              By adding this list you are implicitly trusting that the data is correct. Anyone can create a list,
              including creating fake versions of existing lists and lists that claim to represent projects that do not
              have one.
            </div>
            <div className="font-semibold text-red">
              If you purchase a token from this list, you may not be able to sell it back.
            </div>
          </div>
          <div className="flex flex-row justify-center cursor-pointer" onClick={() => setConfirmed(!confirmed)}>
            <Checkbox name="confirmed" type="checkbox" checked={confirmed} onChange={() => setConfirmed(!confirmed)} />
            <div className="text-red ml-2.5 font-medium">I understand</div>
          </div>

          <Button
            color="gradient"
            size="default"
            style={{
              padding: '10px 1rem',
            }}
            className="w-full"
            disabled={!confirmed}
            onClick={handleAddList}
          >
            Import
          </Button>
        </div>
        {addError ? (
          <div title={addError} style={{ textOverflow: 'ellipsis', overflow: 'hidden' }} className="text-red">
            {addError}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ImportList
