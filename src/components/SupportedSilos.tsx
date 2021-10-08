import { useWeb3React } from '@web3-react/core';
import { SupportedChainId } from '../constants/chains';
import { SUPPORTED_NETWORKS } from '../modals/NetworkModal';

//TODO: Output based on chainId
const SupportedSilos = () => {
  const { chainId } = useWeb3React();

  if (chainId === SupportedChainId.KOVAN)
    return (
      <div className="text-xs col-span-2 mt-6">
        <p className="font-semibold">kovan supported assets</p>
        <p className="ml-2">link: 0xa36085f69e2889c224210f603d836748e7dc0088</p>
        <p className="ml-2">uni: 0x1f9840a85d5af5bf1d1762f925bdaddc4201f984</p>
      </div>
    );

  if (chainId === SupportedChainId.MATIC)
    return (
      <div className="text-xs col-span-2 mt-6">
        <p className="font-semibold">kovan supported assets</p>
        <p className="ml-2">link: 0xa36085f69e2889c224210f603d836748e7dc0088</p>
        <p className="ml-2">uni: 0x1f9840a85d5af5bf1d1762f925bdaddc4201f984</p>
      </div>
    );

  if (chainId === SupportedChainId.MATIC)
    return (
      <div className="text-xs col-span-2 mt-6">
        <p className="font-semibold">kovan supported assets</p>
        <p className="ml-2">link: 0xb0897686c545045afc77cf20ec7a532e3120e0f1</p>
        <p className="ml-2">uni: 0xb33eaad8d922b1083446dc23f610c2567fb5180f</p>
      </div>
    );

  return null;
};

export default SupportedSilos;
