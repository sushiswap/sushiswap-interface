import React from 'react'
import styled from 'styled-components'
import XSushiSignSmall from '../../assets/images/xsushi-sign-small.png'

const StyledLink = styled.a`
    text-decoration: none;
    cursor: pointer;
    font-weight: bold;

    :hover {
        text-decoration: underline;
    }

    :focus {
        outline: none;
        text-decoration: underline;
    }

    :active {
        text-decoration: none;
    }
`

export default function InfoCard() {
    return (
        <div className="flex flex-col max-w-xl w-full mb-2 mt-auto">
            <div className="flex max-w-lg">
                <div className="text-body font-bold md:text-h5 text-high-emphesis self-end mb-3 md:mb-7">
                    Maximize yield by staking for xSUSHI
                </div>
                <div className="pl-6 pr-3 mb-1 min-w-max self-start md:hidden">
                    <img src={XSushiSignSmall} alt="xsushi sign" width="74px" />
                </div>
            </div>
            <div className="text-primary text-xs leading-5 md:text-caption max-w-lg mb-2 md:mb-4 pr-3 md:pr-0">
                For every swap on Sushi, 0.05% of the swap fee is locked into the liquidity pool awaiting to be served
                to xSUSHI holders. Anyone can serve it up to reward the swap fees to xSUSHI stakeholders.
            </div>
            <div className="flex">
                <div className="mr-14 md:mr-9">
                    <StyledLink className="text-body whitespace-nowrap text-caption2 md:text-lg md:leading-5">
                        Enter the Kitchen
                    </StyledLink>
                </div>
                <div>
                    <StyledLink className="text-body whitespace-nowrap text-caption2 md:text-lg md:leading-5">
                        Tips for using xSUSHI
                    </StyledLink>
                </div>
            </div>
        </div>
    )
}
