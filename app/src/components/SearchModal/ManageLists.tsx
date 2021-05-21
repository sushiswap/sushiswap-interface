import { AppDispatch, AppState } from '../../state'
import { ButtonEmpty, ButtonPrimary } from '../ButtonLegacy'
import { CheckCircle, Settings } from 'react-feather'
import Column, { AutoColumn } from '../Column'
import { PaddedColumn, SearchInput, Separator, SeparatorDark } from './styleds'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Row, { RowBetween, RowFixed } from '../Row'
import { acceptListUpdate, disableList, enableList, removeList } from '../../state/lists/actions'
import { useActiveListUrls, useAllLists, useIsListActive } from '../../state/lists/hooks'
import { useDispatch, useSelector } from 'react-redux'

import AutoSizer from 'react-virtualized-auto-sizer'
import Card from '../Card'
import CurrencyModalView from './CurrencyModalView'
import ExternalLink from '../ExternalLink'
import IconWrapper from '../IconWrapper'
import LinkStyledButton from '../LinkStyledButton'
import ListLogo from '../ListLogo'
import ListToggle from '../Toggle/ListToggle'
import ReactGA from 'react-ga'
import { TokenList } from '@uniswap/token-lists'
import { UNSUPPORTED_LIST_URLS } from '../../constants/token-lists'
import { listVersionLabel } from '../../functions/list'
import { parseENSAddress } from '../../functions/ens'
import styled from 'styled-components'
import { uriToHttp } from '../../functions/convert'
import { useFetchListCallback } from '../../hooks/useFetchListCallback'
import { useListColor } from '../../hooks/useColor'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { usePopper } from 'react-popper'
import useTheme from '../../hooks/useTheme'
import useToggle from '../../hooks/useToggle'

const Wrapper = styled(Column)`
    width: 100%;
    height: 100%;
`

const UnpaddedLinkStyledButton = styled(LinkStyledButton)`
    padding: 0;
    font-size: 1rem;
    opacity: ${({ disabled }) => (disabled ? '0.4' : '1')};
`

const PopoverContainer = styled.div<{ show: boolean }>`
    z-index: 100;
    visibility: ${props => (props.show ? 'visible' : 'hidden')};
    opacity: ${props => (props.show ? 1 : 0)};
    transition: visibility 150ms linear, opacity 150ms linear;
    background: ${({ theme }) => theme.bg2};
    border: 1px solid ${({ theme }) => theme.bg3};
    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
        0px 24px 32px rgba(0, 0, 0, 0.01);
    // color: ${({ theme }) => theme.text2};
    // border-radius: ${({ theme }) => theme.borderRadius};
    padding: 1rem;
    display: grid;
    grid-template-rows: 1fr;
    grid-gap: 8px;
    font-size: 1rem;
    text-align: left;
`

const StyledMenu = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    border: none;
`

const StyledTitleText = styled.div<{ active: boolean }>`
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
    color: ${({ theme, active }) => (active ? theme.white : theme.text2)};
`

const StyledListUrlText = styled.div<{ active: boolean }>`
    font-size: 12px;
    color: ${({ theme, active }) => (active ? theme.white : theme.text2)};
`

const RowWrapper = styled(Row)<{ bgColor: string; active: boolean }>`
    background-color: ${({ bgColor, active, theme }) => (active ? bgColor ?? 'transparent' : theme.bg2)};
    transition: 200ms;
    align-items: center;
    padding: 1rem;
    border-radius: 10px;
