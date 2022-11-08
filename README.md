# FigSwap

TO USE:

Clone the sdk repo right next to the figswap repo.
add the dependencies to the figswap package.json
`yarn add @sdk:../sdk/<path to the sdk you need to use>

You need to connect a Metmask wallet to a wallaby account first to use the app without erroring out.

You need to have Flask installed. Error handling for it being missing isn't implemented

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

`#MetamaskOnly`: Designates where a line has been deprecated or changed due to deprecating unused code for the demo

`#WallabyOnly`: Designates where a line supporting chains other than Wallaby has been deprecated and commented out

Ongoing TODOs:

- [ ] `#FilecoinManinnet` Where Implementation of Filecoin is required for Production
- [ ] `#SdkPublish` Where imports to any sdk needs to updated with published version
- [ ] If you switch from Wallaby to another network, the app will trigger an error at src/components/Web3ReactManager/index.tsx:40
- [ ] #FlaskOnly: You can only work with Flask installed
