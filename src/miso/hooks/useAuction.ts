import { useCallback, useContext, useEffect, useState } from 'react'
import { Contract } from '@ethersproject/contracts'
import { ethers } from 'ethers'

import { MisoContext } from '../context'
import { MarketInfo, TokenInfo, Commitment } from '../entities'
import { toDecimals, toPrecision } from '../utils'

import { useMisoHelper } from './useMisoHelper'
import { useAuctionContract } from './useAuctionContract'

const TOPIC_ADDED_COMMITMENT = '0x077511a636ba1f10551cc7b89c13ff66a6ac9344e8a917527817a9690b15af7a'

export function addCommitment(dispatch: any, commitment: Commitment) {
    return dispatch({
        type: 'ADD_COMMITMENT',
        payload: {
            commitment
        }
    })
}

function setCommitments(dispatch: any, commitments: Commitment[]) {
    return dispatch({
        type: 'SET_COMMITMENTS',
        payload: {
            commitments
        }
    })
}

const subscribeToNewCommitments = (auctionContract: Contract, dispatch: any, auctionId: string) => {
    auctionContract.on(
        {
            address: auctionId,
            topics: [TOPIC_ADDED_COMMITMENT]
        },
        (error, result) => {
            if (!error) {
                const decodedData = ethers.utils.defaultAbiCoder.decode(['address', 'uint256'], result.data)
                addCommitment(dispatch, {
                    txHash: result.transactionHash,
                    address: decodedData[0],
                    amount: decodedData[1]
                })
            }
        }
    )
}

const getPastCommitments = async (auctionContract: Contract, dispatch: any, auctionId: string) => {
    const commitments: Commitment[] = []
    const logs = await auctionContract.queryFilter({
        address: auctionId,
        topics: [TOPIC_ADDED_COMMITMENT]
    })
    logs.forEach(log => {
        const decodedData = ethers.utils.defaultAbiCoder.decode(['address', 'uint256'], log.data)
        commitments.push({
            txHash: log.transactionHash,
            address: decodedData[0],
            amount: decodedData[1]
        })
    })
    setCommitments(dispatch, commitments)
}

export function useAuctionData(
    auctionId: string,
    marketTemplateId: number
): [string, TokenInfo | undefined, MarketInfo | undefined, boolean, Date | undefined, string] {
    const misoContract = useMisoHelper(false)
    const { dispatch } = useContext(MisoContext)
    const auctionContract = useAuctionContract(auctionId, false)

    const [type, setType] = useState<string>('')
    const [tokenInfo, setTokenInfo] = useState<TokenInfo>()
    const [marketInfo, setMarketInfo] = useState<MarketInfo>()
    const [auctionSuccessful, setAuctionSuccessful] = useState<boolean>(false)
    const [date, setDate] = useState<Date>()
    const [auction, setAuction] = useState<string>('')

    const SetDutchAuctionData = async () => {
        const data = await misoContract?.getDutchAuctionInfo(auctionId)
        setTokenInfo({
            addr: data?.tokenInfo?.addr,
            decimals: data?.tokenInfo?.decimals,
            name: data?.tokenInfo?.name,
            symbol: data?.tokenInfo?.symbol
        })
        setMarketInfo({
            paymentCurrency: {
                addr: data?.paymentCurrencyInfo?.addr,
                decimals: data?.paymentCurrencyInfo?.decimals,
                name: data?.paymentCurrencyInfo?.name,
                symbol: data?.paymentCurrencyInfo?.symbol
            },
            startTime: data?.startTime?.toString(),
            endTime: data?.endTime?.toString(),
            startPrice: toDecimals(data?.startPrice),
            minimumPrice: toDecimals(data?.minimumPrice),
            finalized: data?.finalized,
            commitmentsTotal: toPrecision(toDecimals(data?.commitmentsTotal), 3),
            totalTokens: toDecimals(data?.totalTokens)
        })
        setAuctionSuccessful(data?.auctionSuccessful)
        const currentTimestamp = Date.now() / 1000
        if (data.startTime > currentTimestamp) {
            setAuction('upcoming')
            setDate(new Date(data.startTime * 1000))
        } else if (data.endTime > currentTimestamp) {
            setAuction('live')
            setDate(new Date(data.endTime * 1000))
        } else {
            setAuction('finished')
        }
    }

    useEffect(() => {
        const updateDate = async () => {
            let newType = ''
            switch (marketTemplateId) {
                case 2:
                    newType = 'dutch'
                    await SetDutchAuctionData()
                    break
                case 4:
                    newType = 'hyperbolic'
                    break
            }
            setType(newType)

            if (auctionContract) {
                getPastCommitments(auctionContract, dispatch, auctionId)
                subscribeToNewCommitments(auctionContract, dispatch, auctionId)
            }
        }
        updateDate()
    }, [marketTemplateId])

    return [type, tokenInfo, marketInfo, auctionSuccessful, date, auction]
}

export function useAuctionDocuments(auctionId: string): [string, string, string, object] {
    const misoContract = useMisoHelper(false)

    const [website, setWebsite] = useState<string>('')
    const [icon, setIcon] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [socialIcons, setSocialIcons] = useState<object>({})

    const fetchDocuments = useCallback(async () => {
        const documents = await misoContract?.getDocuments(auctionId)
        let icons = {}
        for (const idx in documents) {
            const document = documents[idx]
            const name = document['0']
            const data = document['1']
            if (name && data && data.length > 0) {
                switch (name) {
                    case 'website':
                        setWebsite(data)
                        break
                    case 'icon':
                        setIcon(data)
                        break
                    case 'description':
                        setDescription(data)
                        break
                    default:
                        icons = {
                            ...icons,
                            [name]: data
                        }
                }
            }
        }
        setSocialIcons(icons)
    }, [])

    useEffect(() => {
        fetchDocuments()
    }, [])

    return [website, icon, description, socialIcons]
}
