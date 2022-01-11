import { withSentry } from '@sentry/nextjs'

const handler = async (req, res) => {
  res.status(200).json([{ id: 1 }, { id: 2 }])
}

export default withSentry(handler)
