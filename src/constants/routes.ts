import { POOL_TYPES } from '../features/trident/constants'

export const POOLS_ROUTE = { label: 'Pools', slug: '/trident/pool' }
export const POOL_ROUTE = (label: string, id: number) => ({ label, slug: `/trident/pool/${id}` })
export const POOL_TYPES_ROUTE = { label: 'Pool Types', slug: '/trident/pool/types' }
export const POOL_TYPE_ROUTE = (id: number) => ({ label: POOL_TYPES[id].label, slug: `/trident/pool/types/${id}` })
export const ADD_LIQUIDITY_ROUTE = { label: 'Add Liquidity', slug: '/trident/pool/1/add' }
