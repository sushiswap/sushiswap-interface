import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'

//import { WrapperNoPadding } from '../../components/swap/styleds'
import { useDarkModeManager } from '../../state/user/hooks'
import AppBody from '../AppBody'
import SaaveHeader from './SaaveHeader'
import { Wrapper } from '../../components/swap/styleds'

import SushiInputPanel from './SushiInputPanel'
import AXSushiBalancePanel from './AXSushiBalancePanel'

import { CardSection, DataCard } from '../../components/earn/styled'
import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import { TYPE, ExternalLink } from '../../theme'
import { transparentize } from 'polished'

const PageWrapper = styled(AutoColumn)`
	max-width: 420px;
	width: 100%;
`

const VoteCard = styled(DataCard)`
	background: ${({ theme }) => transparentize(0.5, theme.bg1)};
	overflow: hidden;
	margin-bottom: 10px;
`

export default function Saave() {
	const theme = useContext(ThemeContext)
	const darkMode = useDarkModeManager()

	return (
		<>
			<PageWrapper>
				<VoteCard>
					<CardSection>
						<AutoColumn gap="md">
							<RowBetween>
								<TYPE.white fontWeight={600} color={theme.text1}>
									SAAVE: Stack your yields in one transaction
								</TYPE.white>
							</RowBetween>
							<RowBetween>
								<TYPE.white fontSize={14} color={theme.text2}>
									{`Stake your SUSHI into xSUSHI for 15% APY. Deposit your xSUSHI into Aave as aXSUSHI to earn collateral interest and borrowing power. All in one click.`}
								</TYPE.white>
							</RowBetween>
							<ExternalLink
								style={{ color: `${darkMode ? 'white' : 'black'}`, textDecoration: 'underline' }}
								target="_blank"
								href="https://app.ens.domains/name/saave.eth"
							>
								<TYPE.white fontSize={14} color={theme.text1}>
									Keys Burned: 2022.03.04 at 22:05
								</TYPE.white>
							</ExternalLink>
							<ExternalLink
								style={{ color: `${darkMode ? 'white' : 'black'}`, textDecoration: 'underline' }}
								target="_blank"
								href="https://etherscan.io/address/0x364762c00b32c4b448f39efaa9cefc67a25603ff#code"
							>
								<TYPE.white fontSize={14} color={theme.text1}>
									Read the contract
								</TYPE.white>
							</ExternalLink>
						</AutoColumn>
					</CardSection>
				</VoteCard>
				<AppBody>
					<SaaveHeader />
					<Wrapper id="swap-page">
						<AutoColumn style={{ paddingBottom: '10px' }}>
							<SushiInputPanel
								label={''}
								disableCurrencySelect={true}
								customBalanceText={'Available to deposit: '}
								id="stake-liquidity-token"
								buttonText="Deposit"
								cornerRadiusBottomNone={true}
							/>
							<AXSushiBalancePanel
								label={'aXSUSHI Balance'}
								disableCurrencySelect={true}
								id="ax-token-balance"
								cornerRadiusTopNone={true}
							/>
						</AutoColumn>
					</Wrapper>
				</AppBody>
			</PageWrapper>
		</>
	)
}
