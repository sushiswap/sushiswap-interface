import { withSentry } from '@sentry/nextjs'
import getAnalyticsDashboard from 'app/features/analytics/dashboard/getAnalyticsDashboard'
import type { NextApiRequest, NextApiResponse } from 'next'

// @ts-ignore TYPE NEEDS FIXING
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const chainId = Number(req.query.chainId)
  const pairs = await getAnalyticsDashboard({ chainId })
  res.status(200).json(pairs)
}

export default withSentry(handler)
