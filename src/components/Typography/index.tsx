import React, { FunctionComponent } from "react";

import { classNames } from "../../functions";

export type TypographyWeight = 400 | 700;

export type TypographyVariant =
  | "hero"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "body"
  | "caption"
  | "caption2";

const VARIANTS = {
  hero: "text-hero",
  h1: "text-4xl",
  h2: "text-3xl",
  h3: "text-h3",
  h4: "text-3xl",
  h5: "text-2xl",
  body: "text-lg",
  caption: "text-base",
  caption2: "text-sm",
};

export interface TypographyProps {
  variant?: TypographyVariant;
  weight?: TypographyWeight;
  component?: keyof React.ReactHTML;
  className?: string;
  // children?: React.ReactNode | React.ReactNode[]
  clickable?: boolean;
}

function Typography({
  variant = "body",
  weight = 400,
  component = "div",
  className = "text-primary",
  clickable = false,
  children = [],
  onClick = undefined,
  ...rest
}: React.HTMLAttributes<React.ReactHTML> & TypographyProps): JSX.Element {
  return React.createElement(
    component,
    {
      className: classNames(
        VARIANTS[variant],
        onClick ? "cursor-pointer select-none" : "",
        className
      ),
      onClick,
      ...rest,
    },
    children
  );
}

export default Typography;
