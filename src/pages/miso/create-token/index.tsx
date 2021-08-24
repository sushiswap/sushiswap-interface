import { DuplicateIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Lottie from 'lottie-react'
import Head from 'next/head'
import React from 'react'

import loadingCircle from '../../../animation/loading-circle.json'
import Button from '../../../components/Button'
import Image from '../../../components/Image'
import Web3Connect from '../../../components/Web3Connect'
import Divider from '../../../features/miso/Divider'
import Input from '../../../features/miso/Input'
import Radio from '../../../features/miso/Radio'
import { getExplorerLink } from '../../../functions/explorer'
import { useActiveWeb3React } from '../../../hooks/useActiveWeb3React'
import useCopyClipboard from '../../../hooks/useCopyClipboard'
import useTokens from '../../../hooks/miso/useTokens'
import Layout from '../../../layouts/Miso'
import childrenWithProps from '../../../layouts/Miso/children'

import fixedToken from '../../../../public/images/miso/create-token/miso-fixed-token.svg'
import mintableToken from '../../../../public/images/miso/create-token/miso-mintable-token.svg'
import sushiToken from '../../../../public/images/miso/create-token/miso-sushi-token.svg'
import ExternalLink from '../../../components/ExternalLink'
import { shortenAddress } from '../../../functions'
import NavLink from '../../../components/NavLink'
import Typography from '../../../components/Typography'

function TokenInfo({ label, value }) {
  const { i18n } = useLingui()
  return (
    <div className="mr-12">
      <Typography>{i18n._(t`${label}`)}</Typography>
      <Typography className="mt-2 py-2 px-5 rounded bg-dark-800">{value}</Typography>
    </div>
  )
}

function CreateToken({ pageIndex, movePage }) {
  const { i18n } = useLingui()

  const [tokenType, setTokenType] = React.useState('Fixed')

  const [tokenName, setTokenName] = React.useState('')
  const [tokenSymbol, setTokenSymbol] = React.useState('')
  const [tokenInitialSupply, setTokenInitialSupply] = React.useState('')

  const checkTokenInfo = () => {
    if (!tokenName) return true
    if (!tokenSymbol) return true
    if (!tokenInitialSupply) return true
    return false
  }

  const { account, chainId } = useActiveWeb3React()
  const { createToken } = useTokens()
  const [, setCopied] = useCopyClipboard()
  const [tx, setTx] = React.useState(null)
  const [receipt, setRecipt] = React.useState(null)
  const [txState, setTxState] = React.useState(0)

  const deployToken = () => {
    let templateType = '0'
    switch (tokenType) {
      case 'Fixed':
        templateType = '1'
        break
      case 'Mintable':
        templateType = '2'
        break
      case 'Sushi':
        templateType = '3'
        break
    }
    const txPromise = createToken(templateType, tokenName, tokenSymbol, tokenInitialSupply)
    setTxState(1)
    txPromise
      .then((createTx) => {
        console.log(createTx)
        setTx(createTx)
        setTxState(2)
        createTx
          .wait()
          .then((createReceipt) => {
            console.log(createReceipt)
            setRecipt(createReceipt)
            if (createReceipt.status) setTxState(3)
            else setTxState(4)
          })
          .catch((reason) => {
            console.log(reason)
            setTxState(4)
          })
      })
      .catch((reason) => {
        console.log(reason)
        setTxState(0)
      })
  }

  return (
    <>
      <Head>
        <title>MISO | Sushi</title>
        <meta key="description" name="description" content="MISO by Sushi, an initial Sushi offering on steroids ..." />
      </Head>
      <div>
        {pageIndex === 0 && (
          <div>
            <div className="grid grid-cols-3 gap-5 mb-16">
              <div>
                <div className="pl-10">
                  <Image src={fixedToken} height={64} alt="Fixed" />
                </div>
                <Radio
                  label="Fixed"
                  selected={tokenType === 'Fixed'}
                  onSelect={(label) => setTokenType(label)}
                  className="my-5"
                />
                <Typography>
                  {i18n._(
                    t`A "standard" ERC20 token with a fixed supply and protections against further token minting or burning.`
                  )}
                </Typography>
              </div>
              <div>
                <div className="pl-10">
                  <Image src={mintableToken} height={64} alt="Mintable" />
                </div>
                <Radio
                  label="Mintable"
                  selected={tokenType === 'Mintable'}
                  onSelect={(label) => setTokenType(label)}
                  className="my-5"
                />
                <Typography>
                  {i18n._(
                    t`An ERC20 token with a function allowing further minting at a later date. Creators will have to assign an owner for the minting controls.`
                  )}
                </Typography>
              </div>
              <div>
                <div className="pl-10">
                  <Image src={sushiToken} height={64} alt="Sushi" />
                </div>
                <Radio
                  label="Sushi"
                  selected={tokenType === 'Sushi'}
                  onSelect={(label) => setTokenType(label)}
                  className="my-5"
                />
                <Typography>
                  {i18n._(
                    t`Sushi tokens function similar to mintable tokens but with additional capabilities built into the token. Creators will have to assign an owner address for token functions during minting.`
                  )}
                </Typography>
              </div>
            </div>
            <Divider />
            <div className="flex justify-between mt-5">
              <Button color="gray" disabled className="w-[133px]">
                {i18n._(t`Previous`)}
              </Button>
              <Button color="blue" className="w-[133px]" onClick={() => movePage(pageIndex + 1)}>
                {i18n._(t`Next`)}
              </Button>
            </div>
          </div>
        )}
        {pageIndex === 1 && (
          <div>
            <div className="mb-16">
              <Input
                label="Token Name*"
                value={tokenName}
                placeholder="Enter the name of the token."
                alert="This will be the name of your token. Choose wisely, this cannot be changed later."
                onUserInput={(input) => setTokenName(input)}
              />
              <Input
                label="Token Symbol*"
                value={tokenSymbol}
                placeholder="Enter the symbol of your token."
                alert="This will be the symbol of your token, normally a short version of your token name."
                onUserInput={(input) => setTokenSymbol(input)}
              />
              <Input
                label="Initial Supply*"
                value={tokenInitialSupply}
                type="digit"
                placeholder="Enter the amount of token you would like to mint initially."
                alert="This will be the number of tokens initially minted. If you selected ‘Fixed’ as token type, this number is fixed and is the final supply of the token."
                onUserInput={(input) => setTokenInitialSupply(input)}
              />
            </div>
            <Divider />
            <div className="flex justify-between mt-5">
              <Button color="gray" className="w-[133px]" onClick={() => movePage(pageIndex - 1)}>
                {i18n._(t`Previous`)}
              </Button>
              <Button
                color="blue"
                className="w-[133px]"
                onClick={() => movePage(pageIndex + 1)}
                disabled={checkTokenInfo()}
              >
                {i18n._(t`Next`)}
              </Button>
            </div>
          </div>
        )}
        {pageIndex === 2 && (
          <>
            {txState < 2 && (
              <div>
                <Typography variant="h3" weight={700} className="text-white mb-5">
                  {i18n._(t`Confirm Your Token Setup`)}
                </Typography>
                <div className="mb-16 grid grid-cols-2 gap-5">
                  <TokenInfo label="Token Type*" value={tokenType} />
                  <TokenInfo label="Initiali Supply*" value={tokenInitialSupply} />
                  <TokenInfo label="Token Name*" value={tokenName} />
                  <TokenInfo label="Token Symbol*" value={tokenSymbol} />
                </div>
                <Divider />
                <div className="flex justify-between mt-5">
                  <Button
                    color="gray"
                    className="w-[133px]"
                    disabled={txState === 1}
                    onClick={() => movePage(pageIndex - 1)}
                  >
                    {i18n._(t`Previous`)}
                  </Button>
                  {account ? (
                    <Button
                      color="gradient"
                      className="w-[133px] flex flex-row items-center justify-center"
                      onClick={() => deployToken()}
                      disabled={txState === 1}
                    >
                      {txState === 1 && <Lottie animationData={loadingCircle} autoplay loop className="mr-2 w-5" />}
                      {i18n._(t`Deploy`)}
                    </Button>
                  ) : (
                    <Web3Connect size="lg" color="blue" className="w-[200px]" />
                  )}
                </div>
              </div>
            )}
            {txState === 2 && (
              <div>
                <Typography variant="h3" weight={700} className="text-white mb-3">
                  {i18n._(t`Your Transaction is submitted...`)}
                </Typography>
                <div className="mb-12">
                  <ExternalLink
                    className="underline"
                    color="blue"
                    href={getExplorerLink(chainId, tx.hash, 'transaction')}
                  >
                    {i18n._(t`View on Explorer`)}
                  </ExternalLink>
                </div>
                <Typography variant="lg" weight={700} className="mb-3">
                  {i18n._(t`Token Contract Address`)}
                </Typography>
                <Typography className="mb-5 mqsd-w-[400px]">
                  {i18n._(t`You can view the token contract address here once the transaction is completed`)}
                </Typography>
                <div className="flex flex-row gap-5">
                  <Button color="gradient" className="w-[200px]" disabled>
                    {i18n._(t`Create Auction`)}
                  </Button>
                  <NavLink href="/miso">
                    <div>
                      <Button variant="outlined" className="w-[200px]" color="gradient">
                        {i18n._(t`Go To Marketplace`)}
                      </Button>
                    </div>
                  </NavLink>
                </div>
              </div>
            )}
            {txState === 3 && (
              <div>
                <div className="text-2xl text-white font-bold mb-3">{i18n._(t`Transaction Completed!`)}</div>
                <div className="mb-12">
                  <ExternalLink
                    className="underline"
                    color="blue"
                    href={getExplorerLink(chainId, tx.hash, 'transaction')}
                  >
                    {i18n._(t`View on Explorer`)}
                  </ExternalLink>
                </div>
                <Typography variant="lg" weight={700} className="mb-3">
                  {i18n._(t`Token Contract Address`)}
                </Typography>
                <div
                  className="mb-5 w-[400px] text-blue flex flex-row items-center cursor-pointer"
                  onClick={() => setCopied(receipt.to)}
                >
                  {shortenAddress(receipt.to)}
                  <DuplicateIcon className="w-5 h-5 ml-2 text-white" aria-hidden="true" />
                </div>
                <div className="flex flex-row gap-5">
                  <NavLink href="/miso/create-auction">
                    <div>
                      <Button color="gradient" className="w-[200px]">
                        {i18n._(t`Create Auction`)}
                      </Button>
                    </div>
                  </NavLink>
                  <NavLink href="/miso">
                    <div>
                      <Button variant="outlined" className="w-[200px]" color="gradient">
                        {i18n._(t`Go To Marketplace`)}
                      </Button>
                    </div>
                  </NavLink>
                </div>
              </div>
            )}
            {txState === 4 && (
              <div>
                <div className="text-2xl text-white font-bold mb-3">{i18n._(t`Transaction Failed!`)}</div>
                <div className="mb-12">
                  <ExternalLink
                    className="underline"
                    color="blue"
                    href={getExplorerLink(chainId, tx.hash, 'transaction')}
                  >
                    {i18n._(t`View on Explorer`)}
                  </ExternalLink>
                </div>
                <div className="flex flex-row gap-5">
                  <NavLink href="/miso/create-auction">
                    <div>
                      <Button color="gradient" className="w-[200px]">
                        {i18n._(t`Create Auction`)}
                      </Button>
                    </div>
                  </NavLink>
                  <NavLink href="/miso">
                    <div>
                      <Button variant="outlined" className="w-[200px]" color="gradient">
                        {i18n._(t`Go To Marketplace`)}
                      </Button>
                    </div>
                  </NavLink>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

const CreateTokenLayout = ({ children }) => {
  const { i18n } = useLingui()
  const [pageIndex, movePage] = React.useState(0)

  return (
    <Layout
      navs={[
        { link: '/miso', name: i18n._(t`MISO Launchpad`) },
        { link: '/miso/create-token', name: i18n._(t`Create Token`) },
      ]}
      title={{
        heading: i18n._(t`Create Token`),
        content: 'Follow the instructions below, and deploy your token with MISO.',
      }}
      tabs={[
        { heading: i18n._(t`SELECT TOKEN TYPE`), content: i18n._(t`Decide on the type of token`) },
        { heading: i18n._(t`SET PARAMETERS`), content: i18n._(t`Set up required token parameters`) },
        { heading: i18n._(t`REVIEW`), content: i18n._(t`Deploy your token`) },
      ]}
      active={pageIndex}
    >
      {childrenWithProps(children, { pageIndex, movePage })}
    </Layout>
  )
}
CreateToken.Layout = CreateTokenLayout

export default CreateToken
