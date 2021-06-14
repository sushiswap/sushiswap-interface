import { createAction } from "@reduxjs/toolkit";

export enum Field {
  POOL = "POOL",
  CURRENCY = "CURRENCY",
}

export const typeInput =
  createAction<{ field: Field; typedValue: string; noLiquidity: boolean }>(
    "zap/typeInputZap"
  );
export const resetZapState = createAction<void>("zap/resetZapState");
