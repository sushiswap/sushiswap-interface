import React, { useState } from 'react'
import { ExternalLink } from '../../components/Link'
import ArrowIcon from '../../assets/images/arrow-up-right-blue.svg'
import SortIcon from '../../assets/images/sort-icon.svg'

const mock = {
    txs: [
        {
            date: 'March 20, 2021',
            type: 'Deposit',
            amount: '324.722987',
            txHash: '0x46d8e1dfc65411d31a0b79b2d8ba6feeb7e2f8fc84f2f01ee8ed3a5b4748740f'
        },
        {
            date: 'March 20, 2021',
            type: 'Deposit',
            amount: '324.722987',
            txHash: '0x46d8e1dfc65411d31a0b79b2d8ba6feeb7e2f8fc84f2f01ee8ed3a5b4748740f'
        },
        {
            date: 'March 20, 2021',
            type: 'Deposit',
            amount: '324.722987',
            txHash: '0x46d8e1dfc65411d31a0b79b2d8ba6feeb7e2f8fc84f2f01ee8ed3a5b4748740f'
        },
        {
            date: 'March 20, 2021',
            type: 'Deposit',
            amount: '324.722987',
            txHash: '0x46d8e1dfc65411d31a0b79b2d8ba6feeb7e2f8fc84f2f01ee8ed3a5b4748740f'
        },
        {
            date: 'March 20, 2021',
            type: 'Deposit',
            amount: '324.722987',
            txHash: '0x46d8e1dfc65411d31a0b79b2d8ba6feeb7e2f8fc84f2f01ee8ed3a5b4748740f'
        },
        {
            date: 'March 20, 2021',
            type: 'Deposit',
            amount: '324.722987',
            txHash: '0x46d8e1dfc65411d31a0b79b2d8ba6feeb7e2f8fc84f2f01ee8ed3a5b4748740f'
        },
        {
            date: 'March 20, 2021',
            type: 'Deposit',
            amount: '324.722987',
            txHash: '0x46d8e1dfc65411d31a0b79b2d8ba6feeb7e2f8fc84f2f01ee8ed3a5b4748740f'
        },
        {
            date: 'March 20, 2021',
            type: 'Deposit',
            amount: '324.722987',
            txHash: '0x46d8e1dfc65411d31a0b79b2d8ba6feeb7e2f8fc84f2f01ee8ed3a5b4748740f'
        },
        {
            date: 'March 20, 2021',
            type: 'Deposit',
            amount: '324.722987',
            txHash: '0x46d8e1dfc65411d31a0b79b2d8ba6feeb7e2f8fc84f2f01ee8ed3a5b4748740f'
        },
        {
            date: 'March 20, 2021',
            type: 'Deposit',
            amount: '324.722987',
            txHash: '0x46d8e1dfc65411d31a0b79b2d8ba6feeb7e2f8fc84f2f01ee8ed3a5b4748740f'
        },
        {
            date: 'March 20, 2021',
            type: 'Deposit',
            amount: '324.722987',
            txHash: '0x46d8e1dfc65411d31a0b79b2d8ba6feeb7e2f8fc84f2f01ee8ed3a5b4748740f'
        },
        {
            date: 'March 20, 2021',
            type: 'Deposit',
            amount: '324.722987',
            txHash: '0x46d8e1dfc65411d31a0b79b2d8ba6feeb7e2f8fc84f2f01ee8ed3a5b4748740f'
        },
        {
            date: 'March 20, 2021',
            type: 'Deposit',
            amount: '324.722987',
            txHash: '0x46d8e1dfc65411d31a0b79b2d8ba6feeb7e2f8fc84f2f01ee8ed3a5b4748740f'
        },
        {
            date: 'March 20, 2021',
            type: 'Deposit',
            amount: '324.722987',
            txHash: '0x46d8e1dfc65411d31a0b79b2d8ba6feeb7e2f8fc84f2f01ee8ed3a5b4748740f'
        },
        {
            date: 'March 20, 2021',
            type: 'Deposit',
            amount: '324.722987',
            txHash: '0x46d8e1dfc65411d31a0b79b2d8ba6feeb7e2f8fc84f2f01ee8ed3a5b4748740f'
        },
        {
            date: 'March 20, 2021',
            type: 'Deposit',
            amount: '324.722987',
            txHash: '0x46d8e1dfc65411d31a0b79b2d8ba6feeb7e2f8fc84f2f01ee8ed3a5b4748740f'
        },
        {
            date: 'March 20, 2021',
            type: 'Deposit',
            amount: '324.722987',
            txHash: '0x46d8e1dfc65411d31a0b79b2d8ba6feeb7e2f8fc84f2f01ee8ed3a5b4748740f'
        },
        {
            date: 'March 20, 2021',
            type: 'Deposit',
            amount: '324.722987',
            txHash: '0x46d8e1dfc65411d31a0b79b2d8ba6feeb7e2f8fc84f2f01ee8ed3a5b4748740f'
        },
        {
            date: 'March 20, 2021',
            type: 'Deposit',
            amount: '324.722987',
            txHash: '0x46d8e1dfc65411d31a0b79b2d8ba6feeb7e2f8fc84f2f01ee8ed3a5b4748740f'
        },
        {
            date: 'March 20, 2021',
            type: 'Deposit',
            amount: '324.722987',
            txHash: '0x46d8e1dfc65411d31a0b79b2d8ba6feeb7e2f8fc84f2f01ee8ed3a5b4748740f'
        },
        {
            date: 'March 20, 2021',
            type: 'Deposit',
            amount: '324.722987',
            txHash: '0x46d8e1dfc65411d31a0b79b2d8ba6feeb7e2f8fc84f2f01ee8ed3a5b4748740f'
        },
        {
            date: 'March 20, 2021',
            type: 'Deposit',
            amount: '324.722987',
            txHash: '0x46d8e1dfc65411d31a0b79b2d8ba6feeb7e2f8fc84f2f01ee8ed3a5b4748740f'
        },
        {
            date: 'March 20, 2021',
            type: 'Deposit',
            amount: '324.722987',
            txHash: '0x46d8e1dfc65411d31a0b79b2d8ba6feeb7e2f8fc84f2f01ee8ed3a5b4748740f'
        },
        {
            date: 'March 20, 2021',
            type: 'Deposit',
            amount: '324.722987',
            txHash: '0x46d8e1dfc65411d31a0b79b2d8ba6feeb7e2f8fc84f2f01ee8ed3a5b4748740f'
        },
        {
            date: 'March 20, 2021',
            type: 'Deposit',
            amount: '324.722987',
            txHash: '0x46d8e1dfc65411d31a0b79b2d8ba6feeb7e2f8fc84f2f01ee8ed3a5b4748740f'
        }
    ]
}

