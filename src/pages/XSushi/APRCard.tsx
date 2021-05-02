import React from 'react'
import styled from 'styled-components'
import MoreInfoSymbol from '../../assets/images/more-info.svg'
import { ButtonPrimaryNormal } from '../../components/ButtonLegacy'
import { Text } from 'rebass'
import { Link } from 'react-router-dom'
import { darken } from 'polished'

const Card = styled.div`
    background: rgba(255, 209, 102, 0.36);
`

const ButtonSelect = styled.button`
    align-items: center;
    background-color: #ffd166;
    border-radius: ${({ theme }) => theme.borderRadius};
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
    outline: none;
    cursor: pointer;
    user-select: none;
    border: none;
    &:focus {
        box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, '#FFD166')};
        background-color: ${({ theme }) => darken(0.05, '#FFD166')};
    }
    &:hover {
        background-color: ${({ theme }) => darken(0.05, '#FFD166')};
    }
    &:disabled {
        opacity: 50%;
        cursor: auto;
    }
`

export default function APRCard({ apr, numSushi }: any) {
    return (
        <Card className="flex w-full justify-between items-center max-w-xl h-24 p-4 md:pl-5 md:pr-7 rounded">
            <div className="flex flex-col">
                <div className="flex flex-nowrap justify-center items-center mb-4 md:mb-2">
                    <p className="whitespace-nowrap text-caption2 md:text-lg md:leading-5 font-bold text-high-emphesis">
                        Staking APR{' '}
                    </p>
                    <img className="ml-3" src={MoreInfoSymbol} alt={'more info'} />
                </div>
                <div className="flex">
                    <ButtonSelect className="text-xs md:text-sm font-medium md:font-bold text-dark-900 py-1 px-4 md:py-1.5 md:px-7">
                        Learn More
                    </ButtonSelect>
                </div>
            </div>
            <div className="flex flex-col">
                <p className="text-right text-high-emphesis font-bold text-lg md:text-h4 mb-1 md:mb-0">
                    {`${apr.toFixed(1)}%`}
                </p>
                <p className="text-right text-primary w-32 md:w-64 text-caption2 md:text-base">
                    {`${numSushi.toFixed(1)} SUSHI per $1,000 per day`}
                </p>
            </div>
        </Card>
    )
}
