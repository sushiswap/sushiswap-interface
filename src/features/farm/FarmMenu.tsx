import Badge from '../../components/Badge'
import { ChainId } from '@sushiswap/sdk'
import React from 'react'
import { useActiveWeb3React } from '../../hooks'

const Menu = ({ section, setSection }) => {
    const { chainId } = useActiveWeb3React()
    return (
        <div className="space-y-2">
            <div
                className={`cursor-pointer bg-dark-900 hover:bg-dark-800 rounded flex items-center px-4 py-6 border border-transparent ${
                    section === 'portfolio' &&
                    'font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900'
                }`}
                onClick={() => {
                    return setSection('portfolio')
                }}
            >
                Your Farms
            </div>
            <div
                className={`cursor-pointer bg-dark-900 hover:bg-dark-800 rounded flex items-center px-4 py-6 border border-transparent ${
                    section === 'all' &&
                    'font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900'
                }`}
                onClick={() => {
                    return setSection('all')
                }}
            >
                All Farms
            </div>
            {chainId === ChainId.MAINNET && (
                <>
                    <div
                        className={`cursor-pointer bg-dark-900 hover:bg-dark-800 rounded flex items-center px-4 py-6 border border-transparent ${
                            section === 'kmp' &&
                            'font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900'
                        }`}
                        onClick={() => {
                            return setSection('kmp')
                        }}
                    >
                        Kashi Farms
                    </div>
                    <div
                        className={`cursor-pointer bg-dark-900 hover:bg-dark-800 rounded flex items-center px-4 py-6 border border-transparent ${
                            section === 'slp' &&
                            'font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900'
                        }`}
                        onClick={() => {
                            return setSection('slp')
                        }}
                    >
                        SushiSwap Farms
                    </div>
                    <div
                        className={`cursor-pointer bg-dark-900 hover:bg-dark-800 rounded flex justify-between items-center px-4 py-6 border border-transparent ${
                            section === 'mcv2' &&
                            'font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900'
                        }`}
                        onClick={() => {
                            return setSection('mcv2')
                        }}
                    >
                        Dual Reward Farms
                        <Badge color="blue">New</Badge>
                    </div>
                </>
            )}
        </div>
    )
}

export default Menu
