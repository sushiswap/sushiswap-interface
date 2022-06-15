import * as Sentry from '@sentry/nextjs'
import { request, RequestDocument } from 'graphql-request'

const MAX_FIRST = 1000
const MAX_SKIP = 5000

export async function pager(endpoint: string, query: RequestDocument, variables: any = {}) {
  if (endpoint.includes('undefined')) return {}

  let data: any = {}

  // Can use id pagination, which should be faster
  // Id pagination breaks orderBy and doesn't work for multiple entities in one query
  // We can emulate orderBy by sorting manually though, if we're fetching the whole thing anyway
  if ((!variables.first || !variables.orderBy) && (query as any).definitions[0].selectionSet.selections.length === 1) {
    const [orderBy, orderDirection] = [variables.orderBy, variables.orderDirection ?? 'desc']

    variables = { ...variables, orderBy: 'id', orderDirection: 'asc' }

    let lastId = undefined
    let key

    while (true) {
      const req = await request(endpoint, query, variables)

      // Won't fail, but will only fetch first entity
      key = Object.keys(req)[0]
      data[key] = [...(data[key] || []), ...req[key]]

      if (req[key].length !== MAX_FIRST) break
      if (Object.keys(variables).includes('first') && variables['first'] !== undefined) break

      lastId = req[key][MAX_FIRST - 1].id
      variables = { ...variables, where: { ...(variables.where || {}), id_gt: lastId } }
    }

    if (orderBy && data[key] && data[key][0][orderBy]) {
      if (orderDirection === 'desc') data[key] = data[key].sort((a: any, b: any) => a[orderBy] - b[orderBy])
      if (orderDirection === 'asc') data[key] = data[key].sort((a: any, b: any) => b[orderBy] - a[orderBy])
    }

    // Use the simpler and more flexible skip pagination, only works upto 6000 entities though
  } else {
    let skip = 0
    let flag = true

    while (flag) {
      flag = false
      const req = await request(endpoint, query, variables)

      Object.keys(req).forEach((key) => {
        data[key] = data[key] ? [...data[key], ...req[key]] : req[key]
      })

      Object.values(req).forEach((entry: any) => {
        if (entry.length === MAX_FIRST) flag = true
      })

      // @ts-ignore TYPE NEEDS FIXING
      if (Object.keys(variables).includes('first') && variables['first'] !== undefined) break

      if (skip === MAX_SKIP) {
        Sentry.captureException({ message: 'Pager: Max skip reached', endpoint, query: query.toString() })
        break
      }

      skip += MAX_FIRST
      variables = { ...variables, skip }
    }
  }

  return data
}
