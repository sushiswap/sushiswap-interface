import React, { useCallback, useEffect, useState } from 'react';
import Container from '../../components/Container';
import { APP_NAME_URL, APP_SHORT_BLURB } from '../../constants';
import Head from 'next/head';
import Button from '../../components/Button';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import useSiloMarkets, { SiloMarket } from '../../hooks/useSiloMarkets';
import { useTransactionAdder } from '../../state/transactions/hooks';
import useTokenSetup from '../../hooks/useTokenSetup';
import { useActiveWeb3React, useApproveCallback } from '../../hooks';
import { Field } from '../../state/swap/actions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import SupportedSilos from '../../components/SupportedSilos';
import { tryParseAmountToString } from '../../functions';
import { useSiloBridgePoolContract, useSiloContract, useTokenContract } from '../../hooks/useContract';
import { WNATIVE } from '@sushiswap/sdk';
import JSBI from 'jsbi';
import { BigNumber, ethers } from 'ethers';

type SiloInfo = {
  lastUpdateTimestamp?: string;
  totalDeposits?: string;
  totalBorrowShare?: string;
  totalBorrowAmount?: string;
  interestRate?: string;
  protocolFees?: string;
  liquidity?: string;
};

type SiloUserInfo = {
  address?: string;
  // isSolvent?: string;
  // collaterilizationLevel?: string;
  // debtLevel?: string;
  underlyingBalance?: string;
  underlyingBridgeBalance?: string;
};

const bigNumberFormat = (valueStr: string) => {
  const value = BigNumber.from(valueStr);
  return ethers.utils.formatEther(value);
};

