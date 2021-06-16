import React, { Fragment, memo } from "react";

import { ChevronRight } from "react-feather";
import { Trade } from "@sushiswap/sdk";
import { unwrappedToken } from "../../functions/currency/wrappedCurrency";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";

export default memo(({ trade }: { trade: Trade }) => {
  const { chainId } = useActiveWeb3React();
  return (
    <div className="flex flex-wrap items-center justify-end">
      {trade.route.path.map((token, i, path) => {
        const isLastItem: boolean = i === path.length - 1;
        const currency = unwrappedToken(token);
        return (
          <Fragment key={i}>
            <div className="flex space-x-2 flex-end">
              <div className="text-sm font-bold text-high-emphesis">
                {currency.getSymbol(chainId)}
              </div>
            </div>
            {isLastItem ? null : <ChevronRight size={12} />}
          </Fragment>
        );
      })}
    </div>
  );
});
