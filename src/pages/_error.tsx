// @ts-ignore TYPE NEEDS FIXING
function Error({ statusCode }) {
  return <p>{statusCode ? `An error ${statusCode} occurred on server` : 'An error occurred on client'}</p>
}

// @ts-ignore TYPE NEEDS FIXING
Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
