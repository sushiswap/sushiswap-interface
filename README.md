# FigSwap

TO USE:

Clone the sdk repo right next to the figswap repo.
add the dependencies to the figswap package.json
`yarn add @sdk:../sdk/<path to the sdk you need to use>

Issue / Change Tags:
Use and collate these to mark groups of issues / changes throughout the project.
Use them like so:

Demo Feature Roadmap (by priority):

1. Get wrapping and unwrapping working. (done)
2. Get liquidity adding and removing working. (Not started. Relies on working Liquidity Factory)
3. Get swaps working. Relies on 1 and 2. (Research In progress. Relies on Liquidity adding and removing).
4. Multicaller (Done)
5. If this works we can deploy SDK and change interface to use it.

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

Backend TODOs and Tags:

- [ ] `#FilecoinManinnet` Where Implementation of Filecoin is required for Production
- [ ] `#SdkPublish` Where imports to any sdk needs to updated with published version
- [ ] `#Contributing` Write up documentation for contributing to the project (Mininmum specs for implementing different features on different chains, Adding new chains, tokens, etc)

Front End TODOs and Tags:

- [ ] `#NetworkModal` Change login userflow to match Vitaly's designs (open intermediary modal to hide page, deprecate wrong network modal, add disconnect to bottom of sidebar)
- [ ] `#LogoBanner` Implement a re-sizable logo banner for the top of the page / sidebar
- [ ] `#AccountButtons` Change account info buttons to match Vitaly's designs
- [ ] `#SideBar` Change sidebar to match Vitaly's designs (Logo, spacing, account info, etc)
- [ ] `#MobileHeaderReady` Implement folding header that renders based on useDesktopMediaQuery
- [ ] `#Footer` Implement footer that renders based at +100vh
- [ ] `SwapSettingsAnimation` Implement animation for swap settings
- [ ] `#Copy` Copy changes to make disclaimers / branding more accurate / better
