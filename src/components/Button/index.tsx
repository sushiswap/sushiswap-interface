import React from "react";
import { classNames } from "../../functions";

const SIZE = {
  default: "px-4 py-2 text-base",
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
  gray: "bg-dark-700 bg-opacity-20 outline-gray rounded text-gray hover:bg-opacity-40 disabled:bg-opacity-20",
  green:
    "bg-green bg-opacity-20 border border-green rounded text-green hover:bg-opacity-40 disabled:bg-opacity-20",
  gradient:
    "bg-gradient-to-r from-blue to-pink opacity-80 hover:opacity-100 disabled:bg-opacity-20",
};

const EMPTY = {
  default:
    "flex bg-transparent justify-center items-center focus:underline action:no-underline disabled:opacity-50 disabled:cursor-auto",
};

const VARIANT = {
  outlined: OUTLINED,
  filled: FILLED,
  empty: EMPTY,
};

export type ButtonColor =
  | "blue"
  | "pink"
  | "gradient"
  | "gray"
  | "default"
  | "red"
  | "green";

export type ButtonSize = "small" | "large" | "default";

export type ButtonVariant = "outlined" | "filled" | "empty";

export type ButtonProps = {
  color?: ButtonColor;
  size?: ButtonSize;
  variant?: ButtonVariant;
} & {
  ref?: React.Ref<HTMLButtonElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({
  children,
  className = undefined,
  color = "default",
  size = "default",
  variant = "filled",
  ...rest
}: ButtonProps): JSX.Element {
  return (
    <button
      className={classNames(
        VARIANT[variant][color],
        SIZE[size],
        "rounded focus:outline-none focus:ring disabled:opacity-50 font-medium",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;

export function ButtonConfirmed({
  confirmed,
  disabled,
  ...rest
}: { confirmed?: boolean; disabled?: boolean } & ButtonProps) {
  if (confirmed) {
    return (
      <Button
        variant="outlined"
        color="green"
        size="large"
        className={classNames(
          disabled && "cursor-not-allowed",
          "border opacity-50"
        )}
        disabled={disabled}
        {...rest}
      />
    );
  } else {
    return (
      <Button
        color={disabled ? "gray" : "gradient"}
        size="large"
        disabled={disabled}
        {...rest}
      />
    );
  }
}

export function ButtonError({
  error,
  disabled,
  ...rest
}: {
  error?: boolean;
  disabled?: boolean;
} & ButtonProps) {
  if (error) {
    return <Button color="red" size="large" {...rest} />;
  } else {
    return (
      <Button
        color={disabled ? "gray" : "gradient"}
        disabled={disabled}
        size="large"
        {...rest}
      />
    );
  }
}
