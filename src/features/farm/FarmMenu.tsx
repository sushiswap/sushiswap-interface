import Badge from '../../components/Badge'
import { ChainId } from '@sushiswap/sdk'
import React from 'react'
import { useActiveWeb3React } from '../../hooks'

const Menu = ({ section, setSection }) => {
    const { chainId } = useActiveWeb3React()
    return (
        <div className="space-y-2">
            <div
                className={`cursor-pointer bg-dark-900 rounded flex items-center px-4 py-6 border border-transparent ${
                    section === 'portfolio' && 'border-gradient'
                }`}
                onClick={() => {
                    return setSection('portfolio')
                }}
            >
                Your Farms
            </div>
            <div
                className={`cursor-pointer bg-dark-900 rounded flex items-center px-4 py-6 border border-transparent ${
                    section === 'all' && 'border-gradient'
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
                        className={`cursor-pointer bg-dark-900 rounded flex items-center px-4 py-6 border border-transparent ${
                            section === 'kmp' && 'border-gradient'
                        }`}
                        onClick={() => {
                            return setSection('kmp')
                        }}
                    >
                        Kashi Farms
                    </div>
                    <div
                        className={`cursor-pointer bg-dark-900 rounded flex items-center px-4 py-6 border border-transparent ${
                            section === 'slp' && 'border-gradient'
                        }`}
                        onClick={() => {
                            return setSection('slp')
                        }}
                    >
                        SushiSwap Farms
                    </div>
                    <div
                        className={`cursor-pointer bg-dark-900 rounded flex justify-between items-center px-4 py-6 border border-transparent ${
                            section === 'mcv2' && 'border-gradient'
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
