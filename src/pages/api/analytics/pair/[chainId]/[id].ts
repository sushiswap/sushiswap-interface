import { withSentry } from '@sentry/nextjs'
import getAnalyticsPair from 'app/features/analytics/pools/getAnalyticsPair'
import type { NextApiRequest, NextApiResponse } from 'next'

// @ts-ignore TYPE NEEDS FIXING
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const [chainId, id] = [Number(req.query.chainId), req.query.id as string]
  const pair = await getAnalyticsPair(chainId, id)
  res.status(200).json(pair)
}

export default withSentry(handler)
