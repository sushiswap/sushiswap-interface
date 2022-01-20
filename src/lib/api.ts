export function getStrapiURL(path = '') {
  return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}/api${path}`
}

// Helper to make GET requests to Strapi
// @ts-ignore TYPE NEEDS FIXING
export async function fetchAPI(path) {
  const requestUrl = getStrapiURL(path)
  const response = await fetch(requestUrl)
  return await response.json()
}
