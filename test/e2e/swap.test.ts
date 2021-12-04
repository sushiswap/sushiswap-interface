import { Dappeteer, launch, setupMetamask } from '@chainsafe/dappeteer'
import puppeteer, { Browser, Page } from 'puppeteer'

import { SwapPage } from './pages/swap/SwapPage'

let browser: Browser
let page: Page
let metamask: Dappeteer

let swapPage: SwapPage

require('dotenv').config()

let seed: string = process.env.TEST_SEED || 'seed seed seed'
let pass: string = process.env.TEST_PASS || 'password'
let baseUrl: string = process.env.TEST_BASE_URL || 'http://localhost:3000'

async function initPages() {
  swapPage = new SwapPage(page, metamask, `${baseUrl}/trident/swap`)
}

describe('Trident Swap:', () => {
  beforeAll(async () => {
    browser = await launch(puppeteer, { metamaskVersion: 'v10.1.1', headless: false, defaultViewport: null })
    try {
      metamask = await setupMetamask(browser, { seed: seed, password: pass })
      await metamask.switchNetwork('kovan')
    } catch (error) {
      console.log('Unknown error occurred setting up metamask')
      throw error
    }
    page = await browser.newPage()
    await initPages()
  })

  afterAll(async () => {
    browser.close()
  })

  test('Swap from ETH wallet to USDC wallet', async () => {
    const ethWalletBalance = await metamask.getTokenBalance('ETH')
    const swapEthAmount = ethWalletBalance * 0.1

    await swapPage.swapTokens('ETH', 'USDC', swapEthAmount.toString(), true, true)
  })
})
