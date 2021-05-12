import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import AddLiquidity from './index'

// note: only for mainnet
export function RedirectPairToLiquidity({ location }: RouteComponentProps) {
    const paths = location.pathname.split('/')
    console.log('location:', location, paths, paths?.[1])
    // pair address in route

    if (!paths?.[1]) {
        return <Redirect to={'/add/'} />
    } else {
        try {
            //await sushiData.exchange.pair({ pair_address: String(paths?.[1]).toLowerCase() })
            return <Redirect to={'/add/'} />
        } catch (e) {
            return <Redirect to={'/add/'} />
        }
    }
}

export function RedirectToAddLiquidity() {
    return <Redirect to="/add/" />
}

const OLD_PATH_STRUCTURE = /^(0x[a-fA-F0-9]{40})-(0x[a-fA-F0-9]{40})$/
export function RedirectOldAddLiquidityPathStructure(props: RouteComponentProps<{ currencyIdA: string }>) {
    const {
        match: {
            params: { currencyIdA }
        }
    } = props
    const match = currencyIdA.match(OLD_PATH_STRUCTURE)
    if (match?.length) {
        return <Redirect to={`/add/${match[1]}/${match[2]}`} />
    }

    return <AddLiquidity {...props} />
}

export function RedirectDuplicateTokenIds(props: RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>) {
    const {
        match: {
            params: { currencyIdA, currencyIdB }
        }
    } = props
    if (currencyIdA.toLowerCase() === currencyIdB.toLowerCase()) {
        return <Redirect to={`/add/${currencyIdA}`} />
    }
    return <AddLiquidity {...props} />
}