`

function listUrlRowHTMLId(listUrl: string) {
    return `list-row-${listUrl.replace(/\./g, '-')}`
}

const ListRow = memo(function ListRow({ listUrl }: { listUrl: string }) {
    const listsByUrl = useSelector<AppState, AppState['lists']['byUrl']>(state => state.lists.byUrl)
    const dispatch = useDispatch<AppDispatch>()
    const { current: list, pendingUpdate: pending } = listsByUrl[listUrl]

    const theme = useTheme()
    const listColor = useListColor(list?.logoURI)
    const isActive = useIsListActive(listUrl)

    const [open, toggle] = useToggle(false)
    const node = useRef<HTMLDivElement>()
    const [referenceElement, setReferenceElement] = useState<HTMLDivElement>()
    const [popperElement, setPopperElement] = useState<HTMLDivElement>()

    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        placement: 'auto',
        strategy: 'fixed',
        modifiers: [{ name: 'offset', options: { offset: [8, 8] } }]
    })

    useOnClickOutside(node, open ? toggle : undefined)

    const handleAcceptListUpdate = useCallback(() => {
        if (!pending) return
        ReactGA.event({
            category: 'Lists',
            action: 'Update List from List Select',
            label: listUrl
        })
        dispatch(acceptListUpdate(listUrl))
    }, [dispatch, listUrl, pending])

    const handleRemoveList = useCallback(() => {
        ReactGA.event({
            category: 'Lists',
            action: 'Start Remove List',
            label: listUrl
        })
        if (window.prompt(`Please confirm you would like to remove this list by typing REMOVE`) === `REMOVE`) {
            ReactGA.event({
                category: 'Lists',
                action: 'Confirm Remove List',
                label: listUrl
            })
            dispatch(removeList(listUrl))
        }
    }, [dispatch, listUrl])

    const handleEnableList = useCallback(() => {
        ReactGA.event({
            category: 'Lists',
            action: 'Enable List',
            label: listUrl
        })
        dispatch(enableList(listUrl))
    }, [dispatch, listUrl])

    const handleDisableList = useCallback(() => {
        ReactGA.event({
            category: 'Lists',
            action: 'Disable List',
            label: listUrl
        })
        dispatch(disableList(listUrl))
    }, [dispatch, listUrl])

    if (!list) return null

    return (
        <RowWrapper
            id={listUrlRowHTMLId(listUrl)}
            active={isActive}
            bgColor={listColor}
            key={listUrl}
            className={`${isActive ? 'text-high-emphesis' : 'text-primary bg-dark-700'}`}
        >
            {list.logoURI ? (
                <ListLogo
                    size="40px"
                    style={{ marginRight: '1rem' }}
                    logoURI={list.logoURI}
                    alt={`${list.name} list logo`}
                />
            ) : (
                <div style={{ width: '24px', height: '24px', marginRight: '1rem' }} />
            )}
            <Column style={{ flex: '1' }}>
                <Row>
                    <StyledTitleText active={isActive}>{list.name}</StyledTitleText>
                </Row>
                <RowFixed mt="4px">
                    <StyledListUrlText active={isActive} mr="6px">
                        {list.tokens.length} tokens
                    </StyledListUrlText>
                    <StyledMenu ref={node as any}>
                        <ButtonEmpty onClick={toggle} ref={setReferenceElement} padding="0">
                            <Settings size={12} className="ml-1 stroke-current" />
                        </ButtonEmpty>
                        {open && (
                            <PopoverContainer
                                show={true}
                                ref={setPopperElement as any}
                                style={styles.popper}
                                {...attributes.popper}
                            >
                                <div>{list && listVersionLabel(list.version)}</div>
                                <SeparatorDark />
                                <ExternalLink href={`https://tokenlists.org/token-list?url=${listUrl}`}>
                                    View list
                                </ExternalLink>
                                <UnpaddedLinkStyledButton
                                    onClick={handleRemoveList}
                                    disabled={Object.keys(listsByUrl).length === 1}
                                >
                                    Remove list
                                </UnpaddedLinkStyledButton>
                                {pending && (
                                    <UnpaddedLinkStyledButton onClick={handleAcceptListUpdate}>
                                        Update list
                                    </UnpaddedLinkStyledButton>
                                )}
                            </PopoverContainer>
                        )}
                    </StyledMenu>
                </RowFixed>
            </Column>
            <ListToggle
                isActive={isActive}
                bgColor={listColor}
                toggle={() => {
                    isActive ? handleDisableList() : handleEnableList()
                }}
            />
        </RowWrapper>
    )
})

const ListContainer = styled.div`
    // padding: 1rem;
    height: 100%;
    overflow-y: auto;

    padding-bottom: 80px;
`

function ManageLists({
    setModalView,
    setImportList,
    setListUrl
}: {
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

    const handleInput = useCallback(e => {
        setListUrlInput(e.target.value)
    }, [])

    const fetchList = useFetchListCallback()

    const validUrl: boolean = useMemo(() => {
        return uriToHttp(listUrlInput).length > 0 || Boolean(parseENSAddress(listUrlInput))
    }, [listUrlInput])

    const sortedLists = useMemo(() => {
        const listUrls = Object.keys(lists)
        return listUrls
            .filter(listUrl => {
                // only show loaded lists, hide unsupported lists
                return Boolean(lists[listUrl].current) && !Boolean(UNSUPPORTED_LIST_URLS.includes(listUrl))
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
                .then(list => setTempList(list))
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
        <div className="relative flex-1 w-full h-full space-y-4 overflow-y-hidden">
            <input
                id="list-add-input"
                type="text"
                placeholder="https:// or ipfs:// or ENS name"
                className="mt-4 w-full bg-dark-900 border border-dark-800 focus:border-transparent focus:border-gradient-r-blue-pink-dark-900 rounded placeholder-secondary focus:placeholder-primary font-bold text-caption px-6 py-3.5 appearance-none"
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
                    <Card>
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
                                    <IconWrapper size="16px" marginRight={'10px'}>
                                        <CheckCircle />
                                    </IconWrapper>
                                    <div>Loaded</div>
                                </RowFixed>
                            ) : (
                                <ButtonPrimary
                                    style={{ fontSize: '14px' }}
                                    padding="6px 8px"
                                    width="fit-content"
                                    onClick={handleImport}
                                >
                                    Import
                                </ButtonPrimary>
                            )}
                        </RowBetween>
                    </Card>
                </PaddedColumn>
            )}
            <ListContainer>
                <div className="h-full">
                    <AutoSizer disableWidth>
                        {({ height }) => (
                            <div style={{ height }} className="space-y-4">
                                {sortedLists.map(listUrl => (
                                    <ListRow key={listUrl} listUrl={listUrl} />
                                ))}
                            </div>
                        )}
                    </AutoSizer>
                </div>
            </ListContainer>
        </div>
    )
}

export default ManageLists
