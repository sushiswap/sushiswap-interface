import React, { useEffect, useState } from 'react'

import { CustomLightSpinner } from './Spinner'

const AsyncIcon = ({ src, className }: { src?: string; className?: string }): JSX.Element => {
    const [loadedSrc, setLoadedSrc] = useState<string>()

    src = src || `/images/tokens/unknown.png`

    // Address gets changed after chainId so only run this on address change
    // to avoid missing token icon error on chainId change
    useEffect(() => {
        setLoadedSrc('')

        const image = new Image()

        const handleLoad = () => {
            setLoadedSrc(src)
        }

        image.addEventListener('load', handleLoad)
        image.src = src

        return () => {
            image.removeEventListener('load', handleLoad)
        }
    }, [src])

    return loadedSrc ? (
        <img src={loadedSrc} className={className} alt="" />
    ) : (
        <div className={[className, 'flex justify-center items-center bg-gray-900'].join(' ')}>
            <CustomLightSpinner src="/blue-loader.svg" alt="loader" size={'24px'} />
        </div>
    )
}

export default AsyncIcon
