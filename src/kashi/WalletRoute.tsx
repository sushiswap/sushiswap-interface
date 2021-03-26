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
        render={({ location, props, match }: any) => {
          //console.log('render:', location, props, match)
          return account ? (
            Component ? (
              <Component {...props} {...rest} match={match} />
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
    </>
  )
}

export default WalletRoute
