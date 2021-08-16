import { AppDispatch, AppState } from '../../state'
import { CheckCircle, Settings } from 'react-feather'
import { AutoColumn } from '../../components/Column'
import { PaddedColumn } from './styleds'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Row, { RowBetween, RowFixed } from '../../components/Row'
import { acceptListUpdate, disableList, enableList, removeList } from '../../state/lists/actions'
import { useActiveListUrls, useAllLists, useIsListActive } from '../../state/lists/hooks'
import { useDispatch, useSelector } from 'react-redux'

import Button from '../../components/Button'
import CurrencyModalView from './CurrencyModalView'
import ExternalLink from '../../components/ExternalLink'
import ListLogo from '../../components/ListLogo'
import ListToggle from '../../components/Toggle/ListToggle'
import ReactGA from 'react-ga'
import { TokenList } from '@uniswap/token-lists'
import { UNSUPPORTED_LIST_URLS } from '../../constants/token-lists'
import { listVersionLabel } from '../../functions/list'
import { parseENSAddress } from '../../functions/ens'
import { uriToHttp } from '../../functions/convert'
import { useFetchListCallback } from '../../hooks/useFetchListCallback'
import { useListColor } from '../../hooks/useColor'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { usePopper } from 'react-popper'
import useToggle from '../../hooks/useToggle'
import { classNames } from '../../functions'

function listUrlRowHTMLId(listUrl: string) {
  return `list-row-${listUrl.replace(/\./g, '-')}`
}

