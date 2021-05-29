import React, { useEffect, useState } from 'react'

import { CustomLightSpinner } from './Spinner'
import { classNames } from '../functions'

const AsyncIcon = ({ src, className }: { src?: string; className?: string }): JSX.Element => {
    const [loadedSrc, setLoadedSrc] = useState<string>()

    src = src || `/images/tokens/unknown.png`

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
        <div className={classNames('flex justify-center items-center bg-gray-900', className)}>
            <CustomLightSpinner src="/blue-loader.svg" alt="loader" size={24} />
        </div>
    )
}

export default AsyncIcon
