import { useCallback, useEffect, useState } from "react";
import {
  useMeowshiContract,
  useSushiBarContract,
  useSushiContract,
} from "../hooks/useContract";

import { BalanceProps } from "./useTokenBalance";
import Fraction from "../entities/Fraction";
import { ethers } from "ethers";
import { useActiveWeb3React } from "./useActiveWeb3React";
import { useTransactionAdder } from "../state/transactions/hooks";

const { BigNumber } = ethers;

const useMeowshi = () => {
  const { account } = useActiveWeb3React();
  const addTransaction = useTransactionAdder();
  const sushiContract = useSushiContract();
  const barContract = useSushiBarContract();
  const meowshiContract = useMeowshiContract();

  const [allowance, setAllowance] = useState("0");

  const fetchAllowance = useCallback(async () => {
    if (account) {
      try {
        const allowance = await barContract?.allowance(
          account,
          meowshiContract?.address
        );
        const formatted = Fraction.from(
          BigNumber.from(allowance),
          BigNumber.from(10).pow(18)
        ).toString();
        setAllowance(formatted);
      } catch (error) {
        setAllowance("0");
        throw error;
      }
    }
  }, [account, meowshiContract, barContract]);

  useEffect(() => {
    if (account && meowshiContract && barContract) {
      fetchAllowance();
    }
    const refreshInterval = setInterval(fetchAllowance, 10000);
    return () => clearInterval(refreshInterval);
  }, [account, meowshiContract, fetchAllowance, barContract]);

  const approve = useCallback(async () => {
    try {
      const tx = await barContract?.approve(
        meowshiContract?.address,
        ethers.constants.MaxUint256.toString()
      );
      return addTransaction(tx, { summary: "Approve" });
    } catch (e) {
      return e;
    }
  }, [addTransaction, meowshiContract, barContract]);

  const meow = useCallback(
    // todo: this should be updated with BigNumber as opposed to string
    async (amount: BalanceProps | undefined) => {
      if (amount?.value) {
        try {
          const tx = await meowshiContract?.meow(account, amount?.value);
          return addTransaction(tx, { summary: "Enter Meowshi" });
        } catch (e) {
          return e;
        }
      }
    },
    [addTransaction, meowshiContract]
  );

  const unmeow = useCallback(
    // todo: this should be updated with BigNumber as opposed to string
    async (amount: BalanceProps | undefined) => {
      if (amount?.value) {
        try {
          const tx = await meowshiContract?.unmeow(account, amount?.value);
          return addTransaction(tx, { summary: "Leave Meowshi" });
        } catch (e) {
          return e;
        }
      }
    },
    [addTransaction, meowshiContract]
  );

  return { allowance, approve, meow, unmeow };
};

export default useMeowshi;
