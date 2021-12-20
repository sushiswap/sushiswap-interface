import { Dappeteer } from '@chainsafe/dappeteer'
import { closeValues } from '@sushiswap/tines'
import { Browser, Page } from 'puppeteer'

import { FUNDING_SOURCE } from './constants/FundingSource'
import { TOKEN_ADDRESSES } from './constants/TokenAddresses'
import { SwapPage } from './pages/swap/SwapPage'
import { TestHelper } from './TestHelper'

let browser: Browser
let page: Page
let metamask: Dappeteer

let swapPage: SwapPage

require('dotenv').config()

let baseUrl: string = process.env.TEST_BASE_URL || 'http://localhost:3000'

const cases = [
  ['ETH', FUNDING_SOURCE.WALLET, 'USDC', FUNDING_SOURCE.WALLET],
  ['WETH', FUNDING_SOURCE.WALLET, 'USDC', FUNDING_SOURCE.WALLET],
  ['ETH', FUNDING_SOURCE.WALLET, 'USDC', FUNDING_SOURCE.BENTO],
  ['WETH', FUNDING_SOURCE.WALLET, 'USDC', FUNDING_SOURCE.BENTO],
  ['ETH', FUNDING_SOURCE.BENTO, 'USDC', FUNDING_SOURCE.WALLET],
  ['ETH', FUNDING_SOURCE.WALLET, 'WETH', FUNDING_SOURCE.WALLET],
  ['WETH', FUNDING_SOURCE.WALLET, 'ETH', FUNDING_SOURCE.WALLET],
  ['WETH', FUNDING_SOURCE.BENTO, 'ETH', FUNDING_SOURCE.WALLET],
  ['ETH', FUNDING_SOURCE.BENTO, 'USDC', FUNDING_SOURCE.BENTO],
]

const currencySelectCases = [
  ['ETH', 'DAI'],
  ['WETH', 'USDC'],
  ['BAT', 'SUSHI'],
  ['SUSHI', 'COMP'],
  ['USDC', 'ZRX'],
  ['ZRX', 'SAI'],
]

jest.retryTimes(1)

describe('Trident Swap:', () => {
  beforeAll(async () => {
    ;[metamask, browser, page] = await TestHelper.initDappeteer()
    swapPage = new SwapPage(page, metamask, `${baseUrl}/trident/swap`)

    await page.goto(baseUrl)
    await page.bringToFront()

    await swapPage.connectMetamaskWallet()
    await swapPage.addTokenToMetamask(TOKEN_ADDRESSES.WETH)
    await swapPage.addTokenToMetamask(TOKEN_ADDRESSES.USDC)
  })

  beforeEach(async () => {
    await swapPage.blockingWait(2, true)
  })

  afterAll(async () => {
    browser.close()
  })

  test.each(cases)(`Should swap from %p %p to %p %p`, async (inToken, payFrom, outToken, receiveTo) => {
    const ethWalletBalance = await swapPage.getMetamaskTokenBalance(inToken as string)
    if (!(ethWalletBalance > 0)) throw new Error(`${inToken} wallet balance is 0 or could not be read from Metamask`)

    const swapEthAmount = ethWalletBalance * 0.01
    const payFromWallet = payFrom === FUNDING_SOURCE.WALLET ? true : false
    const receiveToWallet = receiveTo === FUNDING_SOURCE.WALLET ? true : false

    await swapPage.navigateTo()
    await swapPage.swapTokens(
      inToken as string,
      outToken as string,
      swapEthAmount.toFixed(5),
      payFromWallet,
      receiveToWallet
    )
  })

  test('Should click max button for wallet', async () => {
    await swapPage.navigateTo()

    await swapPage.selectInputToken('USDC')

    const usdcWalletBalance = await swapPage.getMetamaskTokenBalance('USDC' as string)
    if (!(usdcWalletBalance > 0)) throw new Error(`USDC wallet balance is 0 or could not be read from Metamask`)

    await swapPage.clickMaxButton()
    const inputTokenAmount = await swapPage.getInputTokenAmount()

    expect(closeValues(usdcWalletBalance, parseFloat(inputTokenAmount), 1e-3)).toBe(true)
  })

  test('Should click max button for bento', async () => {
    await swapPage.navigateTo()
    await swapPage.setPayFromWallet(false)

    await swapPage.selectInputToken('USDC')

    const inputTokenBalance = await swapPage.getInputTokenBalance()

    await swapPage.clickMaxButton()
    const inputTokenAmount = await swapPage.getInputTokenAmount()

    expect(closeValues(parseFloat(inputTokenBalance), parseFloat(inputTokenAmount), 1e-3)).toBe(true)
  })

  test('Should switch currencies', async () => {
    await swapPage.navigateTo()

    await swapPage.selectInputToken('USDC')
    await swapPage.selectOutputToken('WETH')

    const selectedInputTokenBefore = await swapPage.getSelectedInputToken()
    const selectedOutputTokenBefore = await swapPage.getSelectedOutputToken()

    expect(selectedInputTokenBefore).toBe('USDC')
    expect(selectedOutputTokenBefore).toBe('WETH')

    await swapPage.clickSwitchCurrenciesButton()

    const selectedInputTokenAfter = await swapPage.getSelectedInputToken()
    const selectedOutputTokenAfter = await swapPage.getSelectedOutputToken()

    expect(selectedInputTokenAfter).toBe('WETH')
    expect(selectedOutputTokenAfter).toBe('USDC')
  })

  test.each(currencySelectCases)(`Should select %p as input and %p as output`, async (inToken, outToken) => {
    await swapPage.navigateTo()

    await swapPage.selectInputToken(inToken)
    await swapPage.selectOutputToken(outToken)

    const selectedInputTokenBefore = await swapPage.getSelectedInputToken()
    const selectedOutputTokenBefore = await swapPage.getSelectedOutputToken()

    expect(selectedInputTokenBefore).toBe(inToken)
    expect(selectedOutputTokenBefore).toBe(outToken)
  })

  test('Should invert rate', async () => {
    const inputAmount = 500

    await swapPage.navigateTo()

    await swapPage.selectInputToken('USDC')
    await swapPage.selectOutputToken('WETH')

    await swapPage.setAmountIn(inputAmount.toString())

    const outputAmount = await swapPage.getOutputTokenAmount()

    const usdcWethRateDisplayed = await swapPage.getRate()
    const usdcWethRateExpected = parseFloat(outputAmount) / inputAmount
    const usdcWethRate = usdcWethRateDisplayed.split('=')[1].trim().split(' ')[0]

    expect(closeValues(usdcWethRateExpected, parseFloat(usdcWethRate), 1e-3)).toBe(true)

    await swapPage.clickInvertRateButton()
    const wethUsdcRateDispayed = await swapPage.getRate()
    const wethUsdcRateExpected = inputAmount / parseFloat(outputAmount)
    const wethUsdcRate = wethUsdcRateDispayed.split('=')[1].trim().split(' ')[0]

    expect(closeValues(wethUsdcRateExpected, parseFloat(wethUsdcRate), 1e-3)).toBe(true)
  })

  test.only('Should change slippage', async () => {
    await swapPage.navigateTo()

    await swapPage.setSlippage('25.00')

    const slippage = await swapPage.getSlippage()

    expect(slippage).toBe('25.00')
  })
})
