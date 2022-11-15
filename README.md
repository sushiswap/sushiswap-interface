# FigSwap

TO USE:

Clone the sdk repo right next to the figswap repo.
add the dependencies to the figswap package.json
`yarn add @sdk:../sdk/<path to the sdk you need to use>

You need to connect a Metmask wallet to a wallaby account first to use the app without erroring out.

Issue / Change Tags:
Use and collate these to mark groups of issues / changes throughout the project.
Use them like so:

```angular2html
pattern:

// Note (<dev>): <Issue Tag> <Issue Description>
// <Deprecated / Changed line >

Example:

// Note (al): #SdkChange: Implemented interim SDK for testing
// import { ChainId } from `@sushsiswap/core-sdk`
import { ChainId } from `../sdk/core-sdk/ChainId`
```

`#SdkChange`: Designates where an SDK import has been redeclared. Should be used for experimental / interim updates to the SDK

`#MetamaskOnly`: Designates where a line has been deprecated or changed due to deprecating unused code for the demo - Note: Deprecated, but should be used to look for places where wallet functionality has been deprecated.

`#WallabyOnly`: Designates where a line supporting chains other than Wallaby has been deprecated and commented out - Should be used with #FilecoinMainnet TODO tag for guiding Mainnet implementation

Ongoing TODOs:

- [ ] `#FilecoinManinnet` Where Implementation of Filecoin is required for Production
- [ ] `#SdkPublish` Where imports to any sdk needs to updated with published version
- [ ] `#NewTokens` Implement new tokens as they are added to the SDK. First write documentation on how to do so.
- [ ] `NetworkModal` Change network modal useflow to add Wallaby network to Metamask or other Wallets if on unnsupported networks
-
