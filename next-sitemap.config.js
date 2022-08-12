/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.SITE_URL || 'https://app.sushi.com',
  generateRobotsTxt: true, // (optional)
  // ...other options
}

export default config