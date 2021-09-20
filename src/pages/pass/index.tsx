import React, { useState } from 'react';
import Container from '../../components/Container';
import { APP_NAME_URL, APP_SHORT_BLURB } from '../../constants';
import Head from 'next/head';
import Button from '../../components/Button';
import usePasswordCheck from '../../hooks/usePasswordCheck';

export default function Pass() {
  const { checkPwd } = usePasswordCheck();
  const [val, setVal] = useState('');

  return (
    <Container id="supply-page" className="py-12 md:py-14 lg:py-16">
      <Head>
        <title>{APP_NAME_URL}</title>
        <meta key="description" name="description" content={APP_SHORT_BLURB} />
      </Head>
      <div className="p-4 rounded-lg shadow-lg bg-dark-900 text-secondary">
        <div>
          <input className="p-1" onChange={(evt) => setVal(evt.target.value)} value={val} />

          <Button
            onClick={(evt) => {
              console.log('login...');

              if (val) {
                console.log('entered', val);
                checkPwd(val);
              } else {
                console.error('pwd not entered');
              }
            }}
          >
            Login
          </Button>
        </div>
      </div>
    </Container>
  );
}
