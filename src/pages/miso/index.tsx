import Head from 'next/head'
import Image from 'next/image'
import Layout from '../../layouts/Miso'
import MisoInfo from './MisoInfo'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Article from '../../features/miso/Article'

function MISO() {
  const { i18n } = useLingui()
  return (
    <>
      <Head>
        <title>MISO | Sushi</title>
        <meta key="description" name="description" content="MISO by Sushi, an initial Sushi offering on steroids ..." />
      </Head>
      <div
        className="flex flex-col w-full"
        style={{
          backgroundImage: `url('/images/miso/trident/trident_bg.png')`,
          backgroundColor: 'rgba(27,27,27)',
          backgroundBlendMode: 'overlay',
          backgroundSize: 'cover',
        }}
      >
        <div className="flex justify-center my-6">
          <div className="flex flex-col items-center w-full max-w-5xl mx-8">
            <div className="grid w-full grid-cols-12 gap-4 mb-6 min-h-1/2">
              <div className="col-span-12 mx-auto lg:col-span-6">
                <div className="mx-auto" style={{ position: 'relative' }}>
                  <div className="flex flex-col" style={{ position: 'absolute', left: '0px', top: '0px' }}>
                    <div className="mb-3">
                      <Image src="/images/miso/trident/trident_fx1.png" width={156} height={43} />
                    </div>
                    <div className="mb-3">
                      <Image src="/images/miso/trident/trident_fx1.png" width={156} height={43} />
                    </div>
                    <div className="mb-3">
                      <Image src="/images/miso/trident/trident_fx1.png" width={156} height={43} />
                    </div>
                  </div>
                </div>
                <div style={{ marginLeft: 30, marginTop: 70 }}>
                  <div className="flex flex-row">
                    <div>
                      <div style={{ width: 2, height: '70%', backgroundColor: '#888' }}></div>
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="flex flex-row">
                        <div className="flex-1" style={{ height: 2, backgroundColor: '#888' }}></div>
                        <div className="flex flex-row" style={{ marginTop: '-12px' }}>
                          <div className="ml-1 text-sm text-white">Artist</div>
                          <div className="ml-1 text-sm font-bold text-white"> Chew Stoll</div>
                          <div className="ml-1" style={{ width: 12, height: 10 }}>
                            <a href="https://twitter.com/chowzuh" target="_blank" rel="noreferrer noopener">
                              <Image src="/images/miso/trident/trident_twitter.svg" width={12} height={10} />
                            </a>
                          </div>
                          <div className="ml-1" style={{ width: 10, height: 10 }}>
                            <a
                              href="https://www.instagram.com/chewystoll/?hl=en"
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              <Image src="/images/miso/trident/trident_instagram.svg" width={10} height={10} />
                            </a>
                          </div>
                        </div>
                      </div>
                      <video
                        className="flex-1 mt-1 ml-2"
                        autoPlay
                        loop
                        style={{ width: 408, height: 408, zIndex: 100 }}
                      >
                        <source src="/images/miso/trident/trident_video.mp4" />
                      </video>
                    </div>
                  </div>
                </div>
              </div>

              <div className="max-w-md col-span-12 mx-auto lg:col-span-6">
                <MisoInfo />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 mb-6 min-h-1/2">
              <div className="flex flex-row items-center col-span-12 my-8 xl:mx-8">
                <div>{'FAQ'}</div>
                <div
                  className="flex-1 mx-3"
                  style={{
                    marginTop: '5px',
                    marginBottom: '5px',
                    height: '1px',
                    background:
                      'repeating-linear-gradient(to right,rgba(255,255,255,0.45) 0,rgba(255,255,255,0.45) 5px,transparent 5px,transparent 7px)',
                  }}
                ></div>
              </div>
              <Article
                title={`How does a batch auction work?`}
                content={`In this auction, 20 of $LSD is on sale. This amount will be divided amongst all
                          the contributors at the end of the auction, weighted according to their contribution to the pool. 
                          Whatever your percentage of the total raise, that's the portion of the total tokens on 
                          offer you will receive. The more you invest the more you get.`}
              />

              <Article
                title={`How do I participate?`}
                content={`The auction receives $SUSHI as its payment token currency. Go to auction page, 
                          commit the amount of $SUSHI you’d like and claim your purchase after the 
                          auction finishes.`}
              />

              <Article
                title={`Learn more about MISO`}
                content={`MISO is a suite of open-source smart contracts created to ease the process of launching 
                          a new project on the SushiSwap exchange. MISO aims to drive new capital and trade to the exchange 
                          by increasing the attractiveness of SushiSwap as a place for token creators and communities to launch 
                          new project tokens.`}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const MISOLayout = ({ children }) => {
  return <Layout>{children}</Layout>
}
MISO.Layout = MISOLayout

export default MISO
