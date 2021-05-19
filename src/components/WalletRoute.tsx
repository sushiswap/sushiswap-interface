// A wrapper for <Route> that redirects to the Connect Wallet
// screen if you're not yet authenticated.
import { useActiveWeb3React } from '../hooks/useActiveWeb3React'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import React, { FC } from 'react'
import { RouteComponentProps } from 'react-router'

const WalletRoute: FC<RouteProps> = ({ component: Component, children, ...rest }) => {
    const { account } = useActiveWeb3React()
    return (
        <Route
            {...rest}
            render={({ location, match, ...props }: RouteComponentProps) => {
                return account ? (
                    Component ? (
                        <Component {...props} {...rest} match={match} location={location} />
                    ) : (
                        children
                    )
                ) : (
                    <Redirect
                        to={{
                            pathname: '/connect',
                            state: { from: location }
                        }}
                    />
                )
            }}
        />
    )
}

export default WalletRoute
