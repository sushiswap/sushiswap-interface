import React, { FC, useCallback } from "react";
import useLimitOrders from "../../hooks/useLimitOrders";
import { t, Trans } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import CurrencyLogo from "../../components/CurrencyLogo";
import { JSBI } from "@sushiswap/sdk";
import { useActiveWeb3React, useLimitOrderContract } from "../../hooks";
import Button from "../../components/Button";
import { LimitOrder } from "limitorderv2-sdk";
import NavLink from "../../components/NavLink";
import Badge from "../../components/Badge";
import { useTransactionAdder } from "../../state/transactions/hooks";
import Lottie from "lottie-react";
import loadingCircle from "../../animation/loading-circle.json";

const OpenOrders: FC = () => {
  const { i18n } = useLingui();
  const { chainId } = useActiveWeb3React();
  const { pending, loading } = useLimitOrders();
  const limitOrderContract = useLimitOrderContract(true);
  const addTransaction = useTransactionAdder();

  const cancelOrder = useCallback(
    async (limitOrder: LimitOrder, summary: string) => {
      const resp = await limitOrderContract.cancelOrder(
        limitOrder.getTypeHash()
      );
      addTransaction(resp, {
        summary,
      });
    },
    [addTransaction, limitOrderContract]
  );

  return (
    <>
      <div className="text-xl text-high-emphesis flex items-center gap-2 border-b border-dark-800 pb-4">
        {i18n._(t`Open Orders`)}{" "}
        <span className="inline-flex">
          <Badge color="blue" size="medium">
            {pending.length}
          </Badge>
        </span>
      </div>
      <div className="text-secondary text-center py-4">
        {loading && (
          <div className="w-8 m-auto">
            <Lottie animationData={loadingCircle} autoplay loop />
          </div>
        )}
        {pending.length > 0 ? (
          <>
            <div className="grid grid-flow-col grid-cols-4 gap-4 px-4 pb-4 text-sm text-secondary font-bold">
              <div className="flex items-center cursor-pointer hover:text-primary">
                {i18n._(t`Receive`)}
              </div>
              <div className="flex items-center cursor-pointer hover:text-primary">
                {i18n._(t`Pay`)}
              </div>
              <div className="flex items-center cursor-pointer hover:text-primary">
                {i18n._(t`Rate`)}
              </div>
              <div className="flex items-center cursor-pointer hover:text-primary justify-end"></div>
            </div>
            <div className="flex-col space-y-2">
              {pending.map((order, index) => (
                <div
                  key={index}
                  className="block text-high-emphesis bg-dark-800 overflow-hidden rounded"
                >
                  <div className="grid items-center grid-flow-col grid-cols-4 gap-4 px-4 py-3 text-sm align-center text-primary bg-gradient-to-r from-dark-blue">
                    <div className="flex flex-col">
                      <div className="flex gap-2 font-bold items-center">
                        <CurrencyLogo size={42} currency={order.tokenOut} />
                        {order.limitOrder.amountOut.toSignificant(6)}{" "}
                        {order.tokenOut.getSymbol(chainId)}
                        WETH
                      </div>
                    </div>
                    <div className="text-left font-bold">
                      {order.limitOrder.amountIn.toSignificant(6)}{" "}
                      {order.tokenIn.getSymbol(chainId)}
                      WBTC
                    </div>
                    <div className="text-left">
                      <div>
                        {JSBI.divide(
                          order.limitOrder.amountOut.raw,
                          order.limitOrder.amountIn.raw
                        )}{" "}
                        WBTC
                      </div>
                      <div className="text-xs text-secondary">per SUSHI</div>
                    </div>
                    <div className="hidden md:block text-right font-bold">
                      <div className="mb-1">
                        {order.filledPercent}% {i18n._(t`Filled`)}
                      </div>
                      <div>
                        <Button
                          color="pink"
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            cancelOrder(
                              order.limitOrder,
                              `Cancel order receive ${order.limitOrder.amountOut.toSignificant(
                                6
                              )} ${order.tokenOut.getSymbol(
                                chainId
                              )} for ${order.limitOrder.amountIn.toSignificant(
                                6
                              )} ${order.tokenIn.getSymbol(chainId)}`
                            )
                          }
                        >
                          {i18n._(t`Cancel Order`)}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <span>
            No open limit orders. Why not{" "}
            <NavLink href="/limit-order">
              <a className="text-sm text-blue underline cursor-pointer">
                place one?
              </a>
            </NavLink>
          </span>
        )}
      </div>
    </>
  );
};

export default OpenOrders;
