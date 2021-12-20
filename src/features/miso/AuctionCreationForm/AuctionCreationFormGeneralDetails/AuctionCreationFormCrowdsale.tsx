import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, NATIVE, Price, Token } from '@sushiswap/core-sdk'
import Form from 'app/components/Form'
import FormFieldHelperText from 'app/components/Form/FormFieldHelperText'
import Typography from 'app/components/Typography'
import { AuctionCreationFormInput } from 'app/features/miso/AuctionCreationForm'
import { tryParseAmount } from 'app/functions'
import { useToken } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

interface AuctionCreationFormCrowdsaleProps {}

const AuctionCreationFormCrowdsale: FC<AuctionCreationFormCrowdsaleProps> = ({}) => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { watch } = useFormContext<AuctionCreationFormInput>()
  const data = watch()
  const paymentToken = useToken(data.paymentCurrencyAddress) ?? NATIVE[chainId || 1]
  const auctionToken = useToken(data.token)

  let price: Price<Token, Currency> | undefined
  let amount: CurrencyAmount<Token> | undefined
  let base: CurrencyAmount<Currency> | undefined
  let quote: CurrencyAmount<Token> | undefined
  let minimumRaised: CurrencyAmount<Currency> | undefined
  if (paymentToken && auctionToken && Number(data.fixedPrice) > 0) {
    base = tryParseAmount(data.fixedPrice?.toString(), paymentToken)
    quote = tryParseAmount('1', auctionToken)
    amount = tryParseAmount(data.tokenAmount?.toString(), auctionToken)

    if (base && quote) price = new Price({ baseAmount: quote, quoteAmount: base })
    if (price && amount) minimumRaised = price.quote(amount)
  }

  return (
    <Form.Section columns={4} className="pt-8" header={<Form.Section.Header header={i18n._(t`Crowdsale Details`)} />}>
      <div className="col-span-4 md:col-span-2 xl:col-span-1">
        <Form.TextField
          {...(paymentToken && {
            endIcon: (
              <Typography variant="sm" weight={700} className="text-secondary">
                {paymentToken.symbol}
              </Typography>
            ),
          })}
          name="fixedPrice"
          label={i18n._(t`Fixed Price*`)}
          placeholder="0.00"
          helperText={i18n._(t`Price at which your tokens get sold`)}
        />
      </div>
      <div className="col-span-4">
        <Typography weight={700}>{i18n._(t`Minimum Raised`)}</Typography>
        <Typography className="mt-2">
          {minimumRaised ? minimumRaised.toSignificant(6) : '0.00'} {paymentToken?.symbol}{' '}
        </Typography>
        <FormFieldHelperText>
          {i18n._(
            t`Minimum amount in order to have a successful auction. If this value is not met, users can withdraw their committed payment token and no tokens will be sold`
          )}
        </FormFieldHelperText>
      </div>
    </Form.Section>
  )
}

export default AuctionCreationFormCrowdsale
