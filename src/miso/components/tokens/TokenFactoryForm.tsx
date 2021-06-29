import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import FixedIcon from 'assets/miso/mintable-boxes.svg'
import MintableIcon from 'assets/miso/mintable-2.svg'
import SushiIcon from 'assets/miso/sushi.svg'

import { Wizard, BaseRadio, BaseInput, BaseButton } from '../../components'

import { useActiveWeb3React } from '../../../hooks/useActiveWeb3React'
import { chain, trim } from 'lodash'

import { GetContractInstance } from '../../hooks/useTokenFactory'
import { showTransactionSentModal, showErrorModal, getTransactionLink, getTokenLink } from '../../hooks/base'
import { useCurrentTemplateId } from '../../hooks/useCurrentTemplateId'

import './tokenfactoryform.css'
import { ethers } from 'ethers'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const TokenFactoryTitle = styled.div`
    border-bottom: 1px solid #e9ecef;
    width: fit-content;
`

const CustomizedHr = styled.hr`
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    margin-top: 1rem;
    margin-bottom: 1rem;
`

const Result = styled.div`
    width: fit-content;
`

export interface TokenFactoryFormProps {
    className?: string,
    onClick?: (type: string) => void,
    onStepChanged?: (type: number) => void,
}

export default function TokenFactoryForm({
    className,
    onClick,
    onStepChanged
}: TokenFactoryFormProps) {
    const { account, chainId, library } = useActiveWeb3React()
    const [waitingForConfirmation, setWaitingForConfirmation] = useState(false)
    const [transactionHash, setTransactionHash] = useState<any>(null)
    const tokenFactoryContract = GetContractInstance()
    const [activeStep, setActiveStep] = useState(0)
    const [transactionLink, setTransactionLink] = useState()
    const [tokenLink, setTokenLink] = useState()
    const [tokenAddress, setTokenAddress] = useState<any>(null)
    
    type tabsType = {
        active: boolean,
        checked: boolean,
        tabId: string,
        title: string
    }
    
    const [tabs, setTabs] = useState<tabsType[]>([
        {
            active: true,
            checked: true,
            tabId: '1',
            title: 'Token Details'
        },
        {
            active: false,
            checked: false,
            tabId: '2',
            title: 'Deployment'
        },
        {
            active: false,
            checked: false,
            tabId: '3',
            title: 'Result'
        }
    ])
    
    const tokenTypes = [
        {
            displayName: 'fixed',
            name: '1',
            icon: 'mintable-boxes',
        },
        {
            displayName: 'mintable',
            name: '2',
            icon: 'mintable-2',
        },
        {
            displayName: 'sushi',
            name: '3',
            icon: 'sushi',
        },
    ]
    const tokenIcons: any = {
        fixed: FixedIcon,
        mintable: MintableIcon,
        sushi: SushiIcon
    }
    const tokenCreatedEventSubscribtion = null
    type tplotOptions = {
        [key: string]: boolean
    }
    const colors: tplotOptions = {
        tokenType: false,
        tokenName: false,
        tokenSymbol: false,
        initialSupply: false,
        totalSupply: false,
    }
    
    type tokenModelType = {
        name: string,
        symbol: string,
        totalSupply: any,
        templateType: string
    }
    
    const [tokenModel, setTokenModel] = useState<tokenModelType>({
        name: '',
        symbol: '',
        totalSupply: null,
        templateType: '2',
    })
    const tokenTemplateId = useCurrentTemplateId(tokenModel.templateType)

    useEffect(() => {
        tokenFactoryContract?.on('TokenCreated', (owner, addr, tokenTemplate, event) => {
            setTokenAddress(addr)
            if (addr && chainId) {
                setTokenLink(getTokenLink(addr, chainId))
            }
            setActiveStep(2)
            if (onStepChanged)
                onStepChanged(2)
        })
    }, [])
    
    useEffect(() => {
        let i
        let temp = tabs.slice()
        for (i=0; i<activeStep+1; i++) {
            temp[i].active = true
            temp[i].checked = true
        }
        setTabs(temp)
    }, [activeStep])

    function formPreventDefault(e: any) {
        e.preventDefault();
    }    

    function focusColor(val: string) {
        for (const key in colors) {
            if (val === key) {
                colors[key] = true
            } else {
                colors[key] = false
            }
        }
        // this.$emit('active-focus', this.colors)
    }

    function onChangeTokenType(val: any) {
        let temp = {
            name: tokenModel.name,
            symbol: tokenModel.symbol,
            totalSupply: tokenModel.totalSupply,
            templateType: val
        }
        setTokenModel(temp)
        if (onClick)
            onClick('type')
    }

    function onInputFocus(type: string) {
        if (onClick)
            onClick(type)
    }

    function onInputBlur(name: string, val: string) {
        let temp = {
            name: tokenModel.name,
            symbol: tokenModel.symbol,
            totalSupply: tokenModel.totalSupply,
            templateType: tokenModel.templateType
        }
        if (name === 'token name')
            temp.name = val
        else if (name === 'token symbol')
            temp.symbol = val
        else if (name === 'total supply' || name === 'initial supply')
            temp.totalSupply = val
        setTokenModel(temp)
    }

    function changeStep() {
        if (activeStep === 2) {
            const tokenModel1 = {
                name: '',
                symbol: '',
                totalSupply: 0,
                templateType: '2',
                deploymentFee: 0.1,
            }
            setTokenModel(tokenModel1)
            setActiveStep(0)
        } else {
            setActiveStep(activeStep+1)
            if (onStepChanged)
                onStepChanged(activeStep+1)
        }
        // this.$emit('active-step', this.activeStep)
    }

    async function createToken() {
        // Token Template Id
        const tokenData = [
            tokenModel.name,
            tokenModel.symbol,
            account,
            ethers.utils.parseEther(tokenModel.totalSupply),
        ]

        const data = ethers.utils.defaultAbiCoder.encode(
            ['string', 'string', 'address', 'uint256'],
            tokenData
        )

        // Create Token
        const methodToSend = await tokenFactoryContract?.createToken(
            tokenTemplateId,
            account,
            data
        ).catch((err: any) => {
            showErrorModal('Insufficient gas limit!')
        })
        if (methodToSend) {
            const txHash = methodToSend.hash
            if (txHash && chainId) {
                showTransactionSentModal(txHash, chainId)
                setTransactionHash(txHash)
                setTransactionLink(getTransactionLink(txHash, chainId))
                changeStep()
            } else {
                showErrorModal('Error occured when creating token!')
            }
        }
    }

    async function onDeploy() {
        if (trim(tokenModel.name) !=='' && trim(tokenModel.symbol) !=='' && trim(tokenModel.templateType) !=='' && tokenModel.totalSupply && eval(trim(tokenModel.totalSupply))>0 ) {
            setWaitingForConfirmation(true)
            await createToken()
            setWaitingForConfirmation(false)
        } else {
            setWaitingForConfirmation(false)
        }
    }

    return (
        <div className={className}>
            <div className="hero-section mt-4 pt-3 pb-2 border-bottom-after position-relative">
                <TokenFactoryTitle
                    className="
                        text-white text-xl text-capitalize font-bold
                        border-bottom
                        pb-2
                    "
                >
                    TOKEN FACTORY
                </TokenFactoryTitle>
            </div>
            <div className="px-5">
                <Wizard tabs={tabs} activeTabIndex={activeStep} />
            </div>
            <div className="px-5">
                {activeStep === 0 && (<form onSubmit={formPreventDefault}>
                    <div className="grid grid-cols-12 justify-center mb-4 px-3">
                        <div className="col-span-12">
                            <label className="form-control-label font-bold mb-4 text-md">
                                Token type
                            </label>
                            <div className="grid grid-cols-12">
                                <div className="col-span-12">
                                    <div className="flex justify-between">
                                        {tokenTypes.map((token) => (
                                            <div key={token.name} className="flex flex-col" onClick={(e) => focusColor('tokenType')}>
                                                <img
                                                    src={tokenIcons[token.displayName]}
                                                    width={60}
                                                    height={60}
                                                />
                                                {tokenModel.templateType && (
                                                    <BaseRadio
                                                        name={token.name}
                                                        caption={token.displayName}
                                                        radioname={'tokentype'}
                                                        value={token.name === tokenModel.templateType?true:false}
                                                        onRadioClick={onChangeTokenType}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 px-3">
                        <div className="col-span-12 mr-1">
                            <BaseInput
                                label="Token Name"
                                name="token name"
                                placeholder="Miso Token"
                                type="text"
                                rules="required"
                                onInputBlur={onInputBlur}
                                onInputFocus={onInputFocus}
                            />
                        </div>
                        <div className="col-span-12 mr-1">
                            <BaseInput
                                label="Token Symbol"
                                name="token symbol"
                                placeholder="MISO"
                                type="text"
                                rules="required"
                                onInputBlur={onInputBlur}
                                onInputFocus={onInputFocus}
                            />
                        </div>
                        <div className="col-span-12 mr-1">
                            {tokenModel.templateType === '1' && (
                            <BaseInput
                                label="Total Supply"
                                name="total supply"
                                placeholder="1000"
                                type="number"
                                rules="required|min:1"
                                onInputBlur={onInputBlur}
                                onInputFocus={onInputFocus}
                            />
                            )}
                            {tokenModel.templateType !== '1' && (
                            <BaseInput
                                label="Initial Supply"
                                name="initial supply"
                                placeholder="1000"
                                type="number"
                                rules="required|min:1"
                                onInputBlur={onInputBlur}
                                onInputFocus={onInputFocus}
                            />
                            )}
                        </div>
                    </div>
                    <CustomizedHr className="px-3" />
                    {!account && (
                        <span className="alert-inner--text px-3">
                            Account is not connected. Please connect wallet to be able to proceed
                        </span>
                    )}
                    {account && activeStep === 0 && (
                        <BaseButton
                            className="float-right mx-5 deploy-rounded font-bold uppercase text-sm"
                            loading={waitingForConfirmation}
                            onClick={() => onDeploy()}
                        >
                            Deploy
                        </BaseButton>
                    )}
                </form>)}
                {activeStep === 1 && (
                    <div className="grid grid-cols-12">
                        <div className="col-span-6 bg-dark-900 p-5 m-5">
                            <div className="text-gray-300 text-xl font-bold uppercase">
                                Token
                            </div>
                            <div className="text-gray-300 text-lg uppercase font-bold mt-5">
                                Name
                            </div>
                            <div className="text-white text-md">
                                {tokenModel.name}
                            </div>
                            <div className="text-gray-300 text-lg mt-2">
                                Symbol
                            </div>
                            <div className="text-white text-md">
                                {tokenModel.symbol}
                            </div>
                            <div className="text-gray-300 text-lg mt-2">
                                {tokenModel.templateType === '1'?(
                                    <span>Total Supply</span>
                                ):(
                                    <span>Initial Supply</span>
                                )}
                            </div>
                            <div className="text-white text-md">
                                {tokenModel.totalSupply}
                            </div>
                        </div>
                        <div className="col-span-6 bg-dark-900 p-5 m-5">
                            <div className="text-gray-300 text-xl font-bold uppercase">
                                Transaction
                            </div>
                            <div className="text-gray-300 text-lg uppercase font-bold mt-5">
                                Transaction Hash
                            </div>
                            <div className="text-white text-md break-all">
                                <a href={transactionLink} target="blank" className="block">
                                    {transactionHash}
                                </a>
                            </div>
                            <div className="text-gray-300 text-lg mt-2">
                                Status
                            </div>
                            <div className="text-white text-md flex flex-row items-center">
                                Pending <FontAwesomeIcon icon={faSpinner} className="ml-2" />
                            </div>
                        </div>
                    </div>
                )}
                {activeStep === 2 && (
                    <div className="flex justify-center items-center">
                        <Result className="flex flex-col bg-dark-900 p-5 m-5">
                            <div className="text-gray-300 text-lg font-bold uppercase">
                                Transaction Confirmed
                            </div>
                            <div className="text-gray-300 text-lg uppercase font-bold mt-5">
                                Transaction Hash
                            </div>
                            <div className="text-white text-md break-all">
                                <a href={transactionLink} target="blank">
                                    {transactionHash}
                                </a>
                            </div>
                            <div className="text-gray-300 text-lg mt-2 uppercase font-bold">
                                Token
                            </div>
                            <div className="text-white text-md">
                                <a href={tokenLink} target="blank">
                                    {tokenAddress}
                                </a>
                            </div>
                        </Result>
                    </div>
                )}
            </div>
        </div>
    )
}