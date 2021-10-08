export type SiloInfo = {
  lastUpdateTimestamp?: string;
  totalDeposits?: string;
  totalBorrowShare?: string;
  totalBorrowAmount?: string;
  interestRate?: string;
  protocolFees?: string;
  liquidity?: string;
};

export type SiloUserInfo = {
  address?: string;
  // isSolvent?: string;
  // collaterilizationLevel?: string;
  // debtLevel?: string;
  underlyingBalance?: string;
  underlyingBridgeBalance?: string;
};

// SiloRouter.Posistion (struct)
export type SiloRouterPosistion = {
  collateral?: string; // address - what do you use for collateral
  borrow?: string; // address - what do you want to borrow
  ethSilo?: string; // address - where to deposit ETH if used as collateral
  depositAmount?: string; // uint256 - amount to collateral
  borrowAmount?: string; // uint256 - amount to borrow
};
