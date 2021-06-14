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

export default function ExchangeHeader({
  input = undefined,
  output = undefined,
}: any): JSX.Element {
  const { i18n } = useLingui();
  const { chainId } = useActiveWeb3React();
  const [animateSettings, setAnimateSettings] = useState(false);
  const [animateWallet, setAnimateWallet] = useState(false);
  console.log({ input, output });
  return (
    <div className="flex justify-between mb-4 space-x-3">
      <div className="grid grid-cols-2 rounded-md p-3px md:bg-dark-800">
        <NavLink
          activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
          // href={`/swap${
          //   input ? `?inputCurrency=${currencyId(input, chainId)}` : ""
          // }${
          //   output && output.address
          //     ? `&outputCurrency=${currencyId(output, chainId)}`
          //     : ""
          // }`}
          href={`/swap${input ? `/${currencyId(input, chainId)}` : ""}${
            output ? `/${currencyId(output, chainId)}` : ""
          }`}
          as="/swap"
        >
          <a className="flex items-center justify-center px-4 text-base font-medium text-center rounded-md md:px-10 text-secondary hover:text-high-emphesis">
            {i18n._(t`Swap`)}
          </a>
        </NavLink>
        {/* <NavLink activeClassName="bg-dark-900 text-high-emphesis" to="/limit-order">
                    <a className="px-4 py-2 text-xs font-medium text-center rounded-md text-secondary hover:text-high-emphesis">
                        {i18n._(t`Limit Order`)}
                    </a>
                </NavLink> */}
        <NavLink
          activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
          href={`/add${input ? `/${currencyId(input, chainId)}` : ""}${
            output ? `/${currencyId(output, chainId)}` : ""
          }`}
        >
          <a className="flex items-center justify-center px-4 text-base font-medium text-center rounded-md md:px-10 text-secondary hover:text-high-emphesis">
            {i18n._(t`Pool`)}
          </a>
        </NavLink>
      </div>
      <div className="flex items-center rounded md:border-2 md:border-dark-800 md:p-2">
        <div className="grid grid-flow-col gap-3">
          <div className="hidden md:flex space-x-3 items-center bg-dark-800 rounded-sm h-full w-full px-2 py-1.5 cursor-pointer">
            <svg
              width="18"
              height="20"
              viewBox="0 0 18 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.5215 0.618164L12.6818 1.57302L15.933 4.37393V13.2435C15.9114 13.6891 15.5239 14.0498 15.0502 14.0286C14.6196 14.0074 14.2751 13.6679 14.2536 13.2435V7.28093C14.2536 6.21998 13.3923 5.37122 12.3158 5.37122H11.8421V2.67641C11.8421 1.61546 10.9808 0.766697 9.90428 0.766697H1.93779C0.861242 0.766697 0 1.61546 0 2.67641V18.4421C0 18.9089 0.387559 19.2909 0.861242 19.2909H10.9808C11.4545 19.2909 11.8421 18.9089 11.8421 18.4421V6.64436H12.3158C12.6818 6.64436 12.9617 6.92021 12.9617 7.28093V13.2435C13.0048 14.4105 13.9737 15.3017 15.1579 15.2805C16.2775 15.2381 17.1818 14.3469 17.2248 13.2435V3.80102L13.5215 0.618164ZM9.66744 8.89358H2.17464V3.10079H9.66744V8.89358Z"
                fill="#7CFF6B"
              />
            </svg>
            <div className="hidden md:block text-green text-baseline">
              <Gas />
            </div>
          </div>

          {/* <button
                        onMouseEnter={() => setAnimateSettings(true)}
                        onMouseLeave={() => setAnimateSettings(false)}
                        className="flex items-center justify-center w-full h-full p-1 rounded-sm bg-dark-800 hover:bg-dark-700 md:px-2"
                    >
                        <Lottie
                            animationData={settingsAnimationData}
                            autoplay={animateSettings}
                            loop={false}
                            style={{ width: 28, height: 28 }}
                            className="transform rotate-90"
                        />
                    </button> */}
          {/* <button
                        onMouseEnter={() => setAnimateWallet(true)}
                        onMouseLeave={() => setAnimateWallet(false)}
                        className="items-center justify-center hidden w-full h-full px-2 rounded-sm md:flex bg-dark-800 hover:bg-dark-700"
                    >
                        <Lottie
                            animationData={profileAnimationData}
                            autoplay={animateWallet}
                            loop={false}
                            style={{ width: 24, height: 24 }}
                        />
                    </button> */}
          <div className="relative w-full h-full p-1 rounded-sm bg-dark-800 hover:bg-dark-700 md:px-2">
            <Settings />
          </div>
        </div>
      </div>
    </div>
  );
}
