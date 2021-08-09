import { ChipColor } from '../../../../components/Chip'

export enum ActionType {
  SEARCH = 'SEARCH',
  SET_SORT_TYPE = 'SET_SORT_TYPE',
  ADD_POOL_TYPE_FILTER = 'ADD_POOL_TYPE_FILTER',
  ADD_FEE_TIER_FILTER = 'ADD_FEE_TIER_FILTER',
  DELETE_POOL_TYPE_FILTER = 'DELETE_POOL_TYPE_FILTER',
  DELETE_FEE_TIER_FILTER = 'DELETE_FEE_TIER_FILTER',
}

export interface Reducer {
  type: ActionType
  payload: any
}

export interface State {
  sortType: number
  searchQuery: string
  filters: {
    poolTypes: {
      label: string
      color: ChipColor
      description: string
    }[]
    feeTiers: {
      label: string
      color: ChipColor
    }[]
  }
}

export enum PoolType {
  CLASSIC = 'CLASSIC',
  HYBRID = 'HYBRID',
  CONCENTRATED = 'CONCENTRATED',
  WEIGHTED = 'WEIGHTED',
}
