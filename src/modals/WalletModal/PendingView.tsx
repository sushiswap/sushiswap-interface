import { AbstractConnector } from '@web3-react/abstract-connector'
import Dots from 'app/components/Dots'
import { injected, SUPPORTED_WALLETS } from 'config/wallets'
import React from 'react'

import Option from './Option'

export default function PendingView({
  connector,
  error = false,
  setPendingError,
  tryActivation,
}: {
  connector?: AbstractConnector
  error?: boolean
  setPendingError: (error: boolean) => void
  tryActivation: (connector: AbstractConnector) => void
}) {
  const isMetamask = window?.ethereum?.isMetaMask

  return (
    <div>
      <div className="p-4 mb-5">
        <div>
          {error ? (
            <div>
              <div>Error connecting.</div>
              <div
                className="p-2 ml-4 text-xs font-semibold select-none hover:cursor-pointer"
                onClick={() => {
                  setPendingError(false)
                  connector && tryActivation(connector)
                }}
              >
                Try Again
              </div>
            </div>
          ) : (
            <Dots>Initializing</Dots>
          )}
        </div>
      </div>
      {Object.keys(SUPPORTED_WALLETS).map((key) => {
        const option = SUPPORTED_WALLETS[key]
        if (option.connector === connector) {
          if (option.connector === injected) {
            if (isMetamask && option.name !== 'MetaMask') {
              return null
            }
            if (!isMetamask && option.name === 'MetaMask') {
              return null
            }
          }
          return (
            <Option
              id={`connect-${key}`}
              key={key}
              clickable={false}
              color={option.color}
              header={option.name}
              subheader={option.description}
              icon={'/images/wallets/' + option.iconName}
            />
          )
        }
        return null
      })}
    </div>
  )
}
