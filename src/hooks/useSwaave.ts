import { useCallback, useEffect, useState } from "react";
import { useSushiBarContract, useSushiContract } from "./useContract";

import Fraction from "../entities/Fraction";
import { ethers } from "ethers";
import { useActiveWeb3React } from "./useActiveWeb3React";
import { useTransactionAdder } from "../state/transactions/hooks";

const { BigNumber } = ethers;

const useSushiBar = () => {
  const { account } = useActiveWeb3React();
  const addTransaction = useTransactionAdder();
  const sushiContract = useSushiContract(true); // withSigner
  const barContract = useSushiBarContract(true); // withSigner

  const [allowance, setAllowance] = useState("0");

  const fetchAllowance = useCallback(async () => {
    if (account) {
      try {
        const allowance = await sushiContract?.allowance(
          account,
          barContract?.address
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
  }, [account, barContract, sushiContract]);

  useEffect(() => {
    if (account && barContract && sushiContract) {
      fetchAllowance();
    }
    const refreshInterval = setInterval(fetchAllowance, 10000);
    return () => clearInterval(refreshInterval);
  }, [account, barContract, fetchAllowance, sushiContract]);

  const approve = useCallback(async () => {
    try {
      const tx = await sushiContract?.approve(
        barContract?.address,
        ethers.constants.MaxUint256.toString()
      );
      return addTransaction(tx, { summary: "Approve" });
    } catch (e) {
      return e;
    }
  }, [addTransaction, barContract, sushiContract]);

  const enter = useCallback(
    // todo: this should be updated with BigNumber as opposed to string
    async (amount: string) => {
      try {
        const tx = await barContract?.enter(ethers.utils.parseUnits(amount));
        return addTransaction(tx, { summary: "Enter SushiBar" });
      } catch (e) {
        return e;
      }
    },
    [addTransaction, barContract]
  );

  const leave = useCallback(
    // todo: this should be updated with BigNumber as opposed to string
    async (amount: string) => {
      try {
        const tx = await barContract?.leave(ethers.utils.parseUnits(amount));
        return addTransaction(tx, { summary: "Leave SushiBar" });
      } catch (e) {
        console.error(e);
        return e;
      }
    },
    [addTransaction, barContract]
  );

  return { allowance, approve, enter, leave };
};

export default useSushiBar;
