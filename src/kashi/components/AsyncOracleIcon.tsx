import React, { useEffect, useState } from 'react'

import Circle from '../../assets/images/blue-loader.svg'
import { CustomLightSpinner } from '../../theme'

const AsyncOracleIcon = ({ name, className }: { name: string; className?: string }): JSX.Element => {
    const [loadedSrc, setLoadedSrc] = useState<string>()

    useEffect(() => {
        setLoadedSrc('')
        if (!name) return

        const src = `${process.env.PUBLIC_URL}/images/oracles/${name.toLowerCase()}.jpg`
        const image = new Image()

        const handleLoad = () => {
            setLoadedSrc(src)
        }

        image.addEventListener('load', handleLoad)
        image.src = src
        return () => {
            image.removeEventListener('load', handleLoad)
        }
    }, [name])

    return loadedSrc ? (
        <img src={loadedSrc} className={className} alt="" />
    ) : (
        <div className={[className, 'flex justify-center items-center bg-gray-900'].join(' ')}>
            <CustomLightSpinner src={Circle} alt="loader" size={'24px'} />
        </div>
    )
}

export default AsyncOracleIcon