export default function Lending() {
  const {
    independentField,
    showWrap,
    formattedAmounts,
    showMaxButton,
    currencies,
    handleTypeInput,
    handleMaxInput,
    fiatValueInput,
    handleInputSelect,
  } = useTokenSetup();

  const { createSiloMarket, tokenInSilo, currentSilo } = useSiloMarkets();
  const addTransaction = useTransactionAdder();
  const { chainId, library, account } = useActiveWeb3React();
  const { i18n } = useLingui();
  const selected: any = currencies[Field.INPUT];
  const tokenAddress = selected?.address;
  const amount = formattedAmounts.INPUT;
  const siloBridgePool = useSiloBridgePoolContract(true);
  const tokenContract = useTokenContract(currentSilo && currentSilo.assetAddress, true);
  const siloContract = useSiloContract(currentSilo && currentSilo.address, true);
  // const siloAssetContract = useTokenContract(currentSilo && currentSilo.address, true);

  // const [approvalState, approve] = useApproveCallback(amount, currentSilo && currentSilo.address);
  const wrappedNative = WNATIVE[chainId];
  const nativeTokenContract = useTokenContract(wrappedNative.address, true);
  const [currentSiloInfo, setCurrentSiloInfo] = useState<SiloInfo | null>(null);
  const [currentSiloUserInfo, setCurrentSiloUserInfo] = useState<SiloUserInfo | null>(null);

  // if a token is selected, lets check if in a silo, and set the current silo
  useEffect(() => {
    if (tokenAddress) tokenInSilo(tokenAddress);
  }, [tokenAddress, tokenInSilo]);

  // uint256 public lastUpdateTimestamp;
  // uint256 public totalDeposits;
  // uint256 public totalBorrowShare;
  // uint256 public totalBorrowAmount;
  // uint256 public interestRate;
  // uint256 public protocolFees;

  //TODO: batch this with promise.all() or use lib to batch
  //TODO: should pull stale'ish values from the graph, then after interval fetch to be efficent
  //      or graph values are always up to date
  // for the current silo, pickup the current contract data values
  const fetchCurrentSiloData = useCallback(async () => {
    const siloInfo: SiloInfo = {};
    siloInfo.lastUpdateTimestamp = await siloContract.lastUpdateTimestamp();
    siloInfo.interestRate = await siloContract.interestRate();
    siloInfo.protocolFees = await siloContract.protocolFees();
    siloInfo.totalBorrowAmount = await siloContract.totalBorrowAmount();
    siloInfo.totalBorrowShare = await siloContract.totalBorrowShare();
    siloInfo.totalDeposits = await siloContract.totalDeposits();
    siloInfo.liquidity = await siloContract.liquidity();
    setCurrentSiloInfo(siloInfo);
  }, [siloContract]);

  //   function isSolvent(address _user) public override returns (bool) {
  //   /// @ev ratio between value borrowed by user in this silo to collateral value provided in bridge pool for this silo
  //   function getCollateralization(address _user) public returns (uint256) {
  //   /// @dev value of collateral (asset) provided by user
  //   function getCollateralValue(address _user) public override returns (uint256)
  //   /// @dev value of asset borrowed by user
  //   function getDebtValue(address _user) public returns (uint256) {

  const fetchCurrentSiloUserData = useCallback(async () => {
    if (currentSilo) {
      const userInfo: SiloUserInfo = {};
      console.log('getting current user silo data');
      console.log('user address:', account);
      userInfo.address = account;
      userInfo.underlyingBalance = await siloContract.balanceOfUnderlaying(account);
      userInfo.underlyingBridgeBalance = await siloBridgePool.balanceOfUnderlaying(currentSilo.address, account);
      // userInfo.isSolvent = await siloContract.isSolvent(account);
      // userInfo.collaterilizationLevel = await siloContract.getCollateralization(account);
      // userInfo.debtLevel = await siloContract.getDebtValue(account);
      setCurrentSiloUserInfo(userInfo);
    }
  }, [account, currentSilo, siloBridgePool, siloContract]);

  // if we have a silo, lets get the current data off the silo
  useEffect(() => {
    if (currentSilo) {
      console.log('getting silo data and silo user data');
      fetchCurrentSiloData();
      fetchCurrentSiloUserData();
    }
  }, [currentSilo, fetchCurrentSiloData, fetchCurrentSiloUserData]);

  const consoleState = () => {
    console.log('selected:', selected);
    console.log('tokenAddress:', tokenAddress);
    console.log('amount:', amount);
    console.log('parsedAmt:', parsedAmt);
    console.log('current silo:', currentSilo);
    console.log('native asset on this chain is:', wrappedNative);
  };

  const parsedAmt = amount && selected && tryParseAmountToString(amount, selected);

  // no chain, no page
  if (!chainId) return null;

  return (
    <Container id="supply-page" className="py-12 md:py-14 lg:py-16">
      <Head>
        <title>{APP_NAME_URL}</title>
        <meta key="description" name="description" content={APP_SHORT_BLURB} />
      </Head>
      <div className="p-4 pb-6 rounded-lg shadow-lg bg-dark-900 text-secondary">
        <h1 className="text-xl font-semibold">
          Deposit & Borrow in Silos <span className="text-sm font-thin ">(Isolated Markets)</span>
        </h1>

        <div className="mt-8">
          <CurrencyInputPanel
            // priceImpact={priceImpact}
            label={independentField === Field.OUTPUT && !showWrap ? i18n._(t`Select Silo:`) : i18n._(t`Select Silo:`)}
            value={formattedAmounts[Field.INPUT]}
            showMaxButton={showMaxButton}
            currency={currencies[Field.INPUT]}
            onUserInput={handleTypeInput}
            onMax={handleMaxInput}
            fiatValue={fiatValueInput ?? undefined}
            onCurrencySelect={handleInputSelect}
            otherCurrency={currencies[Field.OUTPUT]}
            showCommonBases={true}
            id="swap-currency-input"
            hideBalance={false}
            hideInput={false}
          />
        </div>
        {currentSilo && currentSiloUserInfo && (
          <>
            <div className="mt-4 mx-6 text-sm flex space-x-10 text-high-emphesis">
              <div className="text-low-emphesis">positions: </div>
              <div>
                {currentSilo.symbol}: {bigNumberFormat(currentSiloUserInfo.underlyingBalance.toString())}
              </div>
              <div>
                silo{wrappedNative.symbol}: {bigNumberFormat(currentSiloUserInfo.underlyingBridgeBalance.toString())}
              </div>
            </div>

            <div className="flex space-x-2 mt-8 mb-4 ml-5">
              <Button
                type="button"
                color="gray"
                variant="outlined"
                onClick={async () => {
                  console.log('Silo.approve()');

                  if (tokenAddress && currentSilo && amount) {
                    const result = await tokenContract.approve(currentSilo.address, parsedAmt);
                  } else {
                    console.warn('no current silo');
                  }
                }}
              >
                Approve
              </Button>

              <Button
                color="darkindigo"
                type="button"
                onClick={async () => {
                  console.log('Silo.deposit.deposit()');

                  if (tokenAddress && currentSilo && amount) {
                    consoleState();
                    const result = await siloContract.deposit(parsedAmt);

                    addTransaction(result, {
                      summary: `Deposit ${amount} ${selected.symbol} into ${currentSilo.name}`,
                    });
                  } else {
                    console.warn('no current silo');
                  }
                }}
              >
                Deposit {selected && selected?.symbol}
              </Button>
              <Button
                type="button"
                color="gray"
                onClick={async () => {
                  console.log('Silo.deposit.withdraw()');

                  // have a token address, and this token address exists in a silo
                  if (tokenAddress && currentSilo && amount) {
                    consoleState();

                    const result = await siloContract.withdraw(parsedAmt);

                    addTransaction(result, {
                      summary: `Withdraw ${amount} ${selected.symbol} from ${currentSilo.name}`,
                    });
                  }
                }}
              >
                Withdraw {selected && selected?.symbol}
              </Button>
            </div>

            <div className="flex space-x-2 mt-2 mb-4 ml-5">
              <Button
                type="button"
                color="gray"
                variant="outlined"
                onClick={async () => {
                  console.log('SiloBridge.approve()');

                  if (wrappedNative && currentSilo && amount) {
                    const result = await nativeTokenContract.approve(siloBridgePool.address, parsedAmt);
                  } else {
                    console.warn('no current silo');
                  }
                }}
              >
                Approve
              </Button>

              <Button
                color="darkindigo"
                type="button"
                onClick={async () => {
                  console.log('Silo.deposit.borrow Eth via bridge()');

                  // have a token address, and this token address exists in a silo
                  if (tokenAddress && currentSilo && amount) {
                    consoleState();

                    try {
                      const result = await siloBridgePool.borrow(currentSilo.address, parsedAmt);

                      addTransaction(result, {
                        summary: `Borrow ${amount} ETH from ${currentSilo.name}`,
                      });
                    } catch (error) {
                      console.error(error);
                      //notify user
                    }
                  }
                }}
              >
                Borrow {wrappedNative.symbol} from Silo
              </Button>
              <Button
                type="button"
                color="gray"
                onClick={async () => {
                  console.log('Silo.deposit.repay()');

                  if (tokenAddress && currentSilo && amount) {
                    consoleState();

                    try {
                      const result = await siloBridgePool.repay(currentSilo.address, parsedAmt);

                      addTransaction(result, {
                        summary: `Repay ${amount} ETH from ${currentSilo.name}`,
                      });
                    } catch (error) {
                      console.error(error);
                      //notify user
                    }
                  }
                }}
              >
                Repay {wrappedNative.symbol} to Silo
              </Button>
            </div>

            <div className="flex space-x-2 mt-2 mb-4 ml-5">
              <Button
                type="button"
                color="gray"
                variant="outlined"
                onClick={async () => {
                  console.log('BridgePool.approve()');

                  if (tokenAddress && currentSilo && amount > 0) {
                    consoleState();
                    const result = await nativeTokenContract.approve(siloBridgePool.address, parsedAmt);
                  } else {
                    console.warn('no current silo');
                  }
                }}
              >
                Approve
              </Button>

              <Button
                color="darkindigo"
                type="button"
                onClick={async () => {
                  console.log('Silo.deposit.Bridgepool Weth via bridge()');

                  // have a token address, and this token address exists in a silo
                  if (tokenAddress && currentSilo && amount > 0) {
                    const result = await siloBridgePool.deposit(currentSilo.address, parsedAmt);
                    consoleState();

                    addTransaction(result, {
                      summary: `Deposit ${amount} ${wrappedNative.symbol} to silo ${currentSilo.name}`,
                    });
                  }
                }}
              >
                Deposit {wrappedNative.symbol} to BridgePool
              </Button>
              <Button
                type="button"
                color="gray"
                onClick={async () => {
                  console.log('Silo.nothing.yet()');

                  if (tokenAddress && currentSilo && amount) {
                    consoleState();

                    try {
                      const result = await siloBridgePool.withdraw(currentSilo.address, parsedAmt);

                      addTransaction(result, {
                        summary: `Withdraw ${amount} ${wrappedNative.symbol} from ${currentSilo.name}`,
                      });
                    } catch (error) {
                      console.error(error);
                      //notify user
                    }
                  }
                }}
              >
                Withdraw {wrappedNative.symbol} BridgePool
              </Button>
            </div>

            <div className="flex space-x-2 mt-2 mb-4 ml-5">
              <Button
                type="button"
                color="gray"
                variant="outlined"
                onClick={async () => {
                  console.log('silo.approve.siloAsset()');

                  if (tokenAddress && currentSilo && amount > 0) {
                    consoleState();
                    const result = await tokenContract.approve(currentSilo.address, parsedAmt);
                  } else {
                    console.warn('no current silo');
                  }
                }}
              >
                Approve
              </Button>

              <Button
                type="button"
                color="darkindigo"
                onClick={async () => {
                  console.log('Silo.borrow.silo()');

                  if (tokenAddress && currentSilo && amount) {
                    consoleState();

                    const result = await siloContract.borrow(parsedAmt);

                    addTransaction(result, {
                      summary: `Borrow ${amount} ${selected?.symbol} from ${currentSilo.name}`,
                    });
                  }
                }}
              >
                Borrow {selected?.symbol}
              </Button>
              <Button
                type="button"
                color="gray"
                onClick={async () => {
                  console.log('Silo.deposit.repay()');

                  if (tokenAddress && currentSilo && amount) {
                    consoleState();

                    const result = await siloContract.repay(parsedAmt);

                    addTransaction(result, {
                      summary: `Repay ${amount} ${selected?.symbol} from ${currentSilo.name}`,
                    });
                  }
                }}
              >
                Repay {selected?.symbol}
              </Button>
            </div>
          </>
        )}
      </div>

      <SiloData currentSilo={currentSilo} siloInfo={currentSiloInfo} />
      <UserSiloData currentSilo={currentSilo} siloUserInfo={currentSiloUserInfo} />

      <div className="mt-10 ml-5 text-gray-600">
        <SupportedSilos />
      </div>
    </Container>
  );
}

