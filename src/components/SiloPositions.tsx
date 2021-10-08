import { bigNumberFormat } from '../functions';

const SiloPosistions = ({ currentSilo, currentSiloUserInfo, wrappedNative }) => (
  <div className="mt-4 mx-6 text-sm flex space-x-10 text-high-emphesis">
    <div className="text-low-emphesis">positions: </div>
    <div>
      {currentSilo.symbol}: {bigNumberFormat(currentSiloUserInfo.underlyingBalance.toString())}
    </div>
    <div>
      silo{wrappedNative.symbol}: {bigNumberFormat(currentSiloUserInfo.underlyingBridgeBalance.toString())}
    </div>
  </div>
);

export default SiloPosistions;
