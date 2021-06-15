import React, { FC } from "react";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import CurrencyLogo from "../../components/CurrencyLogo";
import { JSBI } from "@sushiswap/sdk";
import { useActiveWeb3React } from "../../hooks";
import useLimitOrders from "../../hooks/useLimitOrders";
import Badge from "../../components/Badge";
import Lottie from "lottie-react";
import loadingCircle from "../../animation/loading-circle.json";

const CompletedOrders: FC = () => {
  const { i18n } = useLingui();
  const { chainId } = useActiveWeb3React();
  const { completed, loading } = useLimitOrders();

  return (
    <>
      <div className="text-xl text-high-emphesis flex items-center gap-2 border-b border-dark-800 pb-4">
        {i18n._(t`Order History`)}{" "}
        <span className="inline-flex">
          <Badge color="pink" size="medium">
            {completed.length}
          </Badge>
        </span>
      </div>
      <div className="text-secondary text-center py-4">
        {loading && (
          <div className="w-8 m-auto">
            <Lottie animationData={loadingCircle} autoplay loop />
          </div>
        )}
        {completed.length > 0 ? (
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
              <div className="flex items-center cursor-pointer hover:text-primary justify-end">
                {i18n._(t`Filled`)}
              </div>
            </div>
            <div className="flex-col space-y-2">
              {completed.map((order, index) => (
                <div
                  key={index}
                  className="block text-high-emphesis bg-dark-800 overflow-hidden rounded"
                  style={{
                    background: order.isCanceled
                      ? "linear-gradient(90deg, rgba(229, 229, 229, 0.15) 0%, rgba(229, 229, 229, 0) 50%), #202231"
                      : "linear-gradient(90deg, rgba(0, 255, 79, 0.075) 0%, rgba(0, 255, 79, 0) 50%), #202231;",
                  }}
                >
                  <div className="grid items-center grid-flow-col grid-cols-4 gap-4 px-4 py-3 text-sm align-center text-primary bg-gradient-to-r from-dark-blue">
                    <div className="flex flex-col">
                      <div className="flex gap-2 font-bold items-center">
                        <CurrencyLogo size={42} currency={order.tokenOut} />
                        {order.limitOrder.amountOut.toSignificant(6)}{" "}
                        {order.tokenIn.getSymbol(chainId)}
                      </div>
                    </div>
                    <div className="text-left font-bold">
                      {order.limitOrder.amountIn.toSignificant(6)}{" "}
                      {order.tokenIn.getSymbol(chainId)}
                    </div>
                    <div className="text-left">
                      <div>
                        {JSBI.divide(
                          order.limitOrder.amountOut.raw,
                          order.limitOrder.amountIn.raw
                        )}{" "}
                      </div>
                      <div className="text-xs text-secondary">
                        per {order.tokenIn.getSymbol(chainId)}
                      </div>
                    </div>
                    <div className="hidden md:block text-right">
                      <div className="mb-1">
                        {order.isCanceled && (
                          <span className="text-secondary">
                            {i18n._(t`Cancelled`)}
                          </span>
                        )}
                        {order.filled && (
                          <span className="text-green">
                            {i18n._(t`Filled`)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <span>{i18n._(t`No order history`)}</span>
        )}
      </div>
    </>
  );
};

export default CompletedOrders;
