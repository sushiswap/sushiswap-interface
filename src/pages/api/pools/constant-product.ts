import { withSentry } from '@sentry/nextjs'

const handler = async (req, res) => {
  res.status(200).json({ name: 'John Doe' })
}

export default withSentry(handler)
