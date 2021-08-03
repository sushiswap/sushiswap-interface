export enum ActionType {
  SEARCH = 'SEARCH',
  SET_SORT_TYPE = 'SET_SORT_TYPE',
}

export interface Reducer {
  type: ActionType
  payload: any
}

export interface State {
  sortType: number
  searchQuery: string
}
