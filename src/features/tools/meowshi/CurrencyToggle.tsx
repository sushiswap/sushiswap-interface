import React, { FC } from "react";
import { RadioGroup } from "@headlessui/react";
import { classNames } from "../../../functions";
import { CheckCircleIcon } from "@heroicons/react/outline";
import Typography from "../../../components/Typography";
import { useActiveWeb3React } from "../../../hooks";
import Image from "next/image";
import { useTokenBalance } from "../../../state/wallet/hooks";
import { SUSHI, XSUSHI } from "../../../constants";
import { ChainId } from "@sushiswap/sdk";
import { MeowshiCurrency } from "../../../pages/tools/meowshi";

interface CurrencyToggleProps {
  selectedCurrency: MeowshiCurrency;
  setSelectedCurrency: (x: MeowshiCurrency) => void;
}

const CurrencyToggle: FC<CurrencyToggleProps> = ({
  selectedCurrency,
  setSelectedCurrency,
}) => {
  const currencies = [
    {
      name: MeowshiCurrency.SUSHI,
      logo: (
        <Image
          src="/images/tokens/sushi-square.jpg"
          alt="SUSHI"
          width="38px"
          height="38px"
          objectFit="contain"
          className="rounded-md"
        />
      ),
      activeClass: "text-white bg-dark-700",
    },
    {
      name: MeowshiCurrency.XSUSHI,
      logo: (
        <Image
          src="/images/tokens/xsushi-square.jpg"
          alt="XSUSHI"
          width="38px"
          height="38px"
          objectFit="contain"
          className="rounded-md"
        />
      ),
      activeClass: "text-white bg-dark-700",
    },
  ];

  const { account } = useActiveWeb3React();
  const sushiBalance = useTokenBalance(account, SUSHI[ChainId.MAINNET]);
  const xSushiBalance = useTokenBalance(account, XSUSHI);

  return (
    <div className="w-full max-w-md mx-auto">
      <RadioGroup value={selectedCurrency} onChange={setSelectedCurrency}>
        <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
        <div className="grid grid-flow-col grid-cols-2 gap-1">
          {currencies.map(({ name, logo, activeClass }) => (
            <RadioGroup.Option
              key={name}
              value={name}
              className={({ checked }) =>
                `${checked ? activeClass : "bg-dark-900"}
                    relative rounded-lg shadow-md px-5 py-4 cursor-pointer flex focus:outline-none`
              }
            >
              {({ checked }) => (
                <>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <div className="text-sm flex flex-col gap-2">
                        <RadioGroup.Label
                          as="div"
                          className="flex flex-row items-center gap-4"
                        >
                          {logo}
                          <Typography
                            variant="h3"
                            className={classNames(
                              checked ? "text-white" : "text-secondary"
                            )}
                          >
                            {name}
                          </Typography>
                        </RadioGroup.Label>
                        <RadioGroup.Description
                          as="div"
                          className={`white-space nowrap flex flex-row ${
                            checked ? "text-white" : "text-secondary"
                          }`}
                        >
                          <Typography
                            variant="sm"
                            className={classNames(
                              checked ? "text-white" : "text-secondary"
                            )}
                          >
                            Balance:{" "}
                            {(name === MeowshiCurrency.SUSHI
                              ? sushiBalance?.toSignificant(6)
                              : xSushiBalance?.toSignificant(6)) ?? "0.000000"}
                          </Typography>
                        </RadioGroup.Description>
                      </div>
                    </div>
                    {checked && (
                      <div className="flex-shrink-0 text-white">
                        <CheckCircleIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default CurrencyToggle;
