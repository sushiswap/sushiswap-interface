import React from "react";

export type BadgeColor = "default" | "blue" | "pink";
export type BadgeSize = "default" | "medium" | "large";

export interface BadgeProps {
  children?: React.ReactChild | React.ReactChild[];
  color?: BadgeColor;
  size?: BadgeSize;
}

export const COLOR = {
  default: "",
  blue: "bg-blue bg-opacity-20 outline-blue rounded text-blue px-2 py-1",
  pink: "bg-pink bg-opacity-20 outline-pink rounded text-pink px-2 py-1",
};

export const SIZE = {
  default: "text-xs",
  medium: "text-sm",
  large: "text-lg",
};

function Badge({
  color = "default",
  size = "default",
  children,
  className = "",
}: BadgeProps & React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div className={`${COLOR[color]} ${SIZE[size]} ${className}`}>
      {children}
    </div>
  );
}

export default Badge;
