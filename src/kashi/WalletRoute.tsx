import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useActiveWeb3React } from 'hooks'

// A wrapper for <Route> that redirects to the Connect Wallet
// screen if you're not yet authenticated.
export const WalletRoute = ({ component: Component, children, ...rest }: any) => {
  const { account } = useActiveWeb3React()
  return (
    <>
      <Route
        {...rest}
        render={({ location, props }: any) =>
          account ? (
            Component ? (
              <Component {...props} {...rest} />
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
        }
      />
    </>
  )
}

export default WalletRoute
