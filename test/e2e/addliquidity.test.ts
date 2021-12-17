import { Dappeteer, launch, setupMetamask } from '@chainsafe/dappeteer'
import puppeteer, { Browser, Page } from 'puppeteer'

import { TOKEN_ADDRESSES } from './constants/TokenAddresses'
import { AddLiquidityPage } from './pages/pools/AddLiquidityPage'
import { LiquidityPoolsPage } from './pages/pools/LiquidityPoolsPage'
import { PoolPage } from './pages/pools/PoolPage'

require('dotenv').config()

let seed: string = process.env.TEST_SEED || 'seed seed seed'
let pass: string = process.env.TEST_PASS || 'password'
let baseUrl: string = process.env.TEST_BASE_URL || 'http://localhost:3000'

let browser: Browser
let page: Page
let metamask: Dappeteer

let liquidityPoolsPage: LiquidityPoolsPage
let poolPage: PoolPage
let addLiquidityPage: AddLiquidityPage

async function initPages() {
  liquidityPoolsPage = new LiquidityPoolsPage(page, metamask, `${baseUrl}/trident/pools`)
  poolPage = new PoolPage(page, metamask)
  addLiquidityPage = new AddLiquidityPage(page, metamask)
}

async function importTokens() {
  await liquidityPoolsPage.addTokenToMetamask(TOKEN_ADDRESSES.DAI)
  await liquidityPoolsPage.addTokenToMetamask(TOKEN_ADDRESSES.USDC)
}

jest.retryTimes(1)

describe('Add Liquidity:', () => {
  beforeAll(async () => {
    browser = await launch(puppeteer, {
      metamaskVersion: 'v10.1.1',
      headless: false,
      defaultViewport: null,
      slowMo: 5,
      args: ['--no-sandbox'],
      executablePath: process.env.TEST_PUPPETEER_EXEC_PATH,
    })
    try {
      metamask = await setupMetamask(browser, { seed: seed, password: pass })
      await metamask.switchNetwork('kovan')
      await metamask.page.setDefaultTimeout(180000)
    } catch (error) {
      console.log('Unknown error occurred setting up metamask')
      throw error
    }
    page = await browser.newPage()
    await page.setDefaultTimeout(180000)
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36'
    )
    await initPages()
    await importTokens()
  })

  afterAll(async () => {
    browser.close()
  })

  test('Spend USDC from wallet unequal amounts', async () => {
    const targetPoolName = 'USDC-WETH'
    const usdcWalletBalance = await liquidityPoolsPage.getMetamaskTokenBalance('USDC')
    const t0DepositAmount: number = usdcWalletBalance * 0.1

    await liquidityPoolsPage.navigateTo()
    await liquidityPoolsPage.connectMetamaskWallet()
    await liquidityPoolsPage.goToPool(targetPoolName)

    const positionBeforeDeposit = await poolPage.getPoolPosition()
    expect(positionBeforeDeposit.token0).toEqual('USDC')
    expect(positionBeforeDeposit.token1).toEqual('WETH')
    const poolLink = page.url()

    await poolPage.clickAddLiquidityButton()
    await addLiquidityPage.addLiquidity(t0DepositAmount.toFixed(5))

    await page.goto(poolLink)
    await page.waitForSelector(`#pool-title-${targetPoolName}`)

    const positionAfterDeposit = await poolPage.getPoolPosition()
    expect(positionAfterDeposit.token0).toEqual('USDC')
    expect(positionAfterDeposit.token1).toEqual('WETH')

    expect(positionAfterDeposit.amount0).toBeGreaterThan(positionBeforeDeposit.amount0)
    expect(positionAfterDeposit.amount1).toBeGreaterThan(positionBeforeDeposit.amount1)
  })
})
