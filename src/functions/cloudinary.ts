const normalize = (src) => {
  return src[0] === '/' ? src.slice(1) : src
}

export const cloudinaryLoader = ({ src }) => {
  return `https://res.cloudinary.com/sushi-cdn/image/fetch/${normalize(src)}`
}
