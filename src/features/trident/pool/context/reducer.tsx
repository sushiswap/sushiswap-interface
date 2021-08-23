import React from 'react'
import { Reducer, State } from './types'

const reducer: React.Reducer<State, Reducer> = (state: any, action: any) => {
  switch (action.type) {
    default:
      return state
  }
}

export default reducer
