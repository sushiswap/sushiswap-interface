import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChainId } from '@sushiswap/core-sdk'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { AppState } from 'app/state'

export interface Web3ReactContext {
  chainId?: ChainId
  account?: Web3ReactContextInterface['account']
}

const initialState: Web3ReactContext = {}

export const web3ContextSlice = createSlice({
  name: 'web3Context',
  initialState,
  reducers: {
    updateWeb3Context: (state, action: PayloadAction<Web3ReactContext>) => {
      return action.payload
    },
  },
})

export const { updateWeb3Context } = web3ContextSlice.actions

export const selectWeb3Context = (state: AppState) => state.web3Context

export default web3ContextSlice.reducer
