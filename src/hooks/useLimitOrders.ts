import { useActiveWeb3React, useLimitOrderContract } from ".";
import useSWR, { SWRResponse } from "swr";
import { LAMBDA_URL, LimitOrder } from "limitorderv2-sdk";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { Token } from "@sushiswap/sdk";

interface State {
  pending: OpenOrder[];
  completed: OpenOrder[];
  loading: boolean;
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
    loading: true,
  });

  const { account, chainId } = useActiveWeb3React();
  const limitOrderContract = useLimitOrderContract();

  const shouldFetch = url && account && chainId;
  const { data, mutate }: SWRResponse<any, Error> = useSWR(
    shouldFetch ? [url, account, chainId] : null,
    fetcher
  );

  console.log(data);
  useEffect(() => {
    if (!Array.isArray(data)) return;

    const transform = async () =>
      Promise.all(
        data.map(async (order: any) => {
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

          return openOrder;
        }, [])
      ).then((data) =>
        data.reduce(
          (acc, cur) => {
            if (cur.filled || cur.isCanceled) {
              acc.completed.push(cur);
            } else {
              acc.pending.push(cur);
            }

            return acc;
          },
          {
            completed: [],
            pending: [],
          }
        )
      );

    transform().then((state) =>
      setOpenOrders({
        ...state,
        loading: false,
      })
    );
  }, [account, chainId, data, limitOrderContract]);

  return {
    ...openOrders,
    mutate,
  };
};

export default useLimitOrders;
