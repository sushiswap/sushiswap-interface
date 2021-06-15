import React, { useState } from "react";

import Gas from "./Gas";
import Lottie from "lottie-react";
import NavLink from "./NavLink";
import Settings from "./Settings";
import { currencyId } from "../functions";
import profileAnimationData from "../animation/wallet.json";
import settingsAnimationData from "../animation/settings-slider.json";
import { t } from "@lingui/macro";
import { useActiveWeb3React } from "../hooks";
import { useLingui } from "@lingui/react";
import MyOrders from "../features/limit-orders/MyOrders";

export default function ExchangeHeader({
  input = undefined,
  output = undefined,
}: any): JSX.Element {
  const { i18n } = useLingui();
  const { chainId } = useActiveWeb3React();
  const [animateSettings, setAnimateSettings] = useState(false);
  const [animateWallet, setAnimateWallet] = useState(false);

  return (
    <div className="flex justify-between mb-4 space-x-3">
      <div className="grid grid-cols-2 rounded-md p-3px md:bg-dark-800 h-[46px]">
        <NavLink
          activeClassName="font-bold bg-transparent rounded text-high-emphesis bg-gradient-to-r from-opaque-blue to-opaque-pink hover:from-blue hover:to-pink"
          href={`/swap${
            input ? `?inputCurrency=${currencyId(input, chainId)}` : ""
          }${
            output && output.address
              ? `&outputCurrency=${currencyId(output, chainId)}`
              : ""
          }`}
        >
          <a className="flex items-center justify-center px-4 text-base font-bold text-center rounded-md md:px-8 text-secondary hover:text-high-emphesis">
            {i18n._(t`Swap`)}
          </a>
        </NavLink>
        <NavLink
          activeClassName="font-bold bg-transparent rounded text-high-emphesis bg-gradient-to-r from-opaque-blue to-opaque-pink hover:from-blue hover:to-pink"
          href={`/limit-order${
            input ? `?inputCurrency=${currencyId(input, chainId)}` : ""
          }${
            output && output.address
              ? `&outputCurrency=${currencyId(output, chainId)}`
              : ""
          }`}
        >
          <a className="flex items-center justify-center px-4 text-base font-bold text-center rounded-md md:px-8 text-secondary hover:text-high-emphesis">
            {i18n._(t`Limit`)}
          </a>
        </NavLink>
      </div>
      <div className="flex items-center">
        <div className="grid grid-flow-col gap-6">
          <div className="hidden md:flex items-center h-full w-full cursor-pointer">
            <MyOrders />
          </div>
          <div className="relative w-full h-full rounded-sm cursor-pointer flex items-center text-secondary hover:text-high-emphesis">
            <Settings />
          </div>
        </div>
      </div>
    </div>
  );
}
