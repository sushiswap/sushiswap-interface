import { ImageLoader } from 'next/dist/client/image'

export const normalizeUrl = (src) => {
  return src[0] === '/' ? src.slice(1) : src
}

export const cloudinaryLoader: ImageLoader = ({ src, width = undefined, height = undefined }) => {
  return `https://res.cloudinary.com/sushi-cdn/image/fetch/${width ? `w_${width},` : ''}${
    height ? `h_${height},` : ''
  }f_auto,q_auto/${normalizeUrl(src)}`
}
