# Sushiswap Interface
[![Styled With Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)

An open source interface for Sushiswap -- a protocol for decentralized exchange of Ethereum tokens.

- Website: [sushiswap.fi](https://sushiswap.fi/)
- Interface: [app.sushiswap.fi](https://app.sushiswap.fi)
- Docs: [sushiswap.gitbook.io](https://sushiswap.gitbook.io)
- Twitter: [@SushiSwap](https://twitter.com/sushiswap)
- Reddit: [/r/SushiSwap](https://www.reddit.com/r/SushiSwap)
- Discord: [Sushiswap](https://discord.gg/Y7TF6QA)

## Accessing the Sushiswap Interface

To access the Sushiswap Interface, use an IPFS gateway link from the
[latest release](https://github.com/sushiswap/sushiswap-interface/releases/latest), 
or visit [app.sushiswap.fi](https://app.sushiswap.fi).

## Listing a token

Please see the
[@uniswap/default-token-list](https://github.com/uniswap/default-token-list) 
repository.

## Development

### Install Dependencies

```bash
yarn
```

### Run

```bash
yarn start
```

### Configuring the environment (optional)

To have the interface default to a different network when a wallet is not connected:

1. Make a copy of `.env` named `.env.local`
2. Change `REACT_APP_NETWORK_ID` to `"{YOUR_NETWORK_ID}"`
3. Change `REACT_APP_NETWORK_URL` to e.g. `"https://{YOUR_NETWORK_ID}.infura.io/v3/{YOUR_INFURA_KEY}"` 

Note that the interface only works on testnets where both 
[(Uni|Sushi)swap V2](https://github.com/sushiswap/sushiswap/tree/master/contracts/uniswapv2) and 
[multicall](https://github.com/makerdao/multicall) are deployed.
The interface will not work on other networks.

## Contributions

**Please open all pull requests against the `master` branch.** 
CI checks will run against all PRs.
