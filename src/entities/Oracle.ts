import {
  CHAINLINK_ORACLE_ADDRESS,
  SUSHISWAP_TWAP_0_ORACLE_ADDRESS,
  SUSHISWAP_TWAP_1_ORACLE_ADDRESS,
} from "../constants/kashi";
import { ChainId, Token } from "@sushiswap/sdk";

import { CHAINLINK_MAPPING } from "../constants/chainlink";
import { e10 } from "../functions/math";
import { ethers } from "ethers";

export interface IOracle {
  address: string;
  name: string;
  data: string;
  warning: string;
  error: string;
  readonly valid: boolean;
}

export default class Oracle implements IOracle {
  public address = "";
  public name = "None";
  public data = "";
  public warning = "";
  public error = "";
  protected _chainId = ChainId.MAINNET;
  protected _pair: any;
  protected tokens: Token[];

  constructor(pair: any, chainId: ChainId, tokens?: Token[]) {
    this.address = pair.oracle;
    this.data = pair.oracleData;
    this._pair = pair;
    this._chainId = chainId;
    this.tokens = tokens;
  }

  get valid(): boolean {
    return false;
  }
}

export class SushiSwapTWAP0Oracle extends Oracle {
  constructor(pair: any, chainId: ChainId, tokens?: Token[]) {
    super(pair, chainId, tokens);
    this.name = "SushiSwap";
  }
  get valid(): boolean {
    return true;
  }
}

export class SushiSwapTWAP1Oracle extends Oracle {
  constructor(pair: any, chainId: ChainId, tokens?: Token[]) {
    super(pair, chainId, tokens);
    this.name = "SushiSwap";
  }
  get valid(): boolean {
    return true;
  }
}

export class ChainlinkOracle extends Oracle {
  private _valid = false;

  constructor(pair: any, chainId: ChainId, tokens?: Token[]) {
    super(pair, chainId, tokens);
    this.name = "Chainlink";
    this._valid = this._validate();
  }

  get valid(): boolean {
    return this._valid;
  }

  private _validate() {
    const mapping = CHAINLINK_MAPPING[this._chainId];
    if (!mapping) {
      return false;
    }
    const params = ethers.utils.defaultAbiCoder.decode(
      ["address", "address", "uint256"],
      this.data
    );
    let decimals = 54;
    let from = "";
    let to = "";
    if (params[0] !== ethers.constants.AddressZero) {
      if (!mapping![params[0]]) {
        this.error =
          "One of the Chainlink oracles used is not configured in this UI.";
        return false;
      } else {
        decimals -= 18 - mapping![params[0]].decimals;
        from = mapping![params[0]].from;
        to = mapping![params[0]].to;
      }
    }
    if (params[1] !== ethers.constants.AddressZero) {
      if (!mapping![params[1]]) {
        this.error =
          "One of the Chainlink oracles used is not configured in this UI.";
        return false;
      } else {
        decimals -= mapping![params[1]].decimals;
        if (!to) {
          from = mapping![params[1]].to;
          to = mapping![params[1]].from;
        } else if (to === mapping![params[1]].to) {
          to = mapping![params[1]].from;
        } else {
          this.error =
            "The Chainlink oracles used don't match up with eachother. If 2 oracles are used, they should have a common token, such as WBTC/ETH and LINK/ETH, where ETH is the common link.";
          return false;
        }
      }
    }
    if (
      from === this._pair.assetAddress &&
      to === this._pair.collateralAddress &&
      this.tokens[this._pair.collateralAddress] &&
      this.tokens[this._pair.assetAddress]
    ) {
      const needed =
        this.tokens[this._pair.collateralAddress].decimals +
        18 -
        this.tokens[this._pair.assetAddress].decimals;
      const divider = e10(decimals - needed);
      if (!divider.eq(params[2])) {
        this.error =
          "The divider parameter is misconfigured for this oracle, which leads to rates that are order(s) of magnitude wrong.";
        return false;
      } else {
        return true;
      }
    } else {
      this.error =
        "The Chainlink oracles configured don't match the pair tokens.";
      return false;
    }
  }
}

function lowerEqual(value1: string, value2: string) {
  return value1.toLowerCase() === value2.toLowerCase();
}

export function getOracle(pair: any, chainId: ChainId, tokens: any): IOracle {
  if (lowerEqual(pair.oracle, CHAINLINK_ORACLE_ADDRESS)) {
    return new ChainlinkOracle(pair, chainId, tokens);
  } else if (pair.oracle === SUSHISWAP_TWAP_0_ORACLE_ADDRESS) {
    return new SushiSwapTWAP0Oracle(pair, chainId, tokens);
  } else if (pair.oracle === SUSHISWAP_TWAP_1_ORACLE_ADDRESS) {
    return new SushiSwapTWAP1Oracle(pair, chainId, tokens);
  } else {
    return new Oracle(pair, chainId, tokens);
  }
}
