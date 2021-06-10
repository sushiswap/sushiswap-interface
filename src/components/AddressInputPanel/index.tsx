import React, { FC, useCallback, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'

import { AutoColumn } from '../Column'
import ExternalLink from '../ExternalLink'
import { RowBetween } from '../Row'
import { getExplorerLink } from '../../functions/explorer'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import useENS from '../../hooks/useENS'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

const InputPanel = styled.div`
    // ${({ theme }) => theme.flexColumnNoWrap}
    position: relative;
    border-radius: 1.25rem;
    // background-color: ${({ theme }) => theme.bg1};
    z-index: 1;
    width: 100%;
`

const ContainerRow = styled.div<{ error: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 1.25rem;
    // border: 1px solid ${({ error, theme }) =>
        error ? theme.red1 : theme.bg2};
    transition: border-color 300ms
            ${({ error }) => (error ? 'step-end' : 'step-start')},
        color 500ms ${({ error }) => (error ? 'step-end' : 'step-start')};
    // background-color: ${({ theme }) => theme.bg1};
`

const InputContainer = styled.div`
    flex: 1;
    padding: 1rem;
`

const Input = styled.input<{ error?: boolean }>`
    font-size: 1.25rem;
    outline: none;
    border: none;
    flex: 1 1 auto;
    width: 0;
    // background-color: ${({ theme }) => theme.bg1};
    transition: color 300ms
        ${({ error }) => (error ? 'step-end' : 'step-start')};
    // color: ${({ error, theme }) => (error ? theme.red1 : theme.primary1)};
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
    width: 100%;
    ::placeholder {
        // color: ${({ theme }) => theme.text4};
    }
    padding: 0px;
    -webkit-appearance: textfield;

    ::-webkit-search-decoration {
        -webkit-appearance: none;
    }

    ::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    ::placeholder {
        // color: ${({ theme }) => theme.text4};
    }
`

interface AddressInputPanelProps {
    id?: string
    value: string
    onChange: (value: string) => void
}

const AddressInputPanel: FC<AddressInputPanelProps> = ({
    id,
    value,
    onChange,
}) => {
    const { i18n } = useLingui()
    const { chainId } = useActiveWeb3React()
    const { address, loading, name } = useENS(value)

    const handleInput = useCallback(
        (event) => {
            const input = event.target.value
            const withoutSpaces = input.replace(/\s+/g, '')
            onChange(withoutSpaces)
        },
        [onChange]
    )

    const error = Boolean(value.length > 0 && !loading && !address)

    return (
        <div className="flex flex-row bg-dark-800 rounded" id={id}>
            {/*<ContainerRow error={error}>*/}
            {/*    <InputContainer>*/}
            {/*        <AutoColumn gap="md">*/}
            {/*            /!*<RowBetween>*!/*/}
            {/*            /!*    <div className="text-sm font-medium">Recipient</div>*!/*/}
            {/*            /!*    {address && chainId && (*!/*/}
            {/*            /!*        <ExternalLink*!/*/}
            {/*            /!*            href={getExplorerLink(*!/*/}
            {/*            /!*                chainId,*!/*/}
            {/*            /!*                name ?? address,*!/*/}
            {/*            /!*                'address'*!/*/}
            {/*            /!*            )}*!/*/}
            {/*            /!*            style={{ fontSize: '14px' }}*!/*/}
            {/*            /!*        >*!/*/}
            {/*            /!*            (View on explorer)*!/*/}
            {/*            /!*        </ExternalLink>*!/*/}
            {/*            /!*    )}*!/*/}
            {/*            /!*</RowBetween>*!/*/}
            {/*        </AutoColumn>*/}
            {/*    </InputContainer>*/}
            {/*</ContainerRow>*/}
            <div className="flex justify-between w-full sm:w-2/5 p-5 items-center">
                <span className="text-[18px] text-primary">
                    {i18n._(t`Send to:`)}
                </span>
                <span
                    className="text-blue text-sm underline cursor-pointer"
                    onClick={() => onChange(null)}
                >
                    {i18n._(t`Remove`)}
                </span>
            </div>
            <div className="flex w-full sm:w-3/5 border-2 border-dark-800 rounded-r">
                <input
                    className="p-3 w-full h-full flex overflow-ellipsis font-bold recipient-address-input bg-dark-900 h-full w-full rounded placeholder-low-emphesis"
                    type="text"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    placeholder="Wallet Address or ENS name"
                    pattern="^(0x[a-fA-F0-9]{40})$"
                    onChange={handleInput}
                    value={value}
                />
            </div>
        </div>
    )
}

export default AddressInputPanel
