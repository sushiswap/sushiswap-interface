import { NETWORK_ICON, NETWORK_LABEL } from '../../constants/networks';
import { useModalOpen, useNetworkModalToggle, useNewMarketModalToggle } from '../../state/application/hooks';
import { ApplicationModal } from '../../state/application/actions';
import { ChainId } from '@sushiswap/sdk';
import Image from 'next/image';
import Modal from '../../components/Modal';
import ModalHeader from '../../components/ModalHeader';
import React from 'react';
import cookie from 'cookie-cutter';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { APP_NAME } from '../../constants';
import Button from '../../components/Button';
import useTokenSetup from '../../hooks/useTokenSetup';
import { Field } from '../../state/swap/actions';
import { useLingui } from '@lingui/react';
import { t } from '@lingui/macro';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import useSiloMarkets from '../../hooks/useSiloMarkets';
import { useTransactionAdder } from '../../state/transactions/hooks';
import SupportedSilos from '../../components/SupportedSilos';

export default function NewMarketModal(): JSX.Element | null {
  const { chainId, library, account } = useActiveWeb3React();
  const modalOpen = useModalOpen(ApplicationModal.NEW_MARKET);
  const toggleModal = useNewMarketModalToggle();
  const { i18n } = useLingui();
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

  const { createSiloMarket } = useSiloMarkets();
  const addTransaction = useTransactionAdder();

  if (!chainId) return null;

  return (
    <Modal isOpen={modalOpen} onDismiss={toggleModal} maxWidth={672}>
      <ModalHeader onClose={toggleModal} title="Create a Silo Market" />

      <div className="mt-6 grid grid-flow-row-dense grid-cols-1 gap-3 overflow-y-auto md:grid-cols-2">
        <div>Select asset</div>
        <div>Bridge asset</div>
        <div>
          <CurrencyInputPanel
            // priceImpact={priceImpact}
            label={independentField === Field.OUTPUT && !showWrap ? i18n._(t`Select:`) : i18n._(t`Select:`)}
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
            hideBalance={true}
            hideInput={true}
          />
        </div>
        <div>
          <div className="bg-dark-800 rounded h-full w-full flex flex-cols items-center">
            <div className="flex w-full items-center space-x-4 mt-4 md:mt-2 md:mx-6 md:my-0 m-5">
              <div>
                <Image src={NETWORK_ICON[1]} alt="Bridge Asset" className="rounded-md" width="48px" height="48px" />
              </div>
              <div className="text-2xl font-bold">ETH</div>
            </div>
          </div>
        </div>
        <div className="md:col-span-2 flex justify-center mt-4">
          <div>
            <Button
              color="indigo"
              onClick={async () => {
                //TODO: fix typing on currencies (sub types)
                const selected: any = currencies[Field.INPUT];
                const tokenAddress = selected?.address;

                if (tokenAddress) {
                  console.log('creating market for:', selected);

                  const result = await createSiloMarket(tokenAddress);

                  addTransaction(result, {
                    summary: `Added silo market ${selected.symbol}-ETH`,
                  });

                  toggleModal();
                }
              }}
            >
              Create Market
            </Button>
          </div>
        </div>

        <SupportedSilos />
      </div>
    </Modal>
  );
}
