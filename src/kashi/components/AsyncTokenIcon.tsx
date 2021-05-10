import React, { useEffect, useState } from 'react'
import { getTokenIconUrl } from '../functions'
import { ChainId } from '@sushiswap/sdk'
import Circle from '../../assets/images/blue-loader.svg'
import { CustomLightSpinner } from '../../theme'

const AsyncTokenIcon = ({
    address,
    chainId,
    className
}: {
    address: string
    chainId?: ChainId
    className?: string
}): JSX.Element => {
    const [loadedSrc, setLoadedSrc] = useState<string>()

    useEffect(() => {
        if (!(address && chainId)) return

        const src = getTokenIconUrl(address, chainId)
        const image = new Image()

        const handleLoad = () => {
            setLoadedSrc(src)
        }

        image.src = src
        image.addEventListener('load', handleLoad)
        return () => {
            image.removeEventListener('load', handleLoad)
        }
    }, [address, chainId])

    return loadedSrc ? (
        <img src={loadedSrc} className={className} alt="" />
    ) : (
        <div className={[className, 'flex justify-center items-center bg-gray-900'].join(' ')}>
            <CustomLightSpinner src={Circle} alt="loader" size={'24px'} />
        </div>
    )
}

export default AsyncTokenIcon
