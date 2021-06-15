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
  index: number;
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
    if (!data || data.length === 0) return;

    const state = data.reduce(
      async (acc, order: any, index: number) => {
        order.chainId = +order.chainId;
        order.tokenInDecimals = +order.tokenInDecimals || 18;
        order.tokenOutDecimals = +order.tokenOutDecimals || 18;

        const limitOrder = LimitOrder.getLimitOrder(order);
        const digest = limitOrder.getTypeHash();

        const filledAmount = await limitOrderContract.orderStatus(digest);
        const filledPercent = filledAmount
          .mul(BigNumber.from("100"))
          .div(BigNumber.from(order.amountIn))
          .toString();
        const isCanceled = await limitOrderContract.cancelledOrder(
          account,
          digest
        );
        const filled = filledAmount.toString() == order.amountIn;

        const openOrder: OpenOrder = {
          tokenIn: new Token(
            chainId,
            limitOrder.tokenInAddress,
            limitOrder.tokenInDecimals,
            limitOrder.tokenInSymbol
          ),
          tokenOut: new Token(
            chainId,
            limitOrder.tokenOutAddress,
            limitOrder.tokenOutDecimals,
            limitOrder.tokenOutSymbol
          ),
          limitOrder,
          filledPercent,
          index,
          isCanceled,
          filled,
          inRaw: limitOrder.amountInRaw,
          minOutRaw: limitOrder.amountOutRaw,
        };

        if (filled || isCanceled) {
          acc.completed.push(openOrder);
        } else {
          acc.pending.push(openOrder);
        }

        return acc;
      },
      {
        pending: [],
        completed: [],
      }
    );

    state.then((state) => setOpenOrders(state));
  }, [account, chainId, data, limitOrderContract]);

  return {
    ...openOrders,
    loading: !data,
  };
};

export default useLimitOrders;
