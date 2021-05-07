import React, { useContext } from "react"
import TokenLogo from "./TokenLogo"
import NewLogo from 'assets/svg/new-logo.svg'
import styled, { ThemeContext } from "styled-components"

export const Wrapper = styled.div`
    position: relative;
    cursor: pointer;
    width: 180px;
    margin-left: 20px;
`

export default function OnsenCategory({ name, tokenAddress, count, isActive, isNew }: any) {
    const theme = useContext(ThemeContext)
    
    const inactiveStyle = "bg-dark-900 rounded flex items-center py-2 border border-transparent"
    const activeStyle = inactiveStyle + " border-gradient"
    const visibility = isNew ? " visible" : " invisible"
    
    return (
        <Wrapper>
            <img className={"absolute -top-5 -left-4 z-1" + visibility} src={NewLogo} />
            <div className={isActive ? activeStyle : inactiveStyle}>
                <TokenLogo className="mx-3" address={tokenAddress} size='44px'/>

                <div className="=pr-6 text-left">
                    <div className="inline text-caption text-high-emphesis">{name}</div>
                    <div className="inline bg-cyan-blue bg-opacity-50 rounded ml-1 text-caption2 h-max w-max px-2 text-high-emphesis">{count}</div>
                </div>
            </div>
        </Wrapper>
    )
}