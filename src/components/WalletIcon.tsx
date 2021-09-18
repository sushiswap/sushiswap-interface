import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

const WalletAvatar = ({ account }: { account: string }) => (
  <Jazzicon diameter={25} seed={jsNumberForAddress(account ?? '0x0')} />
);
export default WalletAvatar;
