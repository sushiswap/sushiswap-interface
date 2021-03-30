import React from 'react'
import { Route, Redirect, useLocation, RouteComponentProps } from 'react-router-dom'
import { useActiveWeb3React } from 'hooks'

// A wrapper for <Route> that redirects to the Connect Wallet
// screen if you're not yet authenticated.
export const PublicRoute = ({ component: Component, children, ...rest }: any) => {
  const { account } = useActiveWeb3React()
  const location = useLocation<any>()
  return (
    <>
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
    </>
  )
}

export default PublicRoute
