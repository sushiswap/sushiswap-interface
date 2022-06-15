export declare type NestedField = {
  operation: string
  variables: QueryBuilderOptions[]
  fields: Fields
}

export declare type Fields = Array<string | object | NestedField>

export declare type VariableOptions =
  | {
      type?: string
      name?: string
      value: any
      list?: boolean
      required?: boolean
    }
  | {
      [k: string]: any
    }

export interface QueryBuilderOptions {
  operation?: string
  fields?: Fields
  variables?: VariableOptions
}

export declare type MetaDataQuery = {
  [k: string]: any
} & QueryBuilderOptions

export declare type BaseRecord = {
  id?: string
  [key: string]: any
}

export interface Pagination {
  current?: number
  pageSize?: number
}
export interface Search {
  field?: string
  value?: string
}
export declare type CrudOperators =
  | 'eq'
  | 'ne'
  | 'lt'
  | 'gt'
  | 'lte'
  | 'gte'
  | 'in'
  | 'nin'
  | 'contains'
  | 'ncontains'
  | 'containss'
  | 'ncontainss'
  | 'null'
export declare type CrudFilter = {
  field: string
  operator: CrudOperators
  value: any
}
export declare type CrudSort = {
  field: string
  order: 'asc' | 'desc'
}
export declare type CrudFilters = CrudFilter[]
export declare type CrudSorting = CrudSort[]
export interface CustomResponse<TData = BaseRecord> {
  data: TData
}
export interface GetListResponse<TData = BaseRecord> {
  data: TData[]
  total: number
}
export interface CreateResponse<TData = BaseRecord> {
  data: TData
}
export interface CreateManyResponse<TData = BaseRecord> {
  data: TData[]
}
export interface UpdateResponse<TData = BaseRecord> {
  data: TData
}
export interface UpdateManyResponse<TData = BaseRecord> {
  data: TData[]
}
export interface GetOneResponse<TData = BaseRecord> {
  data: TData
}
export interface GetManyResponse<TData = BaseRecord> {
  data: TData[]
}
export interface DeleteOneResponse<TData = BaseRecord> {
  data: TData
}
export interface DeleteManyResponse<TData = BaseRecord> {
  data: TData[]
}
export interface IDataContext {
  getList: <TData extends BaseRecord = BaseRecord>(params: {
    resource: string
    pagination?: Pagination
    sort?: CrudSorting
    filters?: CrudFilters
    metaData?: MetaDataQuery
  }) => Promise<GetListResponse<TData>>
  getMany: <TData extends BaseRecord = BaseRecord>(params: {
    resource: string
    ids: string[]
    metaData?: MetaDataQuery
  }) => Promise<GetManyResponse<TData>>
  getOne: <TData extends BaseRecord = BaseRecord>(params: {
    resource: string
    id: string
    metaData?: MetaDataQuery
  }) => Promise<GetOneResponse<TData>>
  create: <TData extends BaseRecord = BaseRecord, TVariables = {}>(params: {
    resource: string
    variables: TVariables
    metaData?: MetaDataQuery
  }) => Promise<CreateResponse<TData>>
  createMany: <TData extends BaseRecord = BaseRecord, TVariables = {}>(params: {
    resource: string
    variables: TVariables[]
    metaData?: MetaDataQuery
  }) => Promise<CreateManyResponse<TData>>
  update: <TData extends BaseRecord = BaseRecord, TVariables = {}>(params: {
    resource: string
    id: string
    variables: TVariables
    metaData?: MetaDataQuery
  }) => Promise<UpdateResponse<TData>>
  updateMany: <TData extends BaseRecord = BaseRecord, TVariables = {}>(params: {
    resource: string
    ids: string[]
    variables: TVariables
    metaData?: MetaDataQuery
  }) => Promise<UpdateManyResponse<TData>>
  deleteOne: <TData extends BaseRecord = BaseRecord>(params: {
    resource: string
    id: string
    metaData?: MetaDataQuery
  }) => Promise<DeleteOneResponse<TData>>
  deleteMany: <TData extends BaseRecord = BaseRecord>(params: {
    resource: string
    ids: string[]
    metaData?: MetaDataQuery
  }) => Promise<DeleteManyResponse<TData>>
  getApiUrl: () => string
  custom: <TData extends BaseRecord = BaseRecord>(params: {
    url: string
    method: 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch'
    sort?: CrudSorting
    filters?: CrudFilter[]
    payload?: {}
    query?: {}
    headers?: {}
    metaData?: MetaDataQuery
  }) => Promise<CustomResponse<TData>>
}
export interface DataService {
  getList: <TData extends BaseRecord = BaseRecord>(params: {
    resource: string
    pagination?: Pagination
    sort?: CrudSorting
    filters?: CrudFilters
    metaData?: MetaDataQuery
  }) => Promise<GetListResponse<TData>>
  getMany: <TData extends BaseRecord = BaseRecord>(params: {
    resource: string
    ids: string[]
    metaData?: MetaDataQuery
  }) => Promise<GetManyResponse<TData>>
  getOne: <TData extends BaseRecord = BaseRecord>(params: {
    resource: string
    id: string
    metaData?: MetaDataQuery
  }) => Promise<GetOneResponse<TData>>
  create: <TData extends BaseRecord = BaseRecord, TVariables = {}>(params: {
    resource: string
    variables: TVariables
    metaData?: MetaDataQuery
  }) => Promise<CreateResponse<TData>>
  createMany: <TData extends BaseRecord = BaseRecord, TVariables = {}>(params: {
    resource: string
    variables: TVariables[]
    metaData?: MetaDataQuery
  }) => Promise<CreateManyResponse<TData>>
  update: <TData extends BaseRecord = BaseRecord, TVariables = {}>(params: {
    resource: string
    id: string
    variables: TVariables
    metaData?: MetaDataQuery
  }) => Promise<UpdateResponse<TData>>
  updateMany: <TData extends BaseRecord = BaseRecord, TVariables = {}>(params: {
    resource: string
    ids: string[]
    variables: TVariables
    metaData?: MetaDataQuery
  }) => Promise<UpdateManyResponse<TData>>
  deleteOne: <TData extends BaseRecord = BaseRecord>(params: {
    resource: string
    id: string
    metaData?: MetaDataQuery
  }) => Promise<DeleteOneResponse<TData>>
  deleteMany: <TData extends BaseRecord = BaseRecord>(params: {
    resource: string
    ids: string[]
    metaData?: MetaDataQuery
  }) => Promise<DeleteManyResponse<TData>>
  getApiUrl: () => string
  custom?: <TData extends BaseRecord = BaseRecord>(params: {
    url: string
    method: 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch'
    sort?: CrudSorting
    filters?: CrudFilter[]
    payload?: {}
    query?: {}
    headers?: {}
    metaData?: MetaDataQuery
  }) => Promise<CustomResponse<TData>>
}
