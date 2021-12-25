import { Dappeteer } from '@chainsafe/dappeteer'
import { closeValues } from '@sushiswap/tines'
import { Browser, Page } from 'puppeteer'

import { ADDRESSES } from './constants/Addresses'
import { FUNDING_SOURCE } from './constants/FundingSource'
import { ApprovalHelper } from './helpers/ApprovalHelper'
import { TestHelper } from './helpers/TestHelper'
import { SwapPage } from './pages/swap/SwapPage'

let browser: Browser
let page: Page
let metamask: Dappeteer

let swapPage: SwapPage

require('dotenv').config()

let baseUrl: string = process.env.TEST_BASE_URL || 'http://localhost:3000'
let account2PubKey: string = process.env.TEST_ACCOUNT2_PUB_KEY || ''

let approvalHelper: ApprovalHelper

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
  ['USDC', FUNDING_SOURCE.WALLET, 'ETH', FUNDING_SOURCE.WALLET],
  ['USDC', FUNDING_SOURCE.WALLET, 'WETH', FUNDING_SOURCE.WALLET],
  ['USDC', FUNDING_SOURCE.WALLET, 'WETH', FUNDING_SOURCE.BENTO],
  ['USDC', FUNDING_SOURCE.BENTO, 'WETH', FUNDING_SOURCE.BENTO],
  ['USDC', FUNDING_SOURCE.BENTO, 'ETH', FUNDING_SOURCE.WALLET],
  ['USDC', FUNDING_SOURCE.BENTO, 'WETH', FUNDING_SOURCE.WALLET],
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
    approvalHelper = new ApprovalHelper()

    await page.goto(baseUrl)
    await page.bringToFront()

    await swapPage.connectMetamaskWallet()
    await swapPage.addTokenToMetamask(ADDRESSES.WETH)
    await swapPage.addTokenToMetamask(ADDRESSES.USDC)
    await swapPage.addTokenToMetamask(ADDRESSES.BAT)
  })

  beforeEach(async () => {
    await swapPage.blockingWait(2, true)
  })

  afterAll(async () => {
    browser.close()
  })

  test.each(cases)(`Should swap from %p %p to %p %p`, async (inToken, payFrom, outToken, receiveTo) => {
    const tokenWalletBalance = await swapPage.getMetamaskTokenBalance(inToken as string)
    if (!(tokenWalletBalance > 0)) throw new Error(`${inToken} wallet balance is 0 or could not be read from Metamask`)

    const swapAmount = tokenWalletBalance * 0.01
    const payFromWallet = payFrom === FUNDING_SOURCE.WALLET ? true : false
    const receiveToWallet = receiveTo === FUNDING_SOURCE.WALLET ? true : false

    await swapPage.navigateTo()
    await swapPage.swapTokens(
      inToken as string,
      outToken as string,
      swapAmount.toFixed(5),
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

  test('Should change slippage', async () => {
    await swapPage.navigateTo()

    await swapPage.setSlippage('25.00')

    const slippage = await swapPage.getSlippage()

    expect(slippage).toBe('25.00')
  })

  test('Should swap ETH from wallet to USDC bento with other recipient', async () => {
    const inToken = 'ETH'
    const outToken = 'USDC'

    let recipientBrowser: Browser
    let recipientPage: Page
    let recipientMetamask: Dappeteer
    ;[recipientMetamask, recipientBrowser, recipientPage] = await TestHelper.initDappeteer(
      process.env.TEST_SEED2,
      process.env.TEST_PASS
    )

    const recipientSwapPage = new SwapPage(recipientPage, recipientMetamask, `${baseUrl}/trident/swap`)
    await recipientPage.goto(baseUrl)
    await recipientPage.bringToFront()
    await recipientSwapPage.connectMetamaskWallet()

    await recipientSwapPage.navigateTo()
    const account2BentoBalanceBefore = await recipientSwapPage.getBentoBalance(outToken)

    const tokenWalletBalance = await swapPage.getMetamaskTokenBalance(inToken)
    if (!(tokenWalletBalance > 0)) throw new Error(`${inToken} wallet balance is 0 or could not be read from Metamask`)

    const swapAmount = (tokenWalletBalance * 0.01).toFixed(5)

    await swapPage.navigateTo()
    await swapPage.toggleExpertMode()
    await swapPage.addRecipient(account2PubKey)
    await swapPage.selectInputToken(inToken)
    await swapPage.selectOutputToken(outToken)
    await swapPage.setAmountIn(swapAmount)
    await swapPage.setPayFromWallet(true)
    await swapPage.setReceiveToWallet(false)

    const expectedOutputAmount = await swapPage.getOutputTokenAmount()
    await swapPage.confirmSwap(inToken, outToken)

    const account2BentoBalanceAfter = await recipientSwapPage.getBentoBalance(outToken)
    expect(account2BentoBalanceAfter !== account2BentoBalanceBefore).toBe(true)

    const account2BalanceDifference = parseFloat(account2BentoBalanceAfter) - parseFloat(account2BentoBalanceBefore)

    await recipientBrowser.close()

    expect(closeValues(parseFloat(expectedOutputAmount), account2BalanceDifference, 1e-3)).toBe(true)
  })

  test('Should swap ETH from wallet to USDC wallet with other recipient', async () => {
    const inToken = 'ETH'
    const outToken = 'USDC'

    let recipientBrowser: Browser
    let recipientPage: Page
    let recipientMetamask: Dappeteer
    ;[recipientMetamask, recipientBrowser, recipientPage] = await TestHelper.initDappeteer(
      process.env.TEST_SEED2,
      process.env.TEST_PASS
    )

    const recipientSwapPage = new SwapPage(recipientPage, recipientMetamask, `${baseUrl}/trident/swap`)
    await recipientPage.goto(baseUrl)
    await recipientPage.bringToFront()
    await recipientSwapPage.connectMetamaskWallet()

    await recipientSwapPage.navigateTo()
    const account2BentoBalanceBefore = await recipientSwapPage.getWalletBalance(outToken)

    const tokenWalletBalance = await swapPage.getMetamaskTokenBalance(inToken)
    if (!(tokenWalletBalance > 0)) throw new Error(`${inToken} wallet balance is 0 or could not be read from Metamask`)

    const swapAmount = (tokenWalletBalance * 0.01).toFixed(5)

    await swapPage.navigateTo()
    await swapPage.toggleExpertMode()
    await swapPage.addRecipient(account2PubKey)
    await swapPage.selectInputToken(inToken)
    await swapPage.selectOutputToken(outToken)
    await swapPage.setAmountIn(swapAmount)
    await swapPage.setPayFromWallet(true)
    await swapPage.setReceiveToWallet(true)

    const expectedOutputAmount = await swapPage.getOutputTokenAmount()
    await swapPage.confirmSwap(inToken, outToken)

    const account2BentoBalanceAfter = await recipientSwapPage.getWalletBalance(outToken)
    expect(account2BentoBalanceAfter !== account2BentoBalanceBefore).toBe(true)

    const account2BalanceDifference = parseFloat(account2BentoBalanceAfter) - parseFloat(account2BentoBalanceBefore)
    await recipientBrowser.close()

    expect(closeValues(parseFloat(expectedOutputAmount), account2BalanceDifference, 1e-3)).toBe(true)
  })

  test('Should reset recipient address when expert mode is disabled', async () => {
    await swapPage.navigateTo()
    await swapPage.toggleExpertMode() // enable expert mode
    await swapPage.addRecipient('potato')

    const recipientAddressBefore = await swapPage.getRecipient()
    expect(recipientAddressBefore).toBe('potato')
    await swapPage.toggleExpertMode() // disable expert mode

    await swapPage.navigateTo()

    await swapPage.toggleExpertMode() // enable expert mode
    const recipientAddressAfter = await swapPage.getRecipient()
    expect(recipientAddressAfter).toBe('')
  })

  test.each([
    ['USDC', FUNDING_SOURCE.WALLET, 'ETH', FUNDING_SOURCE.BENTO],
    ['USDC', FUNDING_SOURCE.BENTO, 'ETH', FUNDING_SOURCE.BENTO],
  ])(`Should add WETH to Bento when swapping from %p %p to %p %p`, async (inToken, payFrom, outToken, receiveTo) => {
    const tokenWalletBalance = await swapPage.getMetamaskTokenBalance(inToken)
    if (!(tokenWalletBalance > 0)) throw new Error(`${inToken} wallet balance is 0 or could not be read from Metamask`)

    const swapAmount = (tokenWalletBalance * 0.01).toFixed(5)
    const payFromWallet = payFrom === FUNDING_SOURCE.WALLET ? true : false
    const receiveToWallet = receiveTo === FUNDING_SOURCE.WALLET ? true : false

    await swapPage.navigateTo()

    const wethBentoBalanceBefore = await swapPage.getBentoBalance('WETH')

    await swapPage.selectInputToken(inToken)
    await swapPage.selectOutputToken(outToken)
    await swapPage.setAmountIn(swapAmount)
    await swapPage.setPayFromWallet(payFromWallet)
    await swapPage.setReceiveToWallet(receiveToWallet)

    const expectedOutputAmount = await swapPage.getOutputTokenAmount()
    await swapPage.confirmSwap(inToken, outToken)

    await swapPage.navigateTo()
    const wethBentoBalanceAfter = await swapPage.getBentoBalance('WETH')
    expect(wethBentoBalanceAfter !== wethBentoBalanceBefore).toBe(true)

    const wethBalanceDiff = parseFloat(wethBentoBalanceAfter) - parseFloat(wethBentoBalanceBefore)
    expect(closeValues(parseFloat(expectedOutputAmount), wethBalanceDiff, 1e-3)).toBe(true)
  })

  test('Should require approval of token when swapping from wallet', async () => {
    await approvalHelper.approveRouter(ADDRESSES.BAT, 0)

    const inToken = 'BAT'
    const outToken = 'ETH'

    const tokenWalletBalance = await swapPage.getMetamaskTokenBalance(inToken)
    if (!(tokenWalletBalance > 0)) throw new Error(`${inToken} wallet balance is 0 or could not be read from Metamask`)

    const swapAmount = (tokenWalletBalance * 0.01).toFixed(5)

    await swapPage.navigateTo()
    await swapPage.selectInputToken(inToken)
    await swapPage.selectOutputToken(outToken)
    await swapPage.setAmountIn(swapAmount)
    await swapPage.setPayFromWallet(true)
    await swapPage.setReceiveToWallet(true)

    const requiresApprovalBefore = await swapPage.requiresApproval()
    expect(requiresApprovalBefore).toBe(true)

    await swapPage.approveToken()
    await swapPage.confirmSwap(inToken, outToken)

    await swapPage.navigateTo()
    await swapPage.selectInputToken(inToken)
    await swapPage.selectOutputToken(outToken)
    await swapPage.setAmountIn(swapAmount)
    await swapPage.setPayFromWallet(true)
    await swapPage.setReceiveToWallet(true)

    const requiresApprovalAfter = await swapPage.requiresApproval()
    expect(requiresApprovalAfter).toBe(false)
  })

  test('Should require approval once when swapping from BentoBox', async () => {
    await approvalHelper.approveRouter(ADDRESSES.USDC, 0)

    const inToken = 'USDC'
    const outToken = 'ETH'

    const tokenWalletBalance = await swapPage.getMetamaskTokenBalance(inToken)
    if (!(tokenWalletBalance > 0)) throw new Error(`${inToken} wallet balance is 0 or could not be read from Metamask`)

    const swapAmount = (tokenWalletBalance * 0.01).toFixed(5)

    await swapPage.navigateTo()
    await swapPage.selectInputToken(inToken)
    await swapPage.selectOutputToken(outToken)
    await swapPage.setAmountIn(swapAmount)
    await swapPage.setPayFromWallet(false)
    await swapPage.setReceiveToWallet(true)

    const requiresApprovalBefore = await swapPage.requiresApproval()
    expect(requiresApprovalBefore).toBe(true)

    await swapPage.approveToken()
    await swapPage.confirmSwap(inToken, outToken)

    await swapPage.navigateTo()
    await swapPage.selectInputToken(inToken)
    await swapPage.selectOutputToken(outToken)
    await swapPage.setAmountIn(swapAmount)
    await swapPage.setPayFromWallet(true)
    await swapPage.setReceiveToWallet(true)

    const requiresApprovalAfter = await swapPage.requiresApproval()
    expect(requiresApprovalAfter).toBe(false)

    await approvalHelper.approveRouter(ADDRESSES.USDC, 2 ^ (256 - 1))
  })

  test.each([
    ['USDC', FUNDING_SOURCE.WALLET, 'ETH', FUNDING_SOURCE.BENTO],
    ['USDC', FUNDING_SOURCE.BENTO, 'ETH', FUNDING_SOURCE.BENTO],
  ])(`Should display insufficient balance when not enough %p in %p`, async (inToken, payFrom, outToken, receiveTo) => {
    const tokenWalletBalance = await swapPage.getMetamaskTokenBalance(inToken)
    if (!(tokenWalletBalance > 0)) throw new Error(`${inToken} wallet balance is 0 or could not be read from Metamask`)

    const swapAmount = (tokenWalletBalance * 100).toFixed(5)
    const payFromWallet = payFrom === FUNDING_SOURCE.WALLET ? true : false
    const receiveToWallet = receiveTo === FUNDING_SOURCE.WALLET ? true : false

    await swapPage.navigateTo()
    await swapPage.selectInputToken(inToken)
    await swapPage.selectOutputToken(outToken)
    await swapPage.setAmountIn(swapAmount)
    await swapPage.setPayFromWallet(payFromWallet)
    await swapPage.setReceiveToWallet(receiveToWallet)

    const swapButtonText = await swapPage.getSwapButtonText()

    expect(swapButtonText).toBe(`Insufficient ${inToken} balance`)
  })
})
