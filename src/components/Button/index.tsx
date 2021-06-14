import React from "react";

const SIZE = {
  default: "px-4 py-3",
  small: "px-2 py-1",
  large: "px-6 py-4",
};

const FILLED = {
  default: "bg-transparent",
  red: "bg-red bg-opacity-80 w-full rounded text-base text-high-emphesis hover:bg-opacity-100",
  blue: "bg-blue bg-opacity-80 w-full rounded text-base text-high-emphesis hover:bg-opacity-100",
  pink: "bg-pink bg-opacity-80 w-full rounded text-base text-high-emphesis hover:bg-opacity-100",
  gray: "bg-dark-700 bg-opacity-80 w-full rounded text-base text-high-emphesis hover:bg-opacity-100",
  gradient:
    "w-full text-high-emphesis bg-gradient-to-r from-blue to-pink opacity-80 hover:opacity-100",
};

const OUTLINED = {
  default: "bg-transparent",
  red: "bg-red bg-opacity-20 outline-red rounded text-xs text-red hover:bg-opacity-40",
  blue: "bg-blue bg-opacity-20 outline-blue rounded text-xs text-blue hover:bg-opacity-40",
  pink: "bg-pink bg-opacity-20 outline-pink rounded text-xs text-pink hover:bg-opacity-40",
  gray: "bg-dark-700 bg-opacity-20 outline-pink rounded text-xs text-pink hover:bg-opacity-40",
  gradient: "bg-gradient-to-r from-blue to-pink opacity-80 hover:opacity-100",
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
