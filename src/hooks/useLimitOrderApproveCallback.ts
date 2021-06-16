import { useActiveWeb3React } from "./useActiveWeb3React";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useBentoBoxContract } from "./useContract";
import { useBentoMasterContractAllowed } from "../state/bentobox/hooks";
import { ethers } from "ethers";
import {
  useDerivedLimitOrderInfo,
  useLimitOrderApprovalPending,
  useLimitOrderState,
} from "../state/limit-order/hooks";
import { useDispatch } from "react-redux";
import { setLimitOrderApprovalPending } from "../state/limit-order/actions";
import { useTransactionAdder } from "../state/transactions/hooks";
import { Currency, CurrencyAmount, Token, WETH } from "@sushiswap/sdk";
import {
  getVerifyingContract,
  getSignatureWithProviderBentobox,
} from "limitorderv2-sdk";
import { Field } from "../state/swap/actions";
import { e10, toShare, ZERO } from "../functions";
import { BigNumber } from "@ethersproject/bignumber";
import JSBI from "jsbi";
import { parseUnits } from "@ethersproject/units";

export enum BentoApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  FAILED,
  APPROVED,
}

export enum BentoApproveOutcome {
  SUCCESS,
  REJECTED,
  FAILED,
  NOT_READY,
}

const useLimitOrderApproveCallback = () => {
  const { account, library, chainId } = useActiveWeb3React();
  const dispatch = useDispatch();

  const { fromBentoBalance } = useLimitOrderState();
  const { parsedAmounts } = useDerivedLimitOrderInfo();
  const [fallback, setFallback] = useState(false);
  const [limitOrderPermit, setLimitOrderPermit] = useState(undefined);

  useEffect(() => {
    setLimitOrderPermit(undefined);
  }, [account, chainId]);

  const masterContract = chainId && getVerifyingContract(chainId);

  const pendingApproval = useLimitOrderApprovalPending();
  const currentAllowed = useBentoMasterContractAllowed(
    masterContract,
    account || ethers.constants.AddressZero
  );
  const addTransaction = useTransactionAdder();

  // check the current approval status
  const approvalState: BentoApprovalState = useMemo(() => {
    if (!masterContract) return BentoApprovalState.UNKNOWN;
    if (!currentAllowed && pendingApproval) return BentoApprovalState.PENDING;

    return currentAllowed
      ? BentoApprovalState.APPROVED
      : BentoApprovalState.NOT_APPROVED;
  }, [masterContract, currentAllowed, pendingApproval]);

  const bentoBoxContract = useBentoBoxContract();

  const approve = useCallback(async () => {
    if (approvalState !== BentoApprovalState.NOT_APPROVED) {
      console.error("approve was called unnecessarily");
      return { outcome: BentoApproveOutcome.NOT_READY };
    }
    if (!masterContract) {
      console.error("no token");
      return { outcome: BentoApproveOutcome.NOT_READY };
    }

    if (!bentoBoxContract) {
      console.error("no bentobox contract");
      return { outcome: BentoApproveOutcome.NOT_READY };
    }

    if (!account) {
      console.error("no account");
      return { outcome: BentoApproveOutcome.NOT_READY };
    }
    if (!library) {
      console.error("no library");
      return { outcome: BentoApproveOutcome.NOT_READY };
    }

    try {
      const nonce = await bentoBoxContract?.nonces(account);
      const { v, r, s } = await getSignatureWithProviderBentobox(
        {
          warning: "Give FULL access to funds in (and approved to) BentoBox?",
          user: account,
          masterContract,
          approved: true,
          nonce: nonce.toString(),
        },
        chainId,
        library
      );

      return {
        outcome: BentoApproveOutcome.SUCCESS,
        data: bentoBoxContract?.interface?.encodeFunctionData(
          "setMasterContractApproval",
          [account, masterContract, true, v, r, s]
        ),
      };
    } catch (e) {
      console.log(e);
      return {
        outcome:
          e.code === 4001
            ? BentoApproveOutcome.REJECTED
            : BentoApproveOutcome.FAILED,
      };
    }
  }, [
    approvalState,
    account,
    library,
    chainId,
    bentoBoxContract,
    masterContract,
  ]);

  const onApprove = async function () {
    if (fallback) {
      const tx = await bentoBoxContract?.setMasterContractApproval(
        account,
        masterContract,
        true,
        0,
        ethers.constants.HashZero,
        ethers.constants.HashZero
      );
      dispatch(setLimitOrderApprovalPending("Approve Limit Order"));
      await tx.wait();
      dispatch(setLimitOrderApprovalPending(""));
    } else {
      const result = await approve();

      if (result.outcome === BentoApproveOutcome.SUCCESS)
        setLimitOrderPermit(result.data);
      else setFallback(true);
    }
  };

  const execute = async function (token: Token) {
    const summary = [];
    const batch = [];

    // If bento is not yet approved but we do have the permit, add the permit to the batch
    if (approvalState === BentoApprovalState.NOT_APPROVED && limitOrderPermit) {
      batch.push(limitOrderPermit);
      summary.push("Approve Limit Order");
    }

    const useNative = token.address === WETH[chainId].address;
    const amount = parsedAmounts[Field.INPUT].raw.toString();
    if (!fromBentoBalance) {
      summary.push("Deposit");
      batch.push(
        bentoBoxContract?.interface?.encodeFunctionData("deposit", [
          useNative ? ethers.constants.AddressZero : token.address,
          account,
          masterContract,
          amount,
          BigNumber.from(0),
        ])
      );
    }

    const tx = await bentoBoxContract?.batch(batch, true, {
      value: useNative && !fromBentoBalance ? amount : ZERO,
    });
    addTransaction(tx, { summary: summary.join(", ") });
    setLimitOrderPermit(undefined);
    const resp = await tx.wait();

    if (resp.success) {
      alert("hi");
    }
  };

  return [approvalState, fallback, limitOrderPermit, onApprove, execute];
};

export default useLimitOrderApproveCallback;
