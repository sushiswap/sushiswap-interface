import * as Sentry from '@sentry/nextjs'
import NextErrorComponent from 'next/error'
import Head from 'next/head'

// @ts-ignore
const MyError = ({ statusCode, hasGetInitialPropsRun, err, title }) => {
  if (!hasGetInitialPropsRun && err) {
    // getInitialProps is not called in case of
    // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
    // err via _app.js so it can be captured
    Sentry.captureException(err)
    // Flushing is not required in this case as it only happens on the client
  }

  return (
    <div className="flex items-center justify-center w-full h-full ">
      <Head>
        <title>
          {statusCode ? `${statusCode}: ${title}` : 'Application error: a client-side exception has occurred'}
        </title>
      </Head>
      <div className="flex items-center justify-center h-full">
        {statusCode ? <h1>{statusCode}</h1> : null}
        <div>
          <h2>
            {title || statusCode ? (
              title
            ) : (
              <>
                Application error: a client-side exception has occurred (see the browser console for more information)
              </>
            )}
            .
          </h2>
        </div>
      </div>
    </div>
  )
}

// @ts-ignore
MyError.getInitialProps = async ({ res, err }) => {
  // @ts-expect-error
  const errorInitialProps = await NextErrorComponent.getInitialProps({
    res,
    err,
  })

  // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
  // getInitialProps has run
  // @ts-expect-error
  errorInitialProps.hasGetInitialPropsRun = true

  // Running on the server, the response object (`res`) is available.
  //
  // Next.js will pass an err on the server if a page's data fetching methods
  // threw or returned a Promise that rejected
  //
  // Running on the client (browser), Next.js will provide an err if:
  //
  //  - a page's `getInitialProps` threw or returned a Promise that rejected
  //  - an exception was thrown somewhere in the React lifecycle (render,
  //    componentDidMount, etc) that was caught by Next.js's React Error
  //    Boundary. Read more about what types of exceptions are caught by Error
  //    Boundaries: https://reactjs.org/docs/error-boundaries.html

  if (err) {
    Sentry.captureException(err)

    // Flushing before returning is necessary if deploying to Vercel, see
    // https://vercel.com/docs/platform/limits#streaming-responses
    await Sentry.flush(2000)

    return errorInitialProps
  }

  // If this point is reached, getInitialProps was called without any
  // information about what the error might be. This can be caused by
  // a falsy value being thrown e.g. throw undefined
  return errorInitialProps
}

export default MyError
