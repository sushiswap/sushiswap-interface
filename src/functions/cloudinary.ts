const normalize = (src) => {
  return src[0] === "/" ? src.slice(1) : src;
};

export const cloudinaryLoader = ({ src }) => {
  return `https://res.cloudinary.com/dnz2bkszg/image/fetch/f_auto/${normalize(
    src
  )}`;
};
