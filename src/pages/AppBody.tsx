import React from 'react'
import styled from 'styled-components'
import { transparentize } from 'polished'

const WithPadding = styled.div`
	padding: 16px;
	display: flex;
	flex-direction: column;
	width: 100%;
	align-items: center;
	flex: 1;
	overflow-y: auto;
	overflow-x: hidden;
	z-index: 1;
	min-height: 100vh;
`

export const BodyWrapper = styled.div`
	position: relative;
	max-width: 420px;
	width: 100%;

	background: ${({ theme }) => transparentize(0.25, theme.bg1)};
	box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
		0px 24px 32px rgba(0, 0, 0, 0.01);
	border-radius: 30px;
	/* padding: 1rem; */
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
	return (
		<WithPadding>
			<BodyWrapper>{children}</BodyWrapper>
		</WithPadding>
	)
}
