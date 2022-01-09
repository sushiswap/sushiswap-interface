import { withSentry } from '@sentry/nextjs'

const handler = async (req, res) => {
  res.status(200).json([])
}

export default withSentry(handler)
