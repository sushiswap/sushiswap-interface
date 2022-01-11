import { RadioGroup } from '@headlessui/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Form from 'app/components/Form'
import { BlocksIcon, MintableTokenIcon, SushiTokenIcon } from 'app/components/Icon'
import Typography from 'app/components/Typography'
import useTokenTemplateMap from 'app/features/miso/context/hooks/useTokenTemplateMap'
import { TokenType } from 'app/features/miso/context/types'
import { classNames } from 'app/functions'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

const TokenCreationStep: FC = () => {
  const { watch, setValue } = useFormContext()
  const tokenType = watch('tokenType')
  const { i18n } = useLingui()
  const { templateIdToLabel } = useTokenTemplateMap()

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
      <div className="col-span-6">
        <RadioGroup
          value={tokenType}
          onChange={(tokenType) => setValue('tokenType', tokenType)}
          className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10"
        >
          <input className="hidden" name="tokenType" value={tokenType} onChange={() => {}} />
          {items.map(({ icon, value, label, description }) => (
            <RadioGroup.Option value={value} key={value}>
              {({ checked }) => (
                <div
                  className={classNames(
                    checked ? 'bg-dark-1000/40' : 'bg-dark-900',
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
      <div className="col-span-6">
        <Form.TextField
          name="tokenName"
          label={i18n._(t`Name*`)}
          helperText={i18n._(t`This will be the name of your token. Choose wisely, this is final and immutable.`)}
          placeholder="The name of your token"
        />
      </div>
      <div className="col-span-6">
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
