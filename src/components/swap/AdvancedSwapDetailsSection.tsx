import React from 'react'
import { AdvancedSwapDetailsFixed, AdvancedSwapDetailsProps } from './AdvancedSwapDetailsFixed'

export default function AdvancedSwapDetailsSection({ trade, ...rest }: AdvancedSwapDetailsProps) {
	return <AdvancedSwapDetailsFixed {...rest} trade={trade ?? undefined} />
}
