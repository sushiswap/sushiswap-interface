import Image from 'next/image'

import tokenIconUrl from '../../functions/tokenIconUrl'
import { Token } from '@sushiswap/sdk'
import { FC } from 'react'

interface TokenIconProps {
    token: Token
    className?: string
    size?: number
}

const TokenIcon: FC<TokenIconProps> = ({ token, className, size = 48 }): JSX.Element => {
    const src = tokenIconUrl(token.address, token.chainId)
    return (
        <Image className={`rounded ${className}`} src={src} alt={`${token.symbol}-logo`} width={size} height={size} />
    )
}

export default TokenIcon
