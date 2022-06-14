import { withSentry } from '@sentry/nextjs'
import getAnalyticsBentobox from 'app/features/analytics/bentobox/getAnalyticsBentobox'
import type { NextApiRequest, NextApiResponse } from 'next'

// @ts-ignore TYPE NEEDS FIXING
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const chainId = Number(req.query.chainId)
  const bentoBox = await getAnalyticsBentobox({ chainId })
  res.status(200).json(bentoBox)
}

export default withSentry(handler)