const TXS_PER_PAGE = 9

const ColumnHeader = ({ className = '', children }: any) => (
    <div className={`flex flex-1 h-14 md:h-20 text-caption2 md:text-lg text-high-emphesis font-bold ${className}`}>
        {children}
    </div>
)

const Item = ({ children }: any) => (
    <div className="h-12 mb-1 text-xs md:text-caption text-high-emphesis font-normal md:font-bold">{children}</div>
)

const Transaction = ({ date, type, amount, txHash }: any) => (
    <>
        <Item>{date}</Item>
        <Item>{type}</Item>
        <Item>{amount.concat(' SUSHI')}</Item>
        <Item>
            <ExternalLink className="" href={`https://etherscan.io/tx/${txHash}`}>
                <p className="hidden md:block relative -top-6 whitespace-nowrap text-cyan-blue hover:underline">
                    View On Etherscan
                </p>
                <div className="flex items-center flex-nowrap md:hidden relative -top-4 whitespace-nowrap text-cyan-blue">
                    <p className="mr-1">Etherscan</p>
                    <img src={ArrowIcon} alt="arrow" />
                </div>
            </ExternalLink>
        </Item>
    </>
)

export default function TransactionsPanel({}) {
    const [pageIndex, setPageIndex] = useState<number>(0)

    const handleSortByAmount = () => {
        // TODO
    }

    const handleSortByDate = () => {
        // TODO
    }

    return (
        <div
            style={{ height: '33rem', minHeight: '33rem' }}
            className="flex flex-1 max-w-screen-md flex-col mt-11 md:mt-16"
        >
            <div className="flex flex-1 flex-col border-2 border-dark-900 rounded">
                <div className="flex flex-1 bg-dark-900 rounded-t p-2 md:p-8 pt-6 pb-0">
                    <div className="relative w-full md:mt-2">
                        <div
                            className="grid justify-between w-full absolute -top-16 md:-top-24"
                            style={{ gridTemplateColumns: 'auto auto auto auto' }}
                        >
                            <ColumnHeader>
                                <div className="flex flex-nowrap h-8 cursor-pointer" onClick={handleSortByDate}>
                                    <p>Date</p>
                                    <img className="h-4 mt-1.5 ml-2" src={SortIcon} alt="sort" />
                                </div>
                            </ColumnHeader>
                            <ColumnHeader className="hidden lg:block">
                                <p>Transfer Type</p>
                            </ColumnHeader>
                            <ColumnHeader className="block lg:hidden">
                                <p>Type</p>
                            </ColumnHeader>
                            <ColumnHeader>
                                <div className="flex flex-nowrap h-8 cursor-pointer" onClick={handleSortByAmount}>
                                    <p>Amount</p>
                                    <img className="h-4 mt-1.5 ml-2" src={SortIcon} alt="sort" />
                                </div>
                            </ColumnHeader>
                            <ColumnHeader />
                            {mock.txs
                                .slice(pageIndex * TXS_PER_PAGE, (pageIndex + 1) * TXS_PER_PAGE)
                                .map((txInfo, i) => (
                                    <Transaction
                                        key={i}
                                        date={txInfo.date}
                                        type={txInfo.type}
                                        amount={txInfo.amount}
                                        txHash={txInfo.txHash}
                                    />
                                ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-center w-full h-10 px-2 text-secondary">
                    {Array(Math.floor(mock.txs.length / (TXS_PER_PAGE + 1)) + 1)
                        .fill(null)
                        .map((v, i) => (
                            <div
                                key={i}
                                className={`flex mr-3 px-1 cursor-pointer ${
                                    pageIndex === i ? 'text-high-emphesis' : 'text-secondary'
                                }`}
                                onClick={() => setPageIndex(i)}
                            >
                                {(i + 1).toString()}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}
