// TODO: This needs to be removed and CurrencyIcon used instead.

import React, { useEffect, useState } from 'react'

import { ChainId } from '@sushiswap/sdk'
import { getAddress } from '@ethersproject/address'
import { getMaticTokenLogoURL } from '../../constants/maticTokenMapping'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'

const getTokenLogoURL = (address: string, chainId: any) => {
    let imageURL
    if (chainId === ChainId.MAINNET) {
        imageURL = `https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/${isAddress(
            address
        )}/logo.png`
    } else if (chainId === ChainId.BSC) {
        imageURL = `https://v1exchange.pancakeswap.finance/images/coins/${isAddress(address)}.png`
    } else if (chainId === ChainId.MATIC) {
        imageURL = getMaticTokenLogoURL(address)
    } else {
        imageURL = `https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/${isAddress(
            address
        )}/logo.png`
    }
    return imageURL
}

const isAddress = (value: any) => {
    try {
        return getAddress(value.toLowerCase())
    } catch {
        return false
    }
}

//const BAD_IMAGES = {}

const Inline = styled.div`
    display: flex;
    align-items: center;
    align-self: center;
`

const Image = styled.img<{ size: number }>`
    width: ${({ size }) => size};
    height: ${({ size }) => size};
    max-width: 100px;
    border-radius: 50%;
`
// background-color: white;
// box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);

export default function TokenLogo({ address, header = false, size, ...rest }: any) {
    const { chainId } = useActiveWeb3React()
    const [error, setError] = useState(false)

    useEffect(() => {
        setError(false)
    }, [address])

    //if (error || BAD_IMAGES[address]) {
    if (error) {
        return (
            <Inline>
                <Image {...rest} alt={''} src="/images/placeholder.png" width={size} height={size} />
            </Inline>
        )
    }

    if (address === 'kashiLogo') {
        return (
            <Inline>
                <Image {...rest} alt={''} src="/kashi-neon.png" width={size} height={size} />
            </Inline>
        )
    }
    // hard coded fixes for trust wallet api issues
    if (address?.toLowerCase() === '0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb') {
        address = '0x42456d7084eacf4083f1140d3229471bba2949a8'
    }
    if (address?.toLowerCase() === '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f') {
        address = '0xc011a72400e58ecd99ee497cf89e3775d4bd732f'
    }
    //console.log('address:', isAddress(address))

    const path = getTokenLogoURL(address, chainId)

    return (
        <Inline>
            <Image
                {...rest}
                alt={''}
                src={path}
                size={size}
                onError={(event) => {
                    //   BAD_IMAGES[address] = true
                    setError(true)
                    event.preventDefault()
                }}
            />
        </Inline>
    )
}
