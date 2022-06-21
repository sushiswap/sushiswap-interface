import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

// @ts-ignore TYPE NEEDS FIXING
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  throw new Error('API throw error test')
}

export default withSentry(handler)