const SiloData = ({ currentSilo, siloInfo }: { currentSilo: SiloMarket; siloInfo: SiloInfo }) => {
  // console.log('siloInfo', siloInfo);
  const [fanOpen, setFanOpen] = useState(false);

  return (
    <Container id="supply-page" className="py-2 md:py-4 lg:py-6">
      <div className="p-4 rounded-lg shadow-lg bg-dark-900 text-secondary">
        <div className="flex justify-between">
          <h1 className="text-lg font-semibold">Silo Info</h1>
          <div>
            <Button
              color="gray"
              variant="outlined"
              onClick={() => {
                setFanOpen(!fanOpen);
              }}
            >
              ^
            </Button>
          </div>
        </div>
        {siloInfo === null && fanOpen && <p>Loading...</p>}

        {fanOpen && siloInfo && (
          <div className="grid grid-cols-2 gap-1">
            <div>silo name</div>
            <div>{currentSilo.name}</div>
            <div>silo asset</div>
            <div>{currentSilo.symbol}</div>
            <div>protocol fees</div>
            <div>{siloInfo.protocolFees.toString()}</div>
            <div>interest rate</div>
            <div>{siloInfo.interestRate.toString()}</div>
            <div>total borrow</div>
            <div>{bigNumberFormat(siloInfo.totalBorrowAmount)}</div>
            <div>total share</div>
            <div>{bigNumberFormat(siloInfo.totalBorrowShare)}</div>
            <div>liquidity</div>
            <div>{bigNumberFormat(siloInfo.liquidity)}</div>
            <div>total deposits</div>
            <div>{bigNumberFormat(siloInfo.totalDeposits)}</div>
            <div className="text-xs">silo address</div>{' '}
            <div>
              <span className="text-xs">{currentSilo.address}</span>
            </div>
            <div className="text-xs">timestamp</div>{' '}
            <div>
              <span className="text-xs">{siloInfo.lastUpdateTimestamp.toString()}</span>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

const UserSiloData = ({ currentSilo, siloUserInfo }: { currentSilo: SiloMarket; siloUserInfo: SiloUserInfo }) => {
  const [fanOpen, setFanOpen] = useState(false);

  // console.log('siloUserInfo', siloUserInfo);

  return (
    <Container id="supply-page" className="py-2 md:py-4 lg:py-6">
      <div className="p-4 rounded-lg shadow-lg bg-dark-900 text-secondary">
        <div className="flex justify-between">
          <h1 className="text-lg font-semibold">User Info</h1>
          <div>
            <Button
              color="gray"
              variant="outlined"
              onClick={() => {
                setFanOpen(!fanOpen);
              }}
            >
              ^
            </Button>
          </div>
        </div>
        {siloUserInfo === null && fanOpen && <p>Loading...</p>}

        {fanOpen && siloUserInfo && (
          <div className="grid grid-cols-2">
            {/*}  <div>collaterilizationLevel</div>{' '}
            <div>
              <span>{siloUserInfo.collaterilizationLevel}</span>
            </div>
            <div>debtLevel</div>{' '}
            <div>
              <span>{siloUserInfo.debtLevel}</span>
            </div>
            <div>isSolvent</div>{' '}
            <div>
              <span>{siloUserInfo.isSolvent}</span> 
            </div>*/}
            <div className="text-xs">user address</div>{' '}
            <div>
              <span className="text-xs">{siloUserInfo.address}</span>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};
