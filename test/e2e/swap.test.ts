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
    browser = await launch(puppeteer, {
      metamaskVersion: 'v10.1.1',
      headless: false,
      defaultViewport: null,
      slowMo: 6,
      args: ['--no-sandbox'],
      executablePath: process.env.PUPPETEER_EXEC_PATH,
    })
    try {
      metamask = await setupMetamask(browser, { seed: seed, password: pass })
      await metamask.switchNetwork('kovan')
      await metamask.page.setDefaultTimeout(60000)
    } catch (error) {
      console.log('Unknown error occurred setting up metamask')
      throw error
    }
    page = await browser.newPage()
    await page.setDefaultTimeout(60000)
    await initPages()
  })

  afterAll(async () => {
    browser.close()
  })

  test('Should swap from ETH wallet to USDC wallet', async () => {
    const ethWalletBalance = await metamask.getTokenBalance('ETH')
    const swapEthAmount = ethWalletBalance * 0.01

    await page.goto(baseUrl)
    await page.bringToFront()

    await swapPage.connectMetamaskWallet()
    await swapPage.navigateTo()

    await swapPage.swapTokens('ETH', 'USDC', swapEthAmount.toFixed(5), true, true)
  })
})
