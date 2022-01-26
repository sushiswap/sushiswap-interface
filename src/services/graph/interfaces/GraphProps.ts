import { ChainId } from '@sushiswap/core-sdk'
import { DocumentNode, ExecutionResult } from 'graphql'
import { Observer } from 'subscriptions-transport-ws'
import { SWRConfiguration } from 'swr'

export interface GraphProps {
  chainId?: ChainId
  variables?: { [key: string]: any }
  shouldFetch?: boolean
  swrConfig?: SWRConfiguration
}

export interface GraphSubscriptionProps<T> {
  chainId?: ChainId
  variables?: { [key: string]: any }
  shouldFetch?: boolean
  observer: Observer<ExecutionResult<T>>
  query?: DocumentNode
}
