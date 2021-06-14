import React from "react";

const SIZE = {
  default: "px-4 py-3 text-base",
  small: "px-2 py-1 text-xs",
  large: "px-6 py-4 text-base",
};

const FILLED = {
  default: "bg-transparent",
  red: "bg-red bg-opacity-80 w-full rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80",
  blue: "bg-blue bg-opacity-80 w-full rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80",
  pink: "bg-pink bg-opacity-80 w-full rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80",
  gray: "bg-dark-700 bg-opacity-80 w-full rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80",
  green:
    "bg-green bg-opacity-80 w-full rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80",
  gradient:
    "w-full text-high-emphesis bg-gradient-to-r from-blue to-pink opacity-80 hover:opacity-100 disabled:bg-opacity-80",
};

const OUTLINED = {
  default: "bg-transparent",
  red: "bg-red bg-opacity-20 outline-red rounded text-red hover:bg-opacity-40 disabled:bg-opacity-20",
  blue: "bg-blue bg-opacity-20 outline-blue rounded text-blue hover:bg-opacity-40 disabled:bg-opacity-20",
  pink: "bg-pink bg-opacity-20 outline-pink rounded text-pink hover:bg-opacity-40 disabled:bg-opacity-20",
  gray: "bg-dark-700 bg-opacity-20 outline-pink rounded text-pink hover:bg-opacity-40 disabled:bg-opacity-20",
  green:
    "bg-green bg-opacity-20 outline-pink rounded text-green hover:bg-opacity-40 disabled:bg-opacity-20",
  gradient:
    "bg-gradient-to-r from-blue to-pink opacity-80 hover:opacity-100 disabled:bg-opacity-20",
};

const VARIANT = {
  outlined: OUTLINED,
  filled: FILLED,
};

export type ButtonColor =
  | "blue"
  | "pink"
  | "gradient"
  | "gray"
  | "default"
  | "red";

export type ButtonSize = "small" | "large" | "default";

export type ButtonVariant = "outlined" | "filled";

export interface ButtonProps {
  children?: React.ReactChild | React.ReactChild[];
  color?: ButtonColor;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

function Button({
  children,
  className,
  color = "default",
  size = "default",
  variant = "filled",
  ...rest
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element {
  return (
    <button
      className={`${VARIANT[variant][color]} ${SIZE[size]} rounded focus:outline-none focus:ring disabled:opacity-50 font-medium ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
