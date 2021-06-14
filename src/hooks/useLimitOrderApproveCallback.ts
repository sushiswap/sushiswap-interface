import { useActiveWeb3React } from "./useActiveWeb3React";
import { LIMIT_ORDER_ADDRESS } from "../constants/limit-order";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useBentoBoxContract } from "./useContract";
import {
  BentoApprovalState,
  BentoApproveOutcome,
  BentoApproveResult,
  KashiPermit,
} from "./useKashiApproveCallback";
import { useBentoMasterContractAllowed } from "../state/bentobox/hooks";
import { ethers } from "ethers";
import { useLimitOrderApprovalPending } from "../state/limit-order/hooks";
import { useDispatch } from "react-redux";
import { setLimitOrderApprovalPending } from "../state/limit-order/actions";
import LimitOrderCooker, {
  signMasterContractApproval,
} from "../entities/LimitOrderCooker";
import { useTransactionAdder } from "../state/transactions/hooks";
import { Token } from "@sushiswap/sdk";

export interface LimitOrderPermit {
  account: string;
  masterContract: string;
  v: number;
  r: string;
  s: string;
}

const useLimitOrderApproveCallback = () => {
  const { account, library, chainId } = useActiveWeb3React();
  const dispatch = useDispatch();

  const [approveLimitOrderFallback, setApproveLimitOrderFallback] =
    useState<boolean>(false);
  const [limitOrderPermit, setLimitOrderPermit] = useState<
    LimitOrderPermit | undefined
  >(undefined);

  useEffect(() => {
    setLimitOrderPermit(undefined);
  }, [account, chainId]);

  const masterContract = chainId && LIMIT_ORDER_ADDRESS[chainId];

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

  const approve = useCallback(async (): Promise<BentoApproveResult> => {
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
      const signature = await signMasterContractApproval(
        bentoBoxContract,
        masterContract,
        account,
        library,
        true,
        chainId
      );
      const { v, r, s } = ethers.utils.splitSignature(signature);
      return {
        outcome: BentoApproveOutcome.SUCCESS,
        permit: { account, masterContract, v, r, s },
      };
    } catch (e) {
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
    if (!approveLimitOrderFallback) {
      const result = await approve();
      if (result.outcome === BentoApproveOutcome.SUCCESS) {
        setLimitOrderPermit(result.permit);
      } else if (result.outcome === BentoApproveOutcome.FAILED) {
        setApproveLimitOrderFallback(true);
      }
    } else {
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
    }
  };

  const execute = async function (
    token: Token,
    handler: (cooker: LimitOrderCooker) => Promise<string>
  ) {
    const cooker = new LimitOrderCooker(token, account, library, chainId);
    let summary;
    if (approvalState === BentoApprovalState.NOT_APPROVED && limitOrderPermit) {
      cooker.approve(limitOrderPermit);
      summary = `Approve Limit Order and ${await handler(cooker)}`;
    } else {
      summary = await handler(cooker);
    }
    const result = await cooker.cook();
    if (result.success) {
      addTransaction(result.tx, { summary });
      setLimitOrderPermit(undefined);
      await result.tx.wait();
    }
  };

  return [
    approvalState,
    approveLimitOrderFallback,
    limitOrderPermit,
    onApprove,
    execute,
  ];
};

export default useLimitOrderApproveCallback;
