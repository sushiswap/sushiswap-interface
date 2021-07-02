import React, { FC } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { ChainId } from '@sushiswap/sdk'
import Modal from '../../components/Modal'
import Typography from '../../components/Typography'
import Image from 'next/image'
import { NETWORK_ICON, NETWORK_LABEL } from '../../constants/networks'
import { SUPPORTED_NETWORKS } from '../../components/NetworkModal'
import cookie from 'cookie-cutter'
import { classNames } from '../../functions'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'

interface NetworkGuardProps {
  networks: ChainId[]
}

const Component: FC<NetworkGuardProps> = ({ children, networks = [] }) => {
  const { i18n } = useLingui()
  const { chainId, library, account } = useActiveWeb3React()

  if (networks.includes(chainId)) return <>{children}</>

  return (
    <Modal isOpen={true} onDismiss={() => null} maxWidth={768}>
      <div className="flex flex-col gap-5">
        <div className="flex gap-5">
          <div className="flex flex-col gap-3">
            <Typography variant="h3">{i18n._(t`Unsupported network`)}</Typography>
            <Typography>
              {i18n._(t`Please switch to one of the following supported networks to view this page`)}
            </Typography>
          </div>
        </div>
        <div className="grid grid-flow-row-dense grid-cols-1 gap-5 overflow-y-auto md:grid-cols-2">
          {[
            ChainId.MAINNET,
            ChainId.MATIC,
            ChainId.FANTOM,
            ChainId.ARBITRUM,
            ChainId.OKEX,
            ChainId.HECO,
            ChainId.BSC,
            ChainId.XDAI,
            ChainId.HARMONY,
            ChainId.AVALANCHE,
            ChainId.CELO,
          ].map((key: ChainId, i: number) => {
            const disabled = !networks.includes(key)

            if (chainId === key) {
              return (
                <button
                  key={i}
                  disabled={disabled}
                  className="disabled:cursor-not-allowed disabled:opacity-40 w-full col-span-1 p-px rounded bg-gradient-to-r from-blue to-pink"
                >
                  <div className="flex items-center w-full h-full p-3 space-x-3 rounded bg-dark-1000">
                    <Image
                      src={NETWORK_ICON[key]}
                      alt="Switch Network"
                      className="rounded-md"
                      width="32px"
                      height="32px"
                    />
                    <div className="font-bold text-primary">{NETWORK_LABEL[key]}</div>
                  </div>
                </button>
              )
            }

            return (
              <button
                key={i}
                disabled={disabled}
                onClick={() => {
                  const params = SUPPORTED_NETWORKS[key]
                  cookie.set('chainId', key)
                  if (key === ChainId.MAINNET) {
                    library?.send('wallet_switchEthereumChain', [{ chainId: '0x1' }, account])
                  } else {
                    library?.send('wallet_addEthereumChain', [params, account])
                  }
                }}
                className={classNames(
                  disabled ? '' : 'cursor-pointer hover:bg-dark-700',
                  'disabled:opacity-40 disabled:cursor-not-allowed flex items-center w-full col-span-1 p-3 space-x-3 rounded bg-dark-800'
                )}
              >
                <Image src={NETWORK_ICON[key]} alt="Switch Network" className="rounded-md" width="32px" height="32px" />
                <div className="font-bold text-primary">{NETWORK_LABEL[key]}</div>
              </button>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}

const NetworkGuard = (networks: ChainId[]) => {
  return ({ children }) => <Component networks={networks}>{children}</Component>
}

export default NetworkGuard
