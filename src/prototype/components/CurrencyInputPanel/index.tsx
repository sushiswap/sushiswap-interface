import { Currency, Pair } from '@sushiswap/sdk'
import React, { FC, useCallback, useState } from 'react'
import styled from 'styled-components'
import { lighten, transparentize } from 'polished'
import { useCurrencyBalance } from '../../../state/wallet/hooks'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import CurrencyLogo from 'components/CurrencyLogo'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { AutoRow, RowFixed } from 'components/Row'
import { TYPE } from '../../../theme'
import { Input as NumericalInput } from 'components/NumericalInput'
import { ReactComponent as DropDown } from '../../../assets/images/dropdown.svg'

import { useActiveWeb3React } from '../../../hooks'
import { useTranslation } from 'react-i18next'
import useTheme from '../../../hooks/useTheme'
import { Lock } from 'react-feather'
import { AutoColumn } from 'components/Column'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 0;
`

const CurrencySelect = styled.button<{ selected: boolean; isInputPanel?: boolean }>`
  align-items: center;
  height: 1.8rem;
  font-size: 16px;
  font-weight: 600;
  background-color: ${({ theme }) => theme.bg1};
  color: ${({ isInputPanel, theme }) => (isInputPanel ? theme.secondary1 : theme.secondary2)};
  border-radius: 25px;
  box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;

  :focus,
  :hover {
    background-color: ${({ theme }) => lighten(0.05, theme.bg1)};
  }
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledDropDown = styled(DropDown)<{ isInputPanel?: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;

  path {
    stroke: ${({ isInputPanel, theme }) => (isInputPanel ? theme.secondary1 : theme.secondary2)};
    stroke-width: 1.5px;
  }
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg2};
  z-index: 1;
`

const Container = styled.div<{
  hideInput: boolean
  cornerRadiusTopNone?: boolean
  cornerRadiusBottomNone?: boolean
  containerBackground?: string
}>`
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '12px')};
  border-radius: ${({ cornerRadiusTopNone }) => cornerRadiusTopNone && '0 0 12px 12px'};
  border-radius: ${({ cornerRadiusBottomNone }) => cornerRadiusBottomNone && '12px 12px 0 0'};
  background-color: ${({ theme }) => theme.bg2};
  background-color: ${({ containerBackground }) => containerBackground};
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  white-space: nowrap;
  margin: 0 0.25rem 0 0.4rem;
  font-size: 16px;
