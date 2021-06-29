import { useCallback, useEffect, useState } from 'react'

import { GetContractInstance } from './useTokenFactory'

export function useCurrentTemplateId(templateType: string): number {
    const tokenFactoryContract = GetContractInstance()

    const [templateId, setTemplateId] = useState('')
    const fetchCurrentTemplate = useCallback(async () => {
        try {
            const marketTemplate = await tokenFactoryContract?.currentTemplateId(templateType)
            setTemplateId(marketTemplate)
        } catch (error) {
            setTemplateId('')
            throw error
        }
    }, [tokenFactoryContract])

    useEffect(() => {
        fetchCurrentTemplate()
    }, [])

    return parseInt(templateId)
}
