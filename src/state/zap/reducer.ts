import { createReducer } from "@reduxjs/toolkit";
import { Field, resetZapState, typeInput } from "./actions";

export interface ZapState {
  readonly independentField: Field;
  readonly typedValue: string;
  readonly otherTypedValue: string; // for the case when there's no liquidity
}

const initialState: ZapState = {
  independentField: Field.CURRENCY,
  typedValue: "",
  otherTypedValue: "",
};

export default createReducer<ZapState>(initialState, (builder) =>
  builder
    .addCase(resetZapState, () => initialState)
    .addCase(
      typeInput,
      (state, { payload: { field, typedValue, noLiquidity } }) => {
        if (noLiquidity) {
          // they're typing into the field they've last typed in
          if (field === state.independentField) {
            return {
              ...state,
              independentField: field,
              typedValue,
            };
          }
          // they're typing into a new field, store the other value
          else {
            return {
              ...state,
              independentField: field,
              typedValue,
              otherTypedValue: state.typedValue,
            };
          }
        } else {
          return {
            ...state,
            independentField: field,
            typedValue,
            otherTypedValue: "",
          };
        }
      }
    )
);
