// A wrapper for <Route> that redirects to the Connect Wallet
// screen if you're not yet authenticated.
import { useActiveWeb3React } from '../hooks/useActiveWeb3React'
import { Redirect, Route, RouteComponentProps, RouteProps, useLocation } from 'react-router-dom'
import React, { FC } from 'react'

const PublicRoute: FC<RouteProps> = ({ component: Component, children, ...rest }) => {
    const { account } = useActiveWeb3React()
    const location = useLocation<any>()
    return (
        <Route
            {...rest}
            render={(props: RouteComponentProps) =>
                account ? (
                    <Redirect
                        to={{
                            pathname: location.state ? location.state.from.pathname : '/'
                        }}
                    />
                ) : Component ? (
                    <Component {...props} />
                ) : (
                    children
                )
            }
        />
    )
}

export default PublicRoute
