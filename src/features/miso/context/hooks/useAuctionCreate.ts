import { defaultAbiCoder } from '@ethersproject/abi'
import { AddressZero } from '@ethersproject/constants'
import { CHAIN_KEY } from '@sushiswap/core-sdk'
import MISO from '@sushiswap/miso/exports/all.json'
import { AuctionCreationFormInputFormatted } from 'app/features/miso/AuctionCreationForm'
import { NATIVE_PAYMENT_TOKEN } from 'app/features/miso/context/constants'
import useAuctionTemplateMap from 'app/features/miso/context/hooks/useAuctionTemplateMap'
import { AuctionTemplate } from 'app/features/miso/context/types'
import { useContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'

const useAuctionCreate = () => {
  const { chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const { map: auctionTemplateMap } = useAuctionTemplateMap()
  const contract = useContract(
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.MISOMarket.address : undefined,
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.MISOMarket.abi : undefined
  )

  const subscribe = useCallback(
    (event: string, cb) => {
      if (!contract) return

      contract.on(event, cb)
    },
    [contract]
  )

  const unsubscribe = useCallback(
    (event: string, cb) => {
      if (!contract) return

      contract.off(event, cb)
    },
    [contract]
  )

  const _dutchAuctionData = useCallback((data: AuctionCreationFormInputFormatted, marketFactoryAddress: string) => {
    if (!data.startPrice || !data.endPrice) throw new Error('Invalid inputs')

    return defaultAbiCoder.encode(
      [
        'address',
        'address',
        'uint256',
        'uint256',
        'uint256',
        'address',
        'uint256',
        'uint256',
        'address',
        'address',
        'address',
      ],
      [
        marketFactoryAddress,
        data.auctionToken.address,
        data.tokenAmount.quotient.toString(),
        data.startDate.getTime() / 1000,
        data.endDate.getTime() / 1000,
        data.paymentCurrency.isNative ? NATIVE_PAYMENT_TOKEN : data.paymentCurrency.wrapped.address,
        data.startPrice.numerator.toString(),
        data.endPrice.numerator.toString(),
        data.operator,
        data.pointListAddress,
        data.fundWallet,
      ]
    )
  }, [])

  const _batchAuctionData = useCallback((data: AuctionCreationFormInputFormatted, marketFactoryAddress: string) => {
    if (!data.minimumRaised) throw new Error('Invalid inputs')

    return defaultAbiCoder.encode(
      ['address', 'address', 'uint256', 'uint256', 'uint256', 'address', 'uint256', 'address', 'address', 'address'],
      [
        marketFactoryAddress,
        data.auctionToken.address,
        data.tokenAmount.quotient.toString(),
        data.startDate.getTime() / 1000,
        data.endDate.getTime() / 1000,
        data.paymentCurrency.isNative ? NATIVE_PAYMENT_TOKEN : data.paymentCurrency.wrapped.address,
        data.minimumRaised.quotient.toString(),
        data.operator,
        data.pointListAddress,
        data.fundWallet,
      ]
    )
  }, [])

  const _crowdsaleAuctionData = useCallback((data: AuctionCreationFormInputFormatted, marketFactoryAddress: string) => {
    if (!data.fixedPrice || !data.minimumTarget) throw new Error('Invalid inputs')

    return defaultAbiCoder.encode(
      [
        'address',
        'address',
        'address',
        'uint256',
        'uint256',
        'uint256',
        'uint256',
        'uint256',
        'address',
        'address',
        'address',
      ],
      [
        marketFactoryAddress,
        data.auctionToken.address,
        data.paymentCurrency.isNative ? NATIVE_PAYMENT_TOKEN : data.paymentCurrency.wrapped.address,
        data.tokenAmount.quotient.toString(),
        data.startDate.getTime() / 1000,
        data.endDate.getTime() / 1000,
        data.fixedPrice.numerator.toString(),
        data.minimumTarget.quotient.toString(),
        data.operator,
        data.pointListAddress,
        data.fundWallet,
      ]
    )
  }, [])

  const getAuctionData = useCallback(
    (data: AuctionCreationFormInputFormatted, marketFactoryAddress: string) => {
      if (data.auctionType === AuctionTemplate.DUTCH_AUCTION) return _dutchAuctionData(data, marketFactoryAddress)
      if (data.auctionType === AuctionTemplate.BATCH_AUCTION) return _batchAuctionData(data, marketFactoryAddress)
      if (data.auctionType === AuctionTemplate.CROWDSALE) return _crowdsaleAuctionData(data, marketFactoryAddress)

      throw new Error('Unknown auction type')
    },
    [_batchAuctionData, _crowdsaleAuctionData, _dutchAuctionData]
  )

  const init = useCallback(
    async (data: AuctionCreationFormInputFormatted) => {
      const marketFactoryAddress = auctionTemplateMap?.[data.auctionType]
      if (!contract || !marketFactoryAddress) return

      let templateId
      try {
        // Get auction type template ID first
        templateId = await contract.getTemplateId(marketFactoryAddress)
        const tx = await contract.createMarket(
          templateId,
          data.auctionToken.address,
          data.tokenAmount.quotient.toString(),
          AddressZero,
          getAuctionData(data, contract.address)
        )

        addTransaction(tx, { summary: 'Create Auction' })

        return tx
      } catch (e) {
        console.error('Initialize fixed token error: ', e)
        console.log(
          contract.address,
          contract.interface.encodeFunctionData('createMarket', [
            templateId,
            data.auctionToken.address,
            data.tokenAmount.quotient.toString(),
            AddressZero,
            getAuctionData(data, contract.address),
          ])
        )
      }
    },
    [addTransaction, auctionTemplateMap, contract, getAuctionData]
  )

  return {
    subscribe,
    unsubscribe,
    init,
  }
}

export default useAuctionCreate
