import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

import { SidebarNotification } from '../../components'
import TokenFactoryForm from '../../components/tokens/TokenFactoryForm'

import './styles.css'

const NewTokenContainer = styled.div``

const SideBar = styled.div`
    height: 100%;
`

const Steps = styled.p`
    border-radius: 0.75rem;
    background-color: rgba(246,69,128,0.52549) !important;
`
const StepIndicator = styled.div`
    color: #525f7f;
`

const Documentation = styled.span`
    color: #ba54f5;
`

export default function NewToken({
    match: {
        params: {}
    }
}: RouteComponentProps<{}>) {
    const { i18n } = useLingui()

    const [tabIndex, setTabIndex] = useState<number>(0)
    
    type stepsType = {
        active: boolean,
        top: number,
        title: string,
        description: string
    }
    
    const [allSteps, setAllSteps] = useState<stepsType[]>([
        {
            active: false,
            top: 27,
            title: 'TOKEN TYPE*',
            description:
                'Select a token type. For details on our current token types, please visit the Documentation',
        },
        {
            active: false,
            top: 39,
            title: 'TOKEN NAME*',
            description:
                'This will be the name of your token. Choose wisely, this cannot be changed later',
        },
        {
            active: false,
            top: 50,
            title: 'TOKEN SYMBOL*',
            description:
                'This will be the symbol of your token, normally a short version of your token name.',
        },
        {
            active: false,
            top: 65,
            title: 'INITIAL SUPPLY*',
            description: 'This will be the number of tokens initially minted.',
        },
        {
            active: false,
            top: 61.5,
            title: 'TOTAL SUPPLY*',
            description:
                'This will be the number of tokens ever minted. This number is fixed.',
        },
    ])

    const sidebarTitles = ['TOKEN DETAILS', 'DEPLOYMENT', 'RESULT']

    function onClick(type: string) {
        let clonedArray = JSON.parse(JSON.stringify(allSteps))
        let i

        for (i=0; i<clonedArray.length; i++)
            clonedArray[i].active = false
            
        if (type === 'type')
            clonedArray[0].active = true
        else if (type === 'token name')
            clonedArray[1].active = true
        else if (type === 'token symbol')
            clonedArray[2].active = true
        else if (type === 'initial supply')
            clonedArray[3].active = true
        else if (type === 'total supply')
            clonedArray[4].active = true

        setAllSteps(clonedArray)
    }

    function onStepChanged(step: number) {
        setTabIndex(step)
    }

    return (
        <>
            <Helmet>
                <title>{i18n._(t`Miso`)} | Sushi</title>
            </Helmet>
            <NewTokenContainer className="flex flex-col-reverse lg:flex-row xl:flex-row lg:h-full xl:h-full no-scrollbar">
                <TokenFactoryForm className="w-full lg:w-8/12 xl:w-9/12" onClick={onClick} onStepChanged={onStepChanged} />
                <SideBar className="w-full lg:w-4/12 xl:w-3/12
                    bg-dark-900
                    mb-sm-5 mb-md-0
                    darker-side
                    order-0
                    relative
                    pb-5
                    lg:pb-0
                    xl:pb-0
                    ">
                    <div className="flex items-center mt-5 mb-2 pl-3">
                        <div className="text-white text-2xl capitalize font-bold pr-3">
                            { sidebarTitles[tabIndex] }
                        </div>
                        <Steps className="
                                text-lg
                                py-1
                                px-3
                                mb-0
                                flex
                                items-center
                                text-white
                                font-bold
                            "
                        >
                            Step { tabIndex + 1 } of 3
                        </Steps>
                    </div>
                    <StepIndicator className="pl-3 pr-3">
                        * indicates required step
                        <br />
                        <span className="text-white text-lg">
                            Create your own Token at the Token Factory. For details on all current
                            Token types, please visit our&nbsp;
                            <a href="https://instantmiso.gitbook.io/miso/tokens" target="_blank" rel="noreferrer">
                                <Documentation>
                                    Documentation
                                </Documentation>
                            </a>
                        </span>
                    </StepIndicator>

                    {tabIndex === 0 && (
                        <div>
                            {allSteps.map((allStep) => ( 
                                <SidebarNotification
                                    key={allStep.title}
                                    active={allStep.active}
                                    title={allStep.title}
                                    description={allStep.description}
                                    top={allStep.top}
                                    className={allStep.active?'notification-show':'notification-original'}
                                />
                            ))}
                        </div>
                    )}

                </SideBar>
            </NewTokenContainer>
        </>
    )
}
