import React, { useCallback, useState } from "react";
import Popover, { PopoverProps } from "../Popover";

interface TooltipProps extends Omit<PopoverProps, "content"> {
  text: string;
}

export default function Tooltip({ text, ...rest }: TooltipProps) {
  return (
    <Popover
      content={
        <div className="w-[228px] px-2 py-1 font-medium bg-dark-700 border border-gray-600 rounded text-sm">
          {text}
        </div>
      }
      {...rest}
    />
  );
}

export function MouseoverTooltip({
  children,
  ...rest
}: Omit<TooltipProps, "show">) {
  const [show, setShow] = useState(false);
  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);
  return (
    <Tooltip {...rest} show={show}>
      <div onMouseEnter={open} onMouseLeave={close}>
        {children}
      </div>
    </Tooltip>
  );
}
