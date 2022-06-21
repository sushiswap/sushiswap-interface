import { withSentry } from '@sentry/nextjs'
import getAnalyticsXsushi from 'app/features/analytics/xsushi/getAnalyticsXsushi'
import type { NextApiRequest, NextApiResponse } from 'next'

// @ts-ignore TYPE NEEDS FIXING
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const xsushi = await getAnalyticsXsushi()
  res.status(200).json(xsushi)
}

export default withSentry(handler)
