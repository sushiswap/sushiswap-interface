/*eslint sort-imports: ["error", { "ignoreMemberSort": true }]*/
/**
* @file TitleAndMetaTags
* @summary Meta tags and SEO configuration 
* @const path
* @returns url/destination
* @note destination is defined as the URL rewrite page, see `next.config.js`
*/
import Head from 'next/head';
import React from 'react';
import { useRouter } from 'next/router';

type TitleAndMetaTagsProps = {
  url?: string;
  pathname?: string;
  title?: string;
  description?: string;
  destination?: string;
};

export function TitleAndMetaTags({
  url = 'https://sushi.com',
  pathname,
  title = 'Sushi',
  description = 'Sushiswap Description',
  destination,
}: TitleAndMetaTagsProps) {
  const router = useRouter();

  const image = destination ? `${url}/${destination}` : `${url}/social.png`;
  const path = pathname || router.pathname;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width" />
      <link
        rel="icon"
        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍣</text></svg>"
      />

      <meta property="og:url" content={`${url}${path}`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta name="twitter:site" content="@sushiswap" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}