`

const StyledBalanceMax = styled.button`
  height: 1.8rem;
  padding-right: 8px;
  padding-left: 8px;
  background-color: ${({ theme }) => theme.bg1};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.text1};
  border: none;

  :hover {
    background-color: ${({ theme }) => lighten(0.05, theme.bg1)};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

const IconWrapper = styled.div`
  background: ${({ theme }) => theme.bg1};
  width: 56px;
  height: 56px;
  justify-content: center;
  border-radius: 100%;
  display: flex;
  align-items: center;
`

const StyledLockIconWrapper = styled.div`
  background: ${({ theme }) => transparentize(0.9, theme.secondary2)};
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-left: 12px;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  :hover {
    background-color: ${({ theme }) => transparentize(0.7, theme.secondary2)};
  }
`

const StyledLockIcon = styled(Lock)`
  height: 20px;
  width: 20px;

  > * {
    stroke: ${({ theme }) => theme.secondary2};
  }
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  customBalanceText?: string
  cornerRadiusBottomNone?: boolean
  cornerRadiusTopNone?: boolean
  isInputPanel?: boolean
}

const CurrencyInputPanel: FC<CurrencyInputPanelProps> = ({
  children,
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = 'Input',
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  customBalanceText,
  cornerRadiusBottomNone = false,
  cornerRadiusTopNone = false,
  isInputPanel
}) => {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const { account, chainId } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const theme = useTheme()

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <InputPanel id={id}>
      <Container
        hideInput={hideInput}
        cornerRadiusBottomNone={cornerRadiusBottomNone}
        cornerRadiusTopNone={cornerRadiusTopNone}
      >
        <AutoColumn style={{ padding: '14px 8px' }} gap="4px">
          <AutoRow gap="4px" justify="space-between">
            <AutoRow style={{ display: 'inline-flex', width: 'unset' }} gap="4px">
              <RowFixed>
                <IconWrapper>
                  {pair ? (
                    <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={42} margin={true} />
                  ) : currency ? (
                    <CurrencyLogo currency={currency} size="42px" />
                  ) : null}
                </IconWrapper>
              </RowFixed>
              <AutoColumn>
                <AutoRow gap="4px" style={{ flexWrap: 'nowrap' }}>
                  <CurrencySelect
                    isInputPanel={isInputPanel}
                    selected={!!currency}
                    className="open-currency-select-button"
                    onClick={() => {
                      if (!disableCurrencySelect) {
                        setModalOpen(true)
                      }
                    }}
                  >
                    <Aligner>
                      {pair ? (
                        <StyledTokenName className="pair-name-container">
                          {pair?.token0.symbol}:{pair?.token1.symbol}
                        </StyledTokenName>
                      ) : (
                        <StyledTokenName
                          className="token-symbol-container"
                          active={Boolean(currency && currency.symbol)}
                        >
                          {(currency && currency.symbol && currency.symbol.length > 20
                            ? currency.symbol.slice(0, 4) +
                              '...' +
                              currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                            : currency?.getSymbol(chainId)) || t('selectToken')}
                        </StyledTokenName>
                      )}
                      {!disableCurrencySelect && <StyledDropDown isInputPanel={isInputPanel} />}
                    </Aligner>
                  </CurrencySelect>
                  {account && currency && showMaxButton && label !== 'To' && (
                    <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>
                  )}
                </AutoRow>
                {account && (
                  <AutoRow>
                    <TYPE.body
                      onClick={onMax}
                      color={theme.text3}
                      fontSize=".875rem"
                      fontWeight={500}
                      style={{ display: 'inline', cursor: 'pointer', marginTop: 8, marginLeft: 2 }}
                    >
                      {!hideBalance && !!currency && selectedCurrencyBalance ? (
                        <>
                          {customBalanceText ?? 'Balance '}
                          <TYPE.body fontSize=".875rem" fontWeight={600} display="inline" color={theme.text3}>
                            {selectedCurrencyBalance?.toSignificant(6)}
                          </TYPE.body>
                        </>
                      ) : (
                        ' -'
                      )}
                    </TYPE.body>
                  </AutoRow>
                )}
              </AutoColumn>
            </AutoRow>
            <InputRow
              style={hideInput ? { padding: '0', borderRadius: '8px', flex: 1 } : { flex: 1 }}
              selected={disableCurrencySelect}
            >
              {!hideInput && (
                <AutoColumn style={{ flex: '1' }}>
                  <AutoRow justify="flex-end">
                    <TYPE.body color={theme.text3} fontWeight="bold" fontSize=".875rem" display="inline">
                      {!isInputPanel && '~'} $3,243.52{' '}
                      {!isInputPanel && (
                        <TYPE.body color={theme.secondary2} fontWeight="bold" fontSize=".875rem" display="inline">
                          (-5.4%)
                        </TYPE.body>
                      )}
                    </TYPE.body>
                  </AutoRow>
                  <AutoRow style={{ marginTop: 6 }}>
                    <NumericalInput
                      align="right"
                      className="token-amount-input"
                      value={value}
                      onUserInput={val => {
                        onUserInput(val)
                      }}
                      style={{ top: 4 }}
                    />
                  </AutoRow>
                </AutoColumn>
              )}
              {isInputPanel && (
                <StyledLockIconWrapper>
                  <StyledLockIcon size="24" />
                </StyledLockIconWrapper>
              )}
            </InputRow>
          </AutoRow>
        </AutoColumn>
      </Container>
      {children}
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </InputPanel>
  )
}

export default CurrencyInputPanel
