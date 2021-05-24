import { useCallback, useEffect, useState } from 'react'

import { useDutchAuctionContract } from './useAuctionContract'

export function useAuctionTemplateId(auctionId: string): number {
    const auctionContract = useDutchAuctionContract(auctionId, false)

    const [templateId, setTemplateId] = useState('')
    const fetchMarketTemplate = useCallback(async () => {
        try {
            const marketTemplate = await auctionContract?.marketTemplate()
            setTemplateId(marketTemplate)
        } catch (error) {
            setTemplateId('')
            throw error
        }
    }, [auctionContract])

    useEffect(() => {
        fetchMarketTemplate()
    }, [])

    return parseInt(templateId)
}