const ListRow = memo(({ listUrl }: { listUrl: string }) => {
  const listsByUrl = useSelector<AppState, AppState['lists']['byUrl']>((state) => state.lists.byUrl)
  const dispatch = useDispatch<AppDispatch>()
  const { current: list, pendingUpdate: pending } = listsByUrl[listUrl]

  const listColor = useListColor(list?.logoURI)
  const isActive = useIsListActive(listUrl)

  const [open, toggle] = useToggle(false)
  const node = useRef<HTMLDivElement>()
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement>()
  const [popperElement, setPopperElement] = useState<HTMLDivElement>()

  const { styles, attributes } = usePopper(referenceElement, popperElement, {})

  useOnClickOutside(node, open ? toggle : undefined)

  const handleAcceptListUpdate = useCallback(() => {
    if (!pending) return
    ReactGA.event({
      category: 'Lists',
      action: 'Update List from List Select',
      label: listUrl,
    })
    dispatch(acceptListUpdate(listUrl))
  }, [dispatch, listUrl, pending])

  const handleRemoveList = useCallback(() => {
    ReactGA.event({
      category: 'Lists',
      action: 'Start Remove List',
      label: listUrl,
    })
    if (window.prompt(`Please confirm you would like to remove this list by typing REMOVE`) === `REMOVE`) {
      ReactGA.event({
        category: 'Lists',
        action: 'Confirm Remove List',
        label: listUrl,
      })
      dispatch(removeList(listUrl))
    }
  }, [dispatch, listUrl])

  const handleEnableList = useCallback(() => {
    ReactGA.event({
      category: 'Lists',
      action: 'Enable List',
      label: listUrl,
    })
    dispatch(enableList(listUrl))
  }, [dispatch, listUrl])

  const handleDisableList = useCallback(() => {
    ReactGA.event({
      category: 'Lists',
      action: 'Disable List',
      label: listUrl,
    })
    dispatch(disableList(listUrl))
  }, [dispatch, listUrl])

  if (!list) return null

  return (
    <div
      id={listUrlRowHTMLId(listUrl)}
      style={isActive ? { backgroundColor: listColor } : {}}
      className={classNames(isActive ? 'text-high-emphesis' : 'text-primary bg-dark-700', 'rounded flex flex-row p-4')}
      key={listUrl}
    >
      {list.logoURI ? (
        <ListLogo size="40px" logoURI={list.logoURI} alt={`${list.name} list logo`} />
      ) : (
        <div style={{ width: '24px', height: '24px' }} />
      )}
      <div className="justify-center flex-auto ml-4">
        <div>
          <div className={classNames(isActive && 'text-white', 'overflow-hidden overflow-ellipsis font-semibold')}>
            {list.name}
          </div>
        </div>
        <div className="relative flex flex-row">
          <div className={classNames(isActive && 'text-white', 'text-xs')}>{list.tokens.length} tokens</div>
          <div className="flex items-center justify-center" ref={node as any}>
            <Button variant="empty" onClick={toggle} ref={setReferenceElement} style={{ padding: '0' }}>
              <Settings size={12} className="ml-1 stroke-current" />
            </Button>
            {open && (
              <div
                className="z-20 flex flex-col p-4 space-y-2 border border-white rounded backdrop-blur whitespace-nowrap"
                ref={setPopperElement as any}
                style={styles.popper}
                {...attributes.popper}
              >
                <div>{list && listVersionLabel(list.version)}</div>
                <div />
                <ExternalLink href={`https://tokenlists.org/token-list?url=${listUrl}`}>View list</ExternalLink>
                <button
                  className="hover:text-high-emphesis text-primary"
                  onClick={handleRemoveList}
                  disabled={Object.keys(listsByUrl).length === 1}
                >
                  Remove list
                </button>
                {pending && (
                  <button className="hover:text-high-emphesis text-primary" onClick={handleAcceptListUpdate}>
                    Update list
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <ListToggle
        isActive={isActive}
        bgColor={listColor}
        toggle={() => {
          isActive ? handleDisableList() : handleEnableList()
        }}
      />
    </div>
  )
})

function ManageLists({
  height,
  setModalView,
  setImportList,
  setListUrl,
}: {
  height: number
  setModalView: (view: CurrencyModalView) => void
  setImportList: (list: TokenList) => void
  setListUrl: (url: string) => void
}) {
  const [listUrlInput, setListUrlInput] = useState<string>('')

  const lists = useAllLists()

  // sort by active but only if not visible
  const activeListUrls = useActiveListUrls()
  const [activeCopy, setActiveCopy] = useState<string[] | undefined>()
  useEffect(() => {
    if (!activeCopy && activeListUrls) {
      setActiveCopy(activeListUrls)
    }
  }, [activeCopy, activeListUrls])

  const handleInput = useCallback((e) => {
    setListUrlInput(e.target.value)
  }, [])

  const fetchList = useFetchListCallback()

  const validUrl: boolean = useMemo(() => {
    return uriToHttp(listUrlInput).length > 0 || Boolean(parseENSAddress(listUrlInput))
  }, [listUrlInput])

  const sortedLists = useMemo(() => {
    const listUrls = Object.keys(lists)
    return listUrls
      .filter((listUrl) => {
        // only show loaded lists, hide unsupported lists
        return Boolean(lists[listUrl].current) && !UNSUPPORTED_LIST_URLS.includes(listUrl)
      })
      .sort((u1, u2) => {
        const { current: l1 } = lists[u1]
        const { current: l2 } = lists[u2]

        // first filter on active lists
        if (activeCopy?.includes(u1) && !activeCopy?.includes(u2)) {
          return -1
        }
        if (!activeCopy?.includes(u1) && activeCopy?.includes(u2)) {
          return 1
        }

        if (l1 && l2) {
          return l1.name.toLowerCase() < l2.name.toLowerCase()
            ? -1
            : l1.name.toLowerCase() === l2.name.toLowerCase()
            ? 0
            : 1
        }
        if (l1) return -1
        if (l2) return 1
        return 0
      })
  }, [lists, activeCopy])

  // temporary fetched list for import flow
  const [tempList, setTempList] = useState<TokenList>()
  const [addError, setAddError] = useState<string | undefined>()

  useEffect(() => {
    async function fetchTempList() {
      fetchList(listUrlInput, false)
        .then((list) => setTempList(list))
        .catch(() => setAddError('Error importing list'))
    }
    // if valid url, fetch details for card
    if (validUrl) {
      fetchTempList()
    } else {
      setTempList(undefined)
      listUrlInput !== '' && setAddError('Enter valid list location')
    }

    // reset error
    if (listUrlInput === '') {
      setAddError(undefined)
    }
  }, [fetchList, listUrlInput, validUrl])

  // check if list is already imported
  const isImported = Object.keys(lists).includes(listUrlInput)

  // set list values and have parent modal switch to import list view
  const handleImport = useCallback(() => {
    if (!tempList) return
    setImportList(tempList)
    setModalView(CurrencyModalView.importList)
    setListUrl(listUrlInput)
  }, [listUrlInput, setImportList, setListUrl, setModalView, tempList])

  return (
    <div style={{ height: `${height}px` }} className="flex flex-col space-y-4">
      <input
        id="list-add-input"
        type="text"
        placeholder="https:// or ipfs:// or ENS name"
        className="mt-4 w-full bg-dark-900 border border-dark-800 focus:border-transparent focus:border-gradient-r-blue-pink-dark-900 rounded placeholder-secondary focus:placeholder-primary font-bold text-base px-6 py-3.5 appearance-none"
        value={listUrlInput}
        onChange={handleInput}
        title="List URI"
        autoComplete="off"
        autoCorrect="off"
      />
      {addError ? (
        <div title={addError} className="overflow-hidden text-red text-ellipsis">
          {addError}
        </div>
      ) : null}
      {tempList && (
        <PaddedColumn style={{ paddingTop: 0 }}>
          <RowBetween>
            <RowFixed>
              {tempList.logoURI && <ListLogo logoURI={tempList.logoURI} size="40px" />}
              <AutoColumn gap="4px" style={{ marginLeft: '20px' }}>
                <div className="font-semibold">{tempList.name}</div>
                <div className="text-xs">{tempList.tokens.length} tokens</div>
              </AutoColumn>
            </RowFixed>
            {isImported ? (
              <RowFixed>
                <CheckCircle className="w-4 h-4 mr-2.5" />
                <div>Loaded</div>
              </RowFixed>
            ) : (
              <Button
                color="gradient"
                style={{
                  width: 'fit-content',
                  padding: '6px 8px',
                  fontSize: '14px',
                }}
                onClick={handleImport}
              >
                Import
              </Button>
            )}
          </RowBetween>
        </PaddedColumn>
      )}
      <div className="flex flex-col h-full p-2 space-y-4 overflow-y-auto">
        {sortedLists.map((listUrl) => (
          <ListRow key={listUrl} listUrl={listUrl} />
        ))}
      </div>
    </div>
  )
}

export default ManageLists
