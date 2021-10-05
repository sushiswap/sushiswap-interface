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
        <p className="ml-2">aave: 0xb597cd8d3217ea6477232f9217fa70837ff667af</p>
        <p className="ml-2">uni: 0x1f9840a85d5af5bf1d1762f925bdaddc4201f984</p>
      </div>
    );

  return null;
};

export default SupportedSilos;
