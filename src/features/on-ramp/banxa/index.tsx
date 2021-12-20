import { t } from '@lingui/macro'
import { useCallback } from 'react'
import { useLingui } from '@lingui/react'
import React, { useState } from 'react';
import Modal from '../../../components/Modal'


export default function Buy() {
  const [isActive, setActive] = useState(false);

  const toggleModal = () => {
    setActive(!isActive);
  };

  const { i18n } = useLingui() 

  return (
    <>
      <a
        id={`buy-link`}
        onClick={toggleModal}
        className="p-2 cursor-pointer text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
      >
        {i18n._(t`Buy`)}
      </a>
      <Modal isOpen={isActive} onDismiss={toggleModal}>
        <iframe loading="lazy" src="https://sushiswap.banxa.com/iframe?code=chBbK8X8yHkbkHt3Lihi" scrolling="yes" allowtransparency="true" id="widget-buy" width="100%" height="650px" frameBorder="0"></iframe>
      </Modal>
      
    </>
  )
}