import { withSentry } from '@sentry/nextjs'
import getAnalyticsPairs from 'app/features/analytics/pools/getAnalyticsPairs'
import type { NextApiRequest, NextApiResponse } from 'next'

// @ts-ignore TYPE NEEDS FIXING
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const chainId = Number(req.query.chainId)
  const pairs = await getAnalyticsPairs({ chainId })
  res.status(200).json(pairs)
}

export default withSentry(handler)
