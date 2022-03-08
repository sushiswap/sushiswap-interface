import { RadioGroup } from '@headlessui/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Form from 'app/components/Form'
import { BlocksIcon, MintableTokenIcon, SushiTokenIcon } from 'app/components/Icon'
import Typography from 'app/components/Typography'
import useTokenTemplateMap from 'app/features/miso/context/hooks/useTokenTemplateMap'
import { TokenSetup, TokenType } from 'app/features/miso/context/types'
import { classNames } from 'app/functions'
import { useToken } from 'app/hooks/Tokens'
import React, { FC, ReactNode } from 'react'
import { useFormContext } from 'react-hook-form'

const TokenCreationStep: FC = () => {
  const { watch, setValue } = useFormContext()
  const [tokenType, tokenSetupType, tokenAddress] = watch(['tokenType', 'tokenSetupType', 'tokenAddress'])
  const { i18n } = useLingui()
  const { templateIdToLabel } = useTokenTemplateMap()
  const token = useToken(tokenSetupType === TokenSetup.PROVIDE ? tokenAddress : undefined)

  const tokenSetupItems = [
    {
      value: TokenSetup.PROVIDE,
      label: 'Provide token',
      description: i18n._(t`I already have an ERC20 token with 18 decimals`),
    },
    {
      value: TokenSetup.CREATE,
      label: 'Create token',
      description: i18n._(t`I want to create a new ERC20 token.`),
    },
  ]

  const items = [
    {
      icon: <BlocksIcon height={83} width={83} />,
      value: TokenType.FIXED,
      label: templateIdToLabel(TokenType.FIXED),
      description: i18n._(
        t`A "standard" ERC20 token with a fixed supply and protections against further token minting or burning.`
      ),
    },
    {
      icon: <MintableTokenIcon height={83} width={83} />,
      value: TokenType.MINTABLE,
      label: templateIdToLabel(TokenType.MINTABLE),
      description: i18n._(
        t`An ERC20 token with a function allowing further minting at a later date. Creators will have to assign an owner for the minting controls.`
      ),
    },
    {
      icon: <SushiTokenIcon height={83} width={83} />,
      value: TokenType.SUSHI,
      label: templateIdToLabel(TokenType.SUSHI),
      description: i18n._(
        t`Sushi tokens function similar to mintable tokens but with additional capabilities built into the token. Creators will have to assign an owner address for token functions during minting.`
      ),
    },
  ]

  return (
    <>
      <div className="col-span-6 flex border-b border-dark-800 pt-10 pb-20 justify-center items-center">
        <RadioGroup
          value={tokenSetupType || ''}
          onChange={(tokenSetupType) => setValue('tokenSetupType', tokenSetupType)}
          className="flex gap-10"
        >
          <input className="hidden" name="tokenSetupType" value={tokenSetupType} onChange={() => {}} />
          <div className="flex w-full gap-5">
            {tokenSetupItems
              .map<ReactNode>(({ description, label, value }, index) => (
                <RadioGroup.Option value={value} key={value}>
                  {({ checked }) => (
                    <div
                      className={classNames(
                        'flex flex-col border border-transparent gap-2 p-10 rounded h-full cursor-pointer max-w-[300px] hover:text-white',
                        index === 0 ? 'text-right' : 'text-left'
                      )}
                    >
                      <Typography variant="h3" className={checked ? 'text-blue' : 'text-inherit'}>
                        {label}
                      </Typography>
                      <Typography variant="sm" className={checked ? 'text-blue' : 'text-inherit'}>
                        {description}
                      </Typography>
                    </div>
                  )}
                </RadioGroup.Option>
              ))
              .reduce((prev, cur, index) => [
                prev,
                <div className="relative flex items-center" key={`div-${index}`}>
                  <div className="absolute inset-0 flex justify-center py-10" aria-hidden="true">
                    <div className="h-full border-r border-dark-800" />
                  </div>
                  <div className="relative flex items-center bg-dark-900 py-2">
                    <span className="px-2 text-sm text-low-emphesis">OR</span>
                  </div>
                </div>,
                cur,
              ])}
          </div>
        </RadioGroup>
      </div>
      {tokenSetupType === TokenSetup.CREATE && (
        <>
          <div className="col-span-6">
            <RadioGroup
              value={tokenType}
              onChange={(tokenType) => setValue('tokenType', tokenType)}
              className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10 mt-2"
            >
              <input className="hidden" name="tokenType" value={tokenType} onChange={() => {}} />
              {items.map(({ icon, value, label, description }) => (
                <RadioGroup.Option value={value} key={value}>
                  {({ checked }) => (
                    <div
                      className={classNames(
                        checked ? 'bg-dark-1000/40 border-purple' : 'bg-dark-900 hover:border-purple/40',
                        'flex flex-col gap-4 border border-dark-800 p-5 rounded h-full cursor-pointer'
                      )}
                    >
                      <Typography variant="lg" weight={700} className="text-high-emphesis">
                        {label}
                      </Typography>
                      {icon}
                      <Typography className="text-high-emphesis">{description}</Typography>
                    </div>
                  )}
                </RadioGroup.Option>
              ))}
            </RadioGroup>
          </div>
          <div className="col-span-4">
            <Form.TextField
              name="tokenName"
              label={i18n._(t`Name*`)}
              helperText={i18n._(t`This will be the name of your token. Choose wisely, this is final and immutable.`)}
              placeholder="The name of your token"
            />
          </div>
          <div className="col-span-2">
            <Form.TextField
              name="tokenSymbol"
              label={i18n._(t`Symbol*`)}
              helperText={i18n._(t`This will be the symbol of your token. Choose wisely, this is final and immutable.`)}
              placeholder="The symbol of your token"
            />
          </div>
          <div className="col-span-6">
            <Form.TextField
              name="tokenSupply"
              label={i18n._(t`Total supply*`)}
              helperText={
                tokenType === TokenType.FIXED
                  ? i18n._(
                      t`This will be the initial supply of your token. Because your token type is set to fixed. This value will be final and immutable`
                    )
                  : i18n._(t`This will be the initial supply of your token.`)
              }
              placeholder="The name of your token"
            />
          </div>
        </>
      )}
      {tokenSetupType === TokenSetup.PROVIDE && (
        <div className="col-span-6">
          <Form.TextField
            label={i18n._(`Token address*`)}
            name="tokenAddress"
            helperText={
              <>
                <Form.HelperText>{i18n._(t`Your token must be 18 decimals`)}</Form.HelperText>
                <Form.HelperText className="text-green">{i18n._(t`Provided token: ${token?.symbol}`)}</Form.HelperText>
              </>
            }
            placeholder="Address of the ERC20 token"
          />
        </div>
      )}
      <div className="col-span-6">
        <Form.TextField
          name="tokenAmount"
          label={i18n._(t`Tokens for sale*`)}
          helperText={i18n._(t`This is the amount of tokens that will be sold to the public`)}
          placeholder="Enter the amount of tokens you would like to auction."
        />
      </div>
    </>
  )
}

export default TokenCreationStep
