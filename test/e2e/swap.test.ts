import { Dappeteer } from '@chainsafe/dappeteer'
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
  // ['ETH', FUNDING_SOURCE.WALLET, 'USDC', FUNDING_SOURCE.WALLET],
  // ['WETH', FUNDING_SOURCE.WALLET, 'USDC', FUNDING_SOURCE.WALLET],
  // ['ETH', FUNDING_SOURCE.WALLET, 'USDC', FUNDING_SOURCE.BENTO],
  // ['WETH', FUNDING_SOURCE.WALLET, 'USDC', FUNDING_SOURCE.BENTO],
  // ['ETH', FUNDING_SOURCE.BENTO, 'USDC', FUNDING_SOURCE.WALLET],
  // ['ETH', FUNDING_SOURCE.WALLET, 'WETH', FUNDING_SOURCE.WALLET],
  // ['WETH', FUNDING_SOURCE.WALLET, 'ETH', FUNDING_SOURCE.WALLET],
  // ['WETH', FUNDING_SOURCE.BENTO, 'ETH', FUNDING_SOURCE.WALLET],
  ['ETH', FUNDING_SOURCE.BENTO, 'USDC', FUNDING_SOURCE.BENTO],
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

  test.skip.each(cases)(`Should swap from %p %p to %p %p`, async (inToken, payFrom, outToken, receiveTo) => {
    const ethWalletBalance = await swapPage.getTokenBalance(inToken as string)
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

  test('Click max button for wallet', async () => {
    await swapPage.navigateTo()

    await swapPage.selectToken('USDC')

    const usdcWalletBalance = await swapPage.getTokenBalance('USDC' as string)
    if (!(usdcWalletBalance > 0)) throw new Error(`USDC wallet balance is 0 or could not be read from Metamask`)

    await swapPage.clickMaxButton()
    const inputTokenAmount = await swapPage.getInputTokenAmount()

    expect(inputTokenAmount).toBe(usdcWalletBalance)
  })
})
