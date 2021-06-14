import React from "react";
import { Input as PercentInput } from "../PercentInput";

interface PercentInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  id: string;
}

export default function PercentInputPanel({
  value,
  onUserInput,
  id,
}: PercentInputPanelProps) {
  return (
    <div id={id} className="rounded bg-dark-800 p-5">
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row justify-between">
        <div
          className="w-full sm:w-2/5 text-white"
          style={{ margin: "auto 0px" }}
        >
          Amount to Remove
        </div>
        <div className="flex items-center rounded bg-dark-900 font-bold text-xl space-x-3 p-3 w-full sm:w-3/5">
          <PercentInput
            className="token-amount-input"
            value={value}
            onUserInput={(val) => {
              onUserInput(val);
            }}
            align="right"
          />
          <div className="font-bold text-xl pl-2">%</div>
        </div>
      </div>
    </div>
  );
}
