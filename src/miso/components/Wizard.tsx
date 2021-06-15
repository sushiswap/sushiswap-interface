import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import usePrevious from '../../hooks/usePrevious'

const CardWizardContainer = styled.div`
    opacity: 1;

    border: 0;
    position: relative;
    width: 100%;
    margin-bottom: 30px;

    background: transparent !important;
    box-shadow: none !important;
    transition: all 300ms linear;

    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    border-radius: 0.4285rem;
`

const CardHeader = styled.div`
    background-color: transparent;

    padding-bottom: 10px;

    padding: 15px 15px 0;
    border: 0;
    color: rgba(255, 255, 255, 0.8);

    margin-bottom: 0;
`

const WizardNavigation = styled.div`
    position: relative;
    margin: 20px auto 60px;
`

const ProgressWithCircle = styled.div`
    position: relative;
    top: 5px;
    height: 5px;
    border-radius: 0.4285rem;
`

const ProgressBar = styled.div`
    height: 100%;
    border-radius: 0.4285rem;
    box-shadow: none;
    transition: width .3s ease;

    background: #f46e41;

    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #ffffff;
    text-align: center;
    white-space: nowrap;
`

const ProgressUL = styled.ul`
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 0.4285rem;
    height: 5px;

    display: flex;
    flex-wrap: wrap;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
`

const ProgressLI = styled.li`
    position: relative;
    
    color: #ffffff;
`

const ProgressA = styled.a`
    margin-right: 10px;
    margin-bottom: 5px;

    height: 40px;
    width: 40px;
    min-width: 40px;
    border-radius: 50% !important;
    position: absolute;
    left: 50%;
    top: -20px;
    transform: translate(-50%);
    background-color: white;

    color: #f46e41;
    padding-top: 5px;
`

const ProgressDescription = styled.p`
    position: absolute;
    top: 110%;
    left: 50%;
    transform: translate(-50%);
    font-weight: 700;
    color: #ffffff;
    white-space: nowrap;
`

export interface WizardProps {
    startIndex?: number
    title?: string
    subTitle?: string
    prevButtonText?: string
    nextButtonText?: string
    finishButtonText?: string
    vertical?: boolean
    activeTabIndex?: number
    tabs?: {
        tabId?: string
        active?: boolean
        checked?: boolean
        title?: string
    }[]
}

export default function Wizard({
    startIndex = 0,
    title = 'Title',
    subTitle = 'Subtitle',
    prevButtonText = 'Previous',
    nextButtonText = 'Next',
    finishButtonText = 'Finish',
    vertical = false,
    activeTabIndex = 0,
    tabs = []
}: WizardProps) {
    const tabLinkWidth = 0
    const tabLinkHeight = 50
    const previousTabIndex: number = usePrevious(activeTabIndex) as number

    useEffect(() => {
        if (previousTabIndex !== undefined && activeTabIndex !== previousTabIndex) {
            const oldTab = tabs[previousTabIndex]
            const newTab = tabs[activeTabIndex]
            oldTab.active = false
            newTab.active = true

            if (!newTab.checked) {
                newTab.checked = true
            }
        }
    }, [activeTabIndex]);

    function tabCount() {
        return tabs.length
    }

    function linkWidth() {
        let width = 100
        if (tabCount() > 0) {
            width = 100 / tabCount()
        }
        if (vertical) {
            width = 100
        }
        return { width: `${width}%` }
    }

    function stepPercentage() {
        return (1 / (tabCount() * 2)) * 100
    }

    function progress() {
        let percentage = 0
        if (activeTabIndex > 0) {
            const stepsToAdd = 1
            const stepMultiplier = 2
            percentage = stepPercentage() * (activeTabIndex * stepMultiplier + stepsToAdd)
        } else {
            percentage = stepPercentage()
        }
        return percentage
    }

    async function navigateToTab(e: any, index: number) {
        e.preventDefault()
        activeTabIndex = index
    }

    function setStyle(item: any){
        let styles = {}
        if (item.active) {
            const firstStyle = {
                color: '#ffffff',
                backgroundColor: '#f46e41'
            }
            styles = Object.assign(styles,firstStyle)
        }
        if (item.checked) {
            const secondStyle = {
                cursor: 'pointer'
            }
            styles = Object.assign(styles,secondStyle)
        } else {
            const secondStyle = {
                cursor: 'not-allowed'
            }
            styles = Object.assign(styles,secondStyle)
        }
        return styles
    }

    return (
        <div className="wizard-container">
            <CardWizardContainer id="wizardProfile" className="active">
                <form onSubmit={e => {
                        e.preventDefault();
                    }}
                >
                    <CardHeader className="text-center">
                        <WizardNavigation>
                            <ProgressWithCircle>
                                <ProgressBar role="progressbar" aria-valuenow={1} aria-valuemin={1} aria-valuemax={3} style={{width: progress() + '%'}}>
                                </ProgressBar>
                            </ProgressWithCircle>
                            {Object.keys(tabs).length > 0 && (
                                <ProgressUL>
                                    {tabs.map((item: any, index: number) => (
                                        <ProgressLI
                                            id={"step-"+(item.tabId)}
                                            key={index}
                                            role="tab"
                                            tabIndex={item.checked? 0: undefined}
                                            aria-controls={item.tabId}
                                            aria-disabled={!item.active}
                                            aria-selected={item.active}
                                            className="align-center"
                                            style={linkWidth()}
                                        >
                                            <ProgressA
                                                className="uppercase"
                                                onClick={e => navigateToTab(e, index)}
                                                style={setStyle(item)}
                                            >
							                    <span className="text-2xl">{index+1}</span>
                                                <ProgressDescription className="text-sm">{item.title}</ProgressDescription>
                                            </ProgressA>
                                        </ProgressLI>
                                    ))}
                                </ProgressUL>
                            )}
                        </WizardNavigation>
                    </CardHeader>
                </form>
            </CardWizardContainer>
        </div>
    )
}