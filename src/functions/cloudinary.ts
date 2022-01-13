import { ImageLoaderProps } from 'next/image'

export const normalizeUrl = (src) => {
  return src[0] === '/' ? src.slice(1) : src
}

interface CloudinaryLoader extends Omit<ImageLoaderProps, 'width' | 'height'> {
  src: string
  width?: string
  height?: string
}

type CloudinaryLoaderType = (T: CloudinaryLoader) => string

export const cloudinaryLoader: CloudinaryLoaderType = ({ src, width, height }) => {
  return `https://res.cloudinary.com/sushi-cdn/image/fetch/${width ? `w_${width},` : ''}${
    height ? `h_${height},` : ''
  }f_auto,q_auto/${normalizeUrl(src)}`
}

export default cloudinaryLoader
