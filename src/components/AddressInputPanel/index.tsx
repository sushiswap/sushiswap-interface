import React, { useCallback, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'

import { AutoColumn } from '../Column'
import ExternalLink from '../ExternalLink'
import { RowBetween } from '../Row'
import { getExplorerLink } from '../../functions/explorer'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import useENS from '../../hooks/useENS'
import { classNames } from '../../functions'

const Input = styled.input<{ error?: boolean }>`
  font-size: 1.25rem;
  outline: none;
  border: none;
  flex: 1 1 auto;
  width: 0;
  // background-color: ${({ theme }) => theme.bg1};
  transition: color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')};
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

const ContainerRow = styled.div<{ error: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1.25rem;
  // border: 1px solid ${({ error, theme }) => (error ? theme.red1 : theme.bg2)};
  transition: border-color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')},
    color 500ms ${({ error }) => (error ? 'step-end' : 'step-start')};
  // background-color: ${({ theme }) => theme.bg1};
`

export default function AddressInputPanel({
  id,
  value,
  onChange,
}: {
  id?: string
  // the typed string value
  value: string
  // triggers whenever the typed value changes
  onChange: (value: string) => void
}) {
  const { chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

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
    <div className="relative z-10 flex w-full transition-colors rounded flex-nowrap bg-800" id={id}>
      <div
        className={classNames(
          'flex justify-center items-center rounded border bg-700 w-full',
          error ? 'border-red' : 'border-transparent'
        )}
      >
        <AutoColumn gap="md" className="w-full p-5 rounded bg-dark-800">
          <RowBetween>
            <div className="text-xs font-medium text-secondary whitespace-nowrap">Recipient:</div>
            {address && chainId && (
              <ExternalLink href={getExplorerLink(chainId, name ?? address, 'address')} style={{ fontSize: '14px' }}>
                (View on explorer)
              </ExternalLink>
            )}
          </RowBetween>
          <input
            className={classNames(
              'flex-auto rounded p-3 w-full transition-colors border-none outline-none recipient-address-input bg-dark-900 focus:bg-dark-700 font-medium overflow-hidden overflow-ellipsis disabled:cursor-not-allowed disabled:bg-dark-1000 disabled:ring disabled:ring-dark-800 focus:ring-blue placeholder-low-emphesis focus:placeholder-primary',
              error ? 'text-red' : 'text-primary'
            )}
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
        </AutoColumn>
      </div>
    </div>
  )
}
