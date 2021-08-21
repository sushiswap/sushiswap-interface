import NextImage from 'next/image'
import { cloudinaryLoader } from '../../functions/cloudinary'

// Cloudflare Loader
const normalize = (src) => {
  return src[0] === '/' ? src.slice(1) : src
}

const cloudFlareLoader = ({ src, width, quality }) => {
  const params = [`width=${width}`]
  if (quality) {
    params.push(`quality=${quality}`)
  }
  const paramsString = params.join(',')
  return `/cdn-cgi/image/${paramsString}/${normalize(src)}`
}

const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str) => (typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str))

const Image = ({
  src,
  width = undefined,
  height = undefined,
  layout = undefined,
  loader = undefined,
  style,
  ...rest
}) => {
  const useBlur = parseInt(String(height), 10) >= 40 && parseInt(String(width), 10) >= 40
  return (
    <div style={{ width, height }} className="overflow-hidden rounded">
      {useBlur ? (
        <NextImage
          loader={loader}
          src={src}
          width={width}
          height={height}
          layout={layout}
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`}
          {...rest}
        />
      ) : (
        <NextImage
          loader={loader}
          src={src}
          width={width}
          height={height}
          layout={layout}
          placeholder="empty"
          {...rest}
        />
      )}
    </div>
  )
}

export default Image
