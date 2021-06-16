import { useActiveWeb3React, useLimitOrderContract } from ".";
import useSWR, { SWRResponse } from "swr";
import { LAMBDA_URL, LimitOrder } from "limitorderv2-sdk";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { Token } from "@sushiswap/sdk";

interface State {
  pending: OpenOrder[];
  completed: OpenOrder[];
}

interface OpenOrder {
  tokenIn: Token;
  tokenOut: Token;
  filled: boolean;
  filledPercent: string;
  inRaw: string;
  isCanceled: boolean;
  limitOrder: LimitOrder;
  minOutRaw: string;
}

const url = `${LAMBDA_URL}/orders/view`;
const fetcher = (url, account, chainId) =>
  fetch(url, {
    method: "POST",
    body: JSON.stringify({ address: account, chainId }),
  })
    .then((r) => r.json())
    .then((j) => j.data);

const useLimitOrders = () => {
  const [openOrders, setOpenOrders] = useState<State>({
    pending: [],
    completed: [],
  });

  const { account, chainId } = useActiveWeb3React();
  const limitOrderContract = useLimitOrderContract();
  const { data }: SWRResponse<any, Error> = useSWR(
    [url, account, chainId],
    fetcher
  );

  useEffect(() => {
    if (!Array.isArray(data)) return;

    const transform = async () => {
      return await data.reduce(
        async (accP, order: any) => {
          const acc = await accP;

          const limitOrder = LimitOrder.getLimitOrder({
            ...order,
            chainId: +order.chainId,
            tokenInDecimals: +order.tokenInDecimals || 18,
            tokenOutDecimals: +order.tokenOutDecimals || 18,
          });
          const digest = limitOrder.getTypeHash();
          const filledAmount = await limitOrderContract.orderStatus(digest);

          const openOrder: OpenOrder = {
            tokenIn: limitOrder.amountIn.token,
            tokenOut: limitOrder.amountOut.token,
            limitOrder,
            filledPercent: filledAmount
              .mul(BigNumber.from("100"))
              .div(BigNumber.from(order.amountIn))
              .toString(),
            isCanceled: await limitOrderContract.cancelledOrder(
              account,
              digest
            ),
            filled: filledAmount.toString() == order.amountIn,
            inRaw: limitOrder.amountInRaw,
            minOutRaw: limitOrder.amountOutRaw,
          };

          if (openOrder.filled || openOrder.isCanceled) {
            acc.completed.push(openOrder);
          } else {
            acc.pending.push(openOrder);
          }

          return acc;
        },
        Promise.resolve({
          pending: [],
          completed: [],
        })
      );
    };

    transform().then((state) => setOpenOrders(state));
  }, [account, chainId, data, limitOrderContract]);

  return {
    ...openOrders,
    loading: !data,
  };
};

export default useLimitOrders;
