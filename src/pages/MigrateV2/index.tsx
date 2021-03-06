import React, { useContext } from 'react'
import { BodyWrapper } from '../AppBody'
import { AutoColumn } from '../../components/Column'
import { BackArrow, CloseIcon, TYPE } from '../../theme'
import QuestionHelper from '../../components/QuestionHelper'
import { AutoRow, RowFixed } from '../../components/Row'
import { ThemeContext } from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { LightCard } from '../../components/Card'
import { Dots } from '../../components/swap/styleds'
import { EmptyState } from '../MigrateV1/EmptyState'
import { JSBI, Token } from '@sushiswap/sdk'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { ButtonConfirmed } from '../../components/Button'
import useMigrateState, { MigrateState } from '../../sushi-hooks/useMigrateState'
import { FixedHeightRow } from '../../components/PositionCard'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { Text } from 'rebass'

const ZERO = JSBI.BigInt(0)

interface PositionCardProps {
  tokenA: Token
  tokenB: Token
  address: string
  onClick: () => void
  onDismiss: () => void
}

const LPTokenSelect = ({ tokenA, tokenB, onClick, onDismiss }: PositionCardProps) => {
  const theme = useContext(ThemeContext)

  return (
    <LightCard>
      <AutoColumn gap="12px">
        <FixedHeightRow>
          <RowFixed onClick={onClick}>
            <DoubleCurrencyLogo currency0={tokenA} currency1={tokenB} margin={true} size={20} />
            <Text fontWeight={500} fontSize={20} style={{ marginLeft: '' }}>
              {`${tokenA.symbol}/${tokenB.symbol}`}
            </Text>
            <Text
              fontSize={12}
              fontWeight={500}
              ml="0.5rem"
              px="0.75rem"
              py="0.25rem"
              style={{ borderRadius: '1rem' }}
              backgroundColor={theme.yellow1}
              color={'black'}
            >
              V2
            </Text>
          </RowFixed>
          <CloseIcon onClick={onDismiss} />
        </FixedHeightRow>
      </AutoColumn>
    </LightCard>
  )
}

const MigrateModeSelect = ({ state }: { state: MigrateState }) => {
  const unsetMode = () => state.setMode(undefined)

  const items = [
    {
      key: 'permit',
      text: 'Non-hardware Wallet'
    },
    { key: 'approve', text: 'Hardware Wallet' }
  ]

  return (
    <>
      {items.reduce((acc: any, { key, text }: any) => {
        if (state.mode === undefined || key === state.mode)
          acc.push(
            <LightCard key={key}>
              <AutoColumn gap="12px">
                <FixedHeightRow>
                  <RowFixed onClick={() => state.setMode(key)}>
                    <Text fontWeight={500} fontSize={20} style={{ marginLeft: '' }}>
                      {text}
                    </Text>
                  </RowFixed>
                  <CloseIcon onClick={unsetMode} />
                </FixedHeightRow>
              </AutoColumn>
            </LightCard>
          )
        return acc
      }, [])}
    </>
  )
}

const MigrateButtons = ({ state }: { state: MigrateState }) => {
  const [approval, approve] = useApproveCallback(
    state.selectedLPToken?.balance,
    '0x16E58463eb9792Bc236d8860F5BC69A81E26E32B'
  )

  const noLiquidityTokens = !!state.selectedLPToken?.balance && state.selectedLPToken?.balance.equalTo(ZERO)
  const isSuccessfullyMigrated = !!state.pendingMigrationHash && noLiquidityTokens

  if (!state.mode || state.lpTokens.length === 0 || !state.selectedLPToken) {
    return <span />
  }

  return (
    <AutoColumn gap="20px">
      <div style={{ display: 'flex' }}>
        {state.mode === 'approve' && (
          <AutoColumn gap="12px" style={{ flex: '1', marginRight: 12 }}>
            <ButtonConfirmed
              confirmed={approval === ApprovalState.APPROVED}
              disabled={approval !== ApprovalState.NOT_APPROVED}
              onClick={approve}
            >
              {approval === ApprovalState.PENDING ? (
                <Dots>Approving</Dots>
              ) : approval === ApprovalState.APPROVED ? (
                'Approved'
              ) : (
                'Approve'
              )}
            </ButtonConfirmed>
          </AutoColumn>
        )}
        <AutoColumn gap="12px" style={{ flex: '1' }}>
          <ButtonConfirmed
            confirmed={isSuccessfullyMigrated}
            disabled={
              isSuccessfullyMigrated ||
              noLiquidityTokens ||
              state.isMigrationPending ||
              (state.mode === 'approve' && approval !== ApprovalState.APPROVED) ||
              state.migrating
            }
            onClick={state.onMigrate}
          >
            {isSuccessfullyMigrated ? 'Success' : state.isMigrationPending ? <Dots>Migrating</Dots> : 'Migrate'}
          </ButtonConfirmed>
        </AutoColumn>
      </div>
      <TYPE.small style={{ textAlign: 'center' }}>
        {`Your Uniswap ${state.selectedLPToken.tokenA.symbol}/${state.selectedLPToken.tokenB.symbol} liquidity will become Sushiswap ${state.selectedLPToken.tokenA.symbol}/${state.selectedLPToken.tokenB.symbol} liquidity.`}
      </TYPE.small>
    </AutoColumn>
  )
}

const UniswapLiquidityPairs = ({ state }: { state: MigrateState }) => {
  if (!state.mode) {
    return <span />
  }

  if (state.lpTokens.length === 0) {
    return <EmptyState message="No V2 Liquidity found." />
  }

  return (
    <>
      {state.lpTokens.reduce<JSX.Element[]>((acc, lpToken) => {
        if (lpToken.balance && JSBI.greaterThan(lpToken.balance.raw, JSBI.BigInt(0))) {
          acc.push(
            <LPTokenSelect
              key={lpToken.address}
              tokenA={lpToken.tokenA}
              tokenB={lpToken.tokenB}
              address={lpToken.address}
              onClick={() => state.setSelectedLPToken(lpToken)}
              onDismiss={() => state.setSelectedLPToken(undefined)}
            />
          )
        }
        return acc
      }, [])}
    </>
  )
}

const MigrateV2 = () => {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  const state = useMigrateState()

  return (
    <BodyWrapper style={{ padding: 24 }}>
      <AutoColumn gap="16px">
        <AutoRow style={{ alignItems: 'center', justifyContent: 'space-between' }} gap="8px">
          <BackArrow to="/pool" />
          <TYPE.mediumHeader>Migrate V2 Liquidity</TYPE.mediumHeader>
          <div>
            <QuestionHelper text="Migrate your Uniswap LP tokens to SushiSwap LP tokens." />
          </div>
        </AutoRow>
        <TYPE.body style={{ marginBottom: 8, fontWeight: 400 }}>
          For each pool shown below, click migrate to remove your liquidity from Uniswap V2 and deposit it into
          Sushiswap V2.
        </TYPE.body>

        {!account ? (
          <LightCard padding="40px">
            <TYPE.body color={theme.text3} textAlign="center">
              Connect to a wallet to view your V2 liquidity.
            </TYPE.body>
          </LightCard>
        ) : state.loading ? (
          <LightCard padding="40px">
            <TYPE.body color={theme.text3} textAlign="center">
              <Dots>Loading</Dots>
            </TYPE.body>
          </LightCard>
        ) : (
          <>
            <MigrateModeSelect state={state} />
            <UniswapLiquidityPairs state={state} />
            <MigrateButtons state={state} />
          </>
        )}
      </AutoColumn>
    </BodyWrapper>
  )
}

export default MigrateV2
