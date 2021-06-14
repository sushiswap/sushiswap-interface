import { ChainId, JSBI, TokenAmount } from "@sushiswap/sdk";
import { Chef, PairType } from "./enum";
import {
  NEVER_RELOAD,
  useSingleCallResult,
  useSingleContractMultipleData,
} from "../../state/multicall/hooks";
import {
  useMasterChefContract,
  useMasterChefV2Contract,
  useMiniChefV2Contract,
} from "../../hooks";

import { Contract } from "@ethersproject/contracts";
import { SUSHI } from "../../constants";
import { Zero } from "@ethersproject/constants";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useMemo } from "react";
import zip from "lodash/zip";

export function useChefContract(chef: Chef) {
  const masterChefContract = useMasterChefContract();
  const masterChefV2Contract = useMasterChefV2Contract();
  const miniChefContract = useMiniChefV2Contract();
  const contracts = useMemo(
    () => ({
      [Chef.MASTERCHEF]: masterChefContract,
      [Chef.MASTERCHEF_V2]: masterChefV2Contract,
      [Chef.MINICHEF]: miniChefContract,
    }),
    [masterChefContract, masterChefV2Contract, miniChefContract]
  );
  return useMemo(() => contracts[chef], [contracts, chef]);
}

const CHEFS = {
  [ChainId.MAINNET]: [Chef.MASTERCHEF, Chef.MASTERCHEF_V2],
  [ChainId.MATIC]: [Chef.MINICHEF],
};

export function useChefContracts(chefs: Chef[]) {
  const masterChefContract = useMasterChefContract();
  const masterChefV2Contract = useMasterChefV2Contract();
  const miniChefContract = useMiniChefV2Contract();
  const contracts = useMemo(
    () => ({
      [Chef.MASTERCHEF]: masterChefContract,
      [Chef.MASTERCHEF_V2]: masterChefV2Contract,
      [Chef.MINICHEF]: miniChefContract,
    }),
    [masterChefContract, masterChefV2Contract, miniChefContract]
  );
  return chefs.map((chef) => contracts[chef]);
}

export function useUserInfo(farm, token) {
  const { account } = useActiveWeb3React();

  const contract = useChefContract(farm.chef);

  const args = useMemo(() => {
    if (!account || !farm) {
      return;
    }
    return [String(farm.id), String(account)];
  }, [farm, account]);

  const result = useSingleCallResult(
    args ? contract : null,
    "userInfo",
    args
  )?.result;

  const value = result?.[0];

  const amount = value ? JSBI.BigInt(value.toString()) : undefined;

  return amount ? new TokenAmount(token, amount) : undefined;
}

export function usePendingSushi(farm) {
  const { account, chainId } = useActiveWeb3React();

  const contract = useChefContract(farm.chef);

  const args = useMemo(() => {
    if (!account || !farm) {
      return;
    }
    return [String(farm.id), String(account)];
  }, [farm, account]);

  const result = useSingleCallResult(
    args ? contract : null,
    "pendingSushi",
    args
  )?.result;

  const value = result?.[0];

  const amount = value ? JSBI.BigInt(value.toString()) : undefined;

  return amount ? new TokenAmount(SUSHI[chainId], amount) : undefined;
}

export function usePendingToken(farm, contract) {
  const { account } = useActiveWeb3React();

  const args = useMemo(() => {
    if (!account || !farm) {
      return;
    }
    return [String(farm.pid), String(account)];
  }, [farm, account]);

  const pendingTokens = useSingleContractMultipleData(
    args ? contract : null,
    "pendingTokens",
    args.map((arg) => [...arg, "0"])
  );

  return useMemo(() => pendingTokens, [pendingTokens]);
}

export function usePositions(
  contract?: Contract | null,
  rewarder?: Contract | null
) {
  const { chainId, account } = useActiveWeb3React();

  const numberOfPools = useSingleCallResult(
    contract ? contract : null,
    "poolLength",
    undefined,
    NEVER_RELOAD
  )?.result?.[0];

  const args = useMemo(() => {
    if (!account || !numberOfPools) {
      return;
    }
    return [...Array(numberOfPools.toNumber()).keys()].map((pid) => [
      String(pid),
      String(account),
    ]);
  }, [numberOfPools, account]);

  const pendingSushi = useSingleContractMultipleData(
    args ? contract : null,
    "pendingSushi",
    args
  );

  const userInfo = useSingleContractMultipleData(
    args ? contract : null,
    "userInfo",
    args
  );

  // const pendingTokens = useSingleContractMultipleData(
  //     rewarder,
  //     'pendingTokens',
  //     args.map((arg) => [...arg, '0'])
  // )

  return useMemo(
    () =>
      zip(pendingSushi, userInfo)
        .map((data, i) => ({
          id: args[i][0],
          pendingSushi: data[0].result?.[0] || Zero,
          amount: data[1].result?.[0] || Zero,
          // pendingTokens: data?.[2]?.result,
        }))
        .filter(({ pendingSushi, amount }) => {
          return (
            (pendingSushi && !pendingSushi.isZero()) ||
            (amount && !amount.isZero())
          );
        }),
    [pendingSushi, userInfo]
  );
}
