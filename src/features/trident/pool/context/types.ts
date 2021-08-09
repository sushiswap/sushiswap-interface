export enum ActionType {}

export interface Reducer {
  type: ActionType
  payload: any
}

export interface State {}

export enum PoolType {
  CLASSIC = 'CLASSIC',
  HYBRID = 'HYBRID',
  CONCENTRATED = 'CONCENTRATED',
  WEIGHTED = 'WEIGHTED',
}
