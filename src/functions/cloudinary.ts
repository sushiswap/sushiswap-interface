import { ImageLoader } from 'next/dist/client/image'

export const normalizeUrl = (src) => {
  return src[0] === '/' ? src.slice(1) : src
}

export const cloudinaryLoader: ImageLoader = ({ src, width }) => {
  return `https://res.cloudinary.com/sushi-cdn/image/fetch/f_auto,w_${width}/${normalizeUrl(src)}`
}
