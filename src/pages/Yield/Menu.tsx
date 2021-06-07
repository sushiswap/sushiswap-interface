import React from 'react'
import Badge from '../../components/Badge'

const Menu = ({ section, setSection }: any) => {
    return (
        <div className="overflow-x-auto">
            <div className="flex flex-row space-x-2 text-xs whitespace-nowrap lg:text-base lg:flex-col lg:space-y-2 lg:space-x-0">
                <div
                    className={`cursor-pointer bg-dark-900 rounded flex items-center px-4 py-6 border border-transparent ${section ===
                        'portfolio' && 'border-gradient'}`}
                    onClick={() => {
                        return setSection('portfolio')
                    }}
                >
                    Your Staked Farms
                </div>
                <div
                    className={`cursor-pointer bg-dark-900 rounded flex items-center px-4 py-6 border border-transparent ${section ===
                        'all' && 'border-gradient'}`}
                    onClick={() => {
                        return setSection('all')
                    }}
                >
                    All Yield Farms
                </div>
                <div
                    className={`cursor-pointer bg-dark-900 rounded flex items-center px-4 py-6 border border-transparent ${section ===
                        'kmp' && 'border-gradient'}`}
                    onClick={() => {
                        return setSection('kmp')
                    }}
                >
                    Lending Yield Farms
                </div>
                <div
                    className={`cursor-pointer bg-dark-900 rounded flex items-center px-4 py-6 border border-transparent ${section ===
                        'slp' && 'border-gradient'}`}
                    onClick={() => {
                        return setSection('slp')
                    }}
                >
                    Liquidity Yield Farms
                </div>
                <div
                    className={`cursor-pointer bg-dark-900 rounded flex justify-between items-center px-4 py-6 border border-transparent ${section ===
                        'mcv2' && 'border-gradient'}`}
                    onClick={() => {
                        return setSection('mcv2')
                    }}
                >
                    Double Yield Farms
                    <Badge color="blue">New</Badge>
                </div>
                {/* <Card
                className="h-full bg-dark-900"
                backgroundImage={DepositGraphic}
                title={'Create a new Kashi Market'}
                description={
                    'If you want to supply to a market that is not listed yet, you can use this tool to create a new pair.'
                }
            /> */}
            </div>
        </div>
    )
}

export default Menu
