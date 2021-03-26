import React from 'react'
import { Route, Redirect, useLocation } from 'react-router-dom'
import { useActiveWeb3React } from 'hooks'

// A wrapper for <Route> that redirects to the Connect Wallet
// screen if you're not yet authenticated.
export const PublicRoute = ({ component: Component, children, ...rest }: any) => {
  const { account } = useActiveWeb3React()
  const location = useLocation()
  return (
    <>
      <Route
        {...rest}
        render={({ props }: any) =>
          account ? (
            <Redirect
              to={{
                // todo: fix unknown state
                //@ts-ignore
                pathname: location.state ? location.state.from.pathname : '/'
              }}
            />
          ) : Component ? (
            <Component {...props} {...rest} />
          ) : (
            children
          )
        }
      />
    </>
  )
}

export default PublicRoute
