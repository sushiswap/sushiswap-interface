import { ChainId } from "@sushiswap/sdk";

const Arbitrum = "/images/networks/arbitrum-network.jpg";
const Avalanche = "/images/networks/avalanche-network.jpg";
const Bsc = "/images/networks/bsc-network.jpg";
const Fantom = "/images/networks/fantom-network.jpg";
const Goerli = "/images/networks/goerli-network.jpg";
const Harmony = "/images/networks/harmonyone-network.jpg";
const Heco = "/images/networks/heco-network.jpg";
const Kovan = "/images/networks/kovan-network.jpg";
const Mainnet = "/images/networks/mainnet-network.jpg";
const Matic = "/images/networks/matic-network.jpg";
const Moonbeam = "/images/networks/moonbeam-network.jpg";
const OKEx = "/images/networks/okex-network.jpg";
const Polygon = "/images/networks/polygon-network.jpg";
const Rinkeby = "/images/networks/rinkeby-network.jpg";
const Ropsten = "/images/networks/ropsten-network.jpg";
const xDai = "/images/networks/xdai-network.jpg";
const Celo = "/images/networks/celo-network.jpg";
export const NETWORK_ICON = {
  [ChainId.MAINNET]: Mainnet,
  [ChainId.ROPSTEN]: Ropsten,
  [ChainId.RINKEBY]: Rinkeby,
  [ChainId.GÖRLI]: Goerli,
  [ChainId.KOVAN]: Kovan,
  [ChainId.FANTOM]: Fantom,
  [ChainId.FANTOM_TESTNET]: Fantom,
  [ChainId.BSC]: Bsc,
  [ChainId.BSC_TESTNET]: Bsc,
  [ChainId.MATIC]: Polygon,
  [ChainId.MATIC_TESTNET]: Matic,
  [ChainId.XDAI]: xDai,
  [ChainId.ARBITRUM]: Arbitrum,
  [ChainId.ARBITRUM_TESTNET]: Arbitrum,
  [ChainId.MOONBEAM_TESTNET]: Moonbeam,
  [ChainId.AVALANCHE]: Avalanche,
  [ChainId.AVALANCHE_TESTNET]: Avalanche,
  [ChainId.HECO]: Heco,
  [ChainId.HECO_TESTNET]: Heco,
  [ChainId.HARMONY]: Harmony,
  [ChainId.HARMONY_TESTNET]: Harmony,
  [ChainId.OKEX]: OKEx,
  [ChainId.OKEX_TESTNET]: OKEx,
  [ChainId.CELO]: Celo,
};

export const NETWORK_LABEL: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: "Ethereum",
  [ChainId.RINKEBY]: "Rinkeby",
  [ChainId.ROPSTEN]: "Ropsten",
  [ChainId.GÖRLI]: "Görli",
  [ChainId.KOVAN]: "Kovan",
  [ChainId.FANTOM]: "Fantom",
  [ChainId.FANTOM_TESTNET]: "Fantom Testnet",
  [ChainId.MATIC]: "Polygon (Matic)",
  [ChainId.MATIC_TESTNET]: "Matic Testnet",
  [ChainId.XDAI]: "xDai",
  [ChainId.ARBITRUM]: "Arbitrum",
  [ChainId.ARBITRUM_TESTNET]: "Arbitrum Testnet",
  [ChainId.BSC]: "BSC",
  [ChainId.BSC_TESTNET]: "BSC Testnet",
  [ChainId.MOONBEAM_TESTNET]: "Moonbase",
  [ChainId.AVALANCHE]: "Avalanche",
  [ChainId.AVALANCHE_TESTNET]: "Fuji",
  [ChainId.HECO]: "HECO",
  [ChainId.HECO_TESTNET]: "HECO Testnet",
  [ChainId.HARMONY]: "Harmony",
  [ChainId.HARMONY_TESTNET]: "Harmony Testnet",
  [ChainId.OKEX]: "OKEx",
  [ChainId.OKEX_TESTNET]: "OKEx",
  [ChainId.CELO]: "Celo",
};
