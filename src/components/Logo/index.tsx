import { HelpCircle, IconProps } from "react-feather";
import React, { FC, useState } from "react";

import Image from "../Image";
import { ImageProps } from "next/image";
import { cloudinaryLoader } from "../../functions/cloudinary";

const BAD_SRCS: { [tokenAddress: string]: true } = {};

export type LogoProps = {
  srcs: string[];
  width: string | number;
  height: string | number;
  alt?: string;
} & IconProps;

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
const Logo: FC<LogoProps> = ({ srcs, ...rest }) => {
  const [, refresh] = useState<number>(0);
  const src = srcs.find((src) => !BAD_SRCS[src]);

  if (src) {
    return (
      <Image
        src={src}
        loader={cloudinaryLoader}
        onError={() => {
          if (src) BAD_SRCS[src] = true;
          refresh((i) => i + 1);
        }}
        {...rest}
      />
    );
  }

  return <HelpCircle {...rest} />;
};

export default Logo;
