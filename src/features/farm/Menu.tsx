import React from 'react'

const Menu = ({ section, setSection }: any) => {
    return (
        <>
            <div
                className={`cursor-pointer bg-dark-900 rounded flex items-center px-4 py-6 border border-transparent ${
                    section === 'portfolio' && 'border-gradient'
                }`}
                onClick={() => {
                    return setSection('portfolio')
                }}
            >
                Your Staked Assets
            </div>
            <div
                className={`cursor-pointer bg-dark-900 rounded flex items-center px-4 py-6 border border-transparent ${
                    section === 'all' && 'border-gradient'
                }`}
                onClick={() => {
                    return setSection('all')
                }}
            >
                All Yield Assets
            </div>
            <div
                className={`cursor-pointer bg-dark-900 rounded flex items-center px-4 py-6 border border-transparent ${
                    section === 'kmp' && 'border-gradient'
                }`}
                onClick={() => {
                    return setSection('kmp')
                }}
            >
                Lending Yield Assets
            </div>
            <div
                className={`cursor-pointer bg-dark-900 rounded flex items-center px-4 py-6 border border-transparent ${
                    section === 'slp' && 'border-gradient'
                }`}
                onClick={() => {
                    return setSection('slp')
                }}
            >
                Liquidity Yield Assets
            </div>
            <div
                className={`cursor-pointer bg-dark-900 rounded flex items-center px-4 py-6 border border-transparent ${
                    section === 'mcv2' && 'border-gradient'
                }`}
                onClick={() => {
                    return setSection('mcv2')
                }}
            >
                Double Yield Assets
            </div>
            {/* <Card
                className="h-full bg-dark-900"
                backgroundImage={DepositGraphic}
                title={'Create a new Kashi Market'}
                description={
                    'If you want to supply to a market that is not listed yet, you can use this tool to create a new pair.'
                }
            /> */}
        </>
    )
}

export default Menu
