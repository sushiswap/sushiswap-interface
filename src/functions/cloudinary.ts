const normalize = (src) => {
  return src[0] === '/' ? src.slice(1) : src
}

export const cloudinaryLoader = ({ src, width }) => {
  return `https://res.cloudinary.com/dnz2bkszg/image/fetch/f_auto,w_${width}/${normalize(src)}`
}
