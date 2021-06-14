import { CurrencyAmount } from "@sushiswap/sdk";
import { useCallback } from "react";
import { useSushiBarContract } from "../hooks/useContract";
import { useTransactionAdder } from "../state/transactions/hooks";

const useSushiBar = () => {
  const addTransaction = useTransactionAdder();
  const barContract = useSushiBarContract();

  const enter = useCallback(
    async (amount: CurrencyAmount | undefined) => {
      if (amount?.raw) {
        try {
          const tx = await barContract?.enter(amount?.raw.toString());
          return addTransaction(tx, { summary: "Enter SushiBar" });
        } catch (e) {
          return e;
        }
      }
    },
    [addTransaction, barContract]
  );

  const leave = useCallback(
    async (amount: CurrencyAmount | undefined) => {
      if (amount?.raw) {
        try {
          const tx = await barContract?.leave(amount?.raw.toString());
          return addTransaction(tx, { summary: "Leave SushiBar" });
        } catch (e) {
          return e;
        }
      }
    },
    [addTransaction, barContract]
  );

  return { enter, leave };
};

export default useSushiBar;
