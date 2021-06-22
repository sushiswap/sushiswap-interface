import React, { FunctionComponent } from "react";

import { classNames } from "../../functions";

export type TypographyWeight = 400 | 700;

const WEIGHTS = {
  400: "font-medium",
  700: "font-bold",
};

export type TypographyVariant =
  | "hero"
  | "h1"
  | "h2"
  | "h3"
  | "lg"
  | "base"
  | "sm"
  | "xs";

const VARIANTS = {
  hero: "text-hero",
  h1: "text-4xl",
  h2: "text-3xl",
  h3: "text-2xl",
  lg: "text-lg",
  base: "text-base",
  sm: "text-sm",
  xs: "text-xs",
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
  variant = "base",
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
        WEIGHTS[weight],
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
