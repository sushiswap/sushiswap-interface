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

    // Address gets changed after chainId so only run this on address change
    // to avoid missing token icon error on chainId change
    useEffect(() => {
        setLoadedSrc('')
        if (!(address && chainId)) return

        const src = getTokenIconUrl(address, chainId)
        const image = new Image()

        const handleLoad = () => {
            setLoadedSrc(src)
        }

        image.addEventListener('load', handleLoad)
        image.src = src
        return () => {
            image.removeEventListener('load', handleLoad)
        }
    }, [address])

    return loadedSrc ? (
        <img src={loadedSrc} className={className} alt="" />
    ) : (
        <div className={[className, 'flex justify-center items-center bg-gray-900'].join(' ')}>
            <CustomLightSpinner src={Circle} alt="loader" size={'24px'} />
        </div>
    )
}

export default AsyncTokenIcon
