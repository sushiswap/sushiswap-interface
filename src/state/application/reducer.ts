import { createReducer, nanoid } from '@reduxjs/toolkit'

import {
  addPopup,
  ApplicationModal,
  PopupContent,
  removePopup,
  setChainConnectivityWarning,
  setImplements3085,
  setKashiApprovalPending,
  setOpenModal,
  updateBlockNumber,
  updateBlockTimestamp,
  updateChainId,
} from './actions'

type PopupList = Array<{
  key: string
  show: boolean
  content: PopupContent
  removeAfterMs: number | null
}>

export interface ApplicationState {
  readonly blockNumber: { readonly [chainId: number]: number }
  readonly blockTimestamp: { readonly [chainId: number]: number }
  readonly chainConnectivityWarning: boolean
  readonly chainId: number | null
  readonly implements3085: boolean
  readonly popupList: PopupList
  readonly openModal: ApplicationModal | null
  readonly kashiApprovalPending: string
}

const initialState: ApplicationState = {
  blockNumber: {},
  blockTimestamp: {},
  chainConnectivityWarning: false,
  chainId: null,
  implements3085: false,
  popupList: [],
  openModal: null,
  kashiApprovalPending: '',
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateBlockNumber, (state, action) => {
      const { chainId, blockNumber } = action.payload
      if (typeof state.blockNumber[chainId] !== 'number') {
        state.blockNumber[chainId] = blockNumber
      } else {
        state.blockNumber[chainId] = Math.max(blockNumber, state.blockNumber[chainId])
      }
    })
    .addCase(updateBlockTimestamp, (state, action) => {
      const { chainId, blockTimestamp } = action.payload
      if (typeof state.blockTimestamp[chainId] !== 'number') {
        state.blockTimestamp[chainId] = blockTimestamp
      } else {
        state.blockTimestamp[chainId] = Math.max(blockTimestamp, state.blockTimestamp[chainId])
      }
    })
    .addCase(updateChainId, (state, action) => {
      const { chainId } = action.payload
      state.chainId = chainId
    })
    .addCase(setChainConnectivityWarning, (state, action) => {
      const { chainConnectivityWarning } = action.payload
      state.chainConnectivityWarning = chainConnectivityWarning
    })
    .addCase(setImplements3085, (state, action) => {
      const { implements3085 } = action.payload
      state.implements3085 = implements3085
    })
    .addCase(setOpenModal, (state, action) => {
      state.openModal = action.payload
    })
    .addCase(addPopup, (state, { payload: { content, key, removeAfterMs = 15000 } }) => {
      state.popupList = (key ? state.popupList.filter((popup) => popup.key !== key) : state.popupList).concat([
        {
          key: key || nanoid(),
          show: true,
          content,
          removeAfterMs,
        },
      ])
    })
    .addCase(removePopup, (state, { payload: { key } }) => {
      state.popupList.forEach((p) => {
        if (p.key === key) {
          p.show = false
        }
      })
    })
    .addCase(setKashiApprovalPending, (state, action) => {
      state.kashiApprovalPending = action.payload
    })
)
