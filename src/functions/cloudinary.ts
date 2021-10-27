const normalize = (src) => {
  return src[0] === '/' ? src.slice(1) : src
}

export const cloudinaryLoader = ({ src, width, style }) => {
  return `https://res.cloudinary.com/sushi-cdn/image/fetch/f_auto,w_${width}/${normalize(src)}`
}
