import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

const TabContainer = styled.div`
    color: rgba(0, 10, 53, 0.7) !important;
`

export interface WizardTabProps {
    label?: string
    id?: string
    beforeChange?: () => number
}

export default function WizardTab({
    label,
    id,
    beforeChange
}: WizardTabProps & React.HTMLAttributes<HTMLDivElement>): JSX.Element | null {
    const active = false
    const checked = false
    const hasError = false
    const tabId = ''

    if (!active) {
        return null
    }

    useEffect(() => {
        
    });
    return (
        <TabContainer className={"tab-pane fade active show" + (active?'active show':'')} id={tabId} aria-hidden={!active} aria-labelledby={`step-${tabId}`}>
        </TabContainer>
    )
}