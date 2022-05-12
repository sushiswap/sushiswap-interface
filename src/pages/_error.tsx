import React from 'react';
import dynamic from 'next/dynamic';
import {
  default as NextApp,
  AppContext,
  AppProps,
  AppInitialProps
} from 'next/app';
import { NextComponentType, NextPageContext, NextPage } from 'next';

// FIXME It looks like typings for next/error are wrong
const ErrorPage = dynamic(() => import('next/error')) as NextComponentType<
  NextPageContext,
  {},
  {}
>;

export interface PageErrorInitialProps<T = Record<string, any>> {
  error?: {
    statusCode: number;
  } & T;
}

export type ExcludeErrorProps<P> = Pick<
  P,
  Exclude<keyof P, keyof PageErrorInitialProps>
>;

/**
 * Small helper to generate errors object if needed
 */
export const generatePageError = function<T extends Record<string, any>>(
  statusCode: number,
  params?: T
): PageErrorInitialProps<T | {}> {
  return {
    error: {
      statusCode,
      ...(params || {})
    }
  };
};

/**
 * This higher-order component is used to render the Error page if a HTTP status
 * code >400 is thrown by one of the pages.
 *
 * To trigger it, just add statusCode to the object returned by getInitialProps
 *
 * This solution is based on Tim Neutkens's insights and inspired by Nuxt.js
 * https://spectrum.chat/next-js/general/error-handling-in-async-getinitialprops~99400c6c-0da8-4de5-aecd-2ecf122e8ad0
 * https://github.com/nuxt/nuxt.js/issues/895#issuecomment-308682972
 */
const withErrorHoC = function(CustomErrorComponent?: NextPage<any>) {
  const ErrorComponent: NextPage<any> = CustomErrorComponent ?? ErrorPage;

  // First function returned, the one allowing to pass the App component as a parameter
  return function<P extends PageErrorInitialProps>(
    AppComponent: typeof NextApp
  ) {
    // The actualy component working as a wrapper around _app
    return class WithError extends React.Component<
      P & PageErrorInitialProps & AppProps
    > {
      public static getInitialProps = async (appContext: AppContext) => {
        let appProps: AppInitialProps = {
          pageProps: {}
        };

        if (AppComponent.getInitialProps) {
          appProps = await AppComponent.getInitialProps(appContext);

          if (typeof appProps.pageProps === 'undefined') {
            console.error(
              'If you have a getInitialProps method in your custom _app.js file, you must explicitly return pageProps. For more information, see: https://github.com/zeit/next.js#custom-app'
            );
          }
        }

        const { res } = appContext.ctx;
        const { pageProps } = appProps;

        if ('error' in pageProps && res) {
          if (!('statusCode' in pageProps.error))
            throw new Error(
              'The error object should have a "statusCode" property'
            );

          if (typeof pageProps.error.statusCode !== 'number')
            throw new Error('The "statusCode" property should be a number.');

          // We are in an user-defined error, let's fetch the Error component
          // getInitialProps if needed, and merge them with the error object
          let errorInitialProps: Record<string, any> = {};

          if (ErrorComponent.getInitialProps) {
            errorInitialProps = await ErrorComponent.getInitialProps(
              appContext.ctx
            );

            appProps.pageProps = {
              ...errorInitialProps,
              ...appProps.pageProps
            };
          }

          res.statusCode = pageProps.error.statusCode;
        }

        return appProps;
      };

      render() {
        const { pageProps }: AppInitialProps = this.props;
        const { error } = pageProps;

        if (error && error.statusCode >= 400) {
          const { error, ...otherPageProps } = pageProps;

          const errorPageProps = {
            ...otherPageProps,
            ...error
          };

          return (
            <AppComponent
              {...this.props}
              Component={ErrorComponent}
              pageProps={errorPageProps}
            />
          );
        }

        return <AppComponent {...this.props} />;
      }
    };
  };
};

export default withErrorHoC;
