import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useMeowshiContract,
  useSushiBarContract,
  useSushiContract,
} from "./useContract";

import { BalanceProps } from "./useTokenBalance";
import Fraction from "../entities/Fraction";
import { ethers } from "ethers";
import { useActiveWeb3React } from "./useActiveWeb3React";
import { useTransactionAdder } from "../state/transactions/hooks";
import { ApprovalState } from "./useApproveCallback";

const { BigNumber } = ethers;

const useMeowshi = () => {
  const { account } = useActiveWeb3React();
  const addTransaction = useTransactionAdder();
  const sushiContract = useSushiContract();
  const barContract = useSushiBarContract();
  const meowshiContract = useMeowshiContract();
  const [pendingApproval, setPendingApproval] = useState(false);

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

  const approvalState: ApprovalState = useMemo(() => {
    if (!account) return ApprovalState.UNKNOWN;
    if (allowance === "0") return ApprovalState.NOT_APPROVED;
    if (pendingApproval) return ApprovalState.PENDING;

    return ApprovalState.APPROVED;
  }, [account, allowance, pendingApproval]);

  const approve = useCallback(async () => {
    try {
      setPendingApproval(true);

      const tx = await barContract?.approve(
        meowshiContract?.address,
        ethers.constants.MaxUint256.toString()
      );

      addTransaction(tx, { summary: "Approve" });
      await tx.wait();
    } catch (e) {
      return e;
    } finally {
      setPendingApproval(false);
    }
  }, [addTransaction, meowshiContract, barContract]);

  const meow = useCallback(
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
    [account, addTransaction, meowshiContract]
  );

  const unmeow = useCallback(
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
    [account, addTransaction, meowshiContract]
  );

  const meowSushi = useCallback(
    async (amount: BalanceProps | undefined) => {
      if (amount?.value) {
        try {
          const tx = await meowshiContract?.meowSushi(account, amount?.value);
          return addTransaction(tx, { summary: "Enter Meowshi" });
        } catch (e) {
          return e;
        }
      }
    },
    [account, addTransaction, meowshiContract]
  );

  const unmeowSushi = useCallback(
    async (amount: BalanceProps | undefined) => {
      if (amount?.value) {
        try {
          const tx = await meowshiContract?.unmeowSushi(account, amount?.value);
          return addTransaction(tx, { summary: "Leave Meowshi" });
        } catch (e) {
          return e;
        }
      }
    },
    [account, addTransaction, meowshiContract]
  );

  return {
    approvalState,
    approve,
    meow,
    unmeow,
    meowSushi,
    unmeowSushi,
  };
};

export default useMeowshi;
