import NextImage from 'next/image'

// Cloudflare Loader
const normalize = (src) => {
  return src[0] === '/' ? src.slice(1) : src
}

const loader = ({ src, width, quality }) => {
  const params = [`width=${width}`]
  if (quality) {
    params.push(`quality=${quality}`)
  }
  const paramsString = params.join(',')
  return `/cdn-cgi/image/${paramsString}/${normalize(src)}`
}

const Image = (props) => {
  return <NextImage loader={loader} {...props} />
}

export default Image
