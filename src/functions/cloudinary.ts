const normalize = (src) => {
  return src[0] === '/' ? src.slice(1) : src
}

export const cloudinaryLoader = ({ src, width }) => {
  return `https://res.cloudinary.com/sushi-cdn/image/fetch/w_${width}/${normalize(src)}`
}
