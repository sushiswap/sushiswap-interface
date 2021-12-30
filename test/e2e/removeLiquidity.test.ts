import { Dappeteer, launch, setupMetamask } from '@chainsafe/dappeteer'
import puppeteer, { Browser, Page } from 'puppeteer'

import { LiquidityPoolsPage } from './pages/pools/LiquidityPoolsPage'
import { PoolPage } from './pages/pools/PoolPage'
import { RemoveLiquidityPage } from './pages/pools/RemoveLiquidityPage'

require('dotenv').config()

let seed: string = process.env.TEST_SEED || 'seed seed seed'
let pass: string = process.env.TEST_PASS || 'password'
let baseUrl: string = process.env.TEST_BASE_URL || 'http://localhost:3000'

let browser: Browser
let page: Page
let metamask: Dappeteer

let liquidityPoolsPage: LiquidityPoolsPage
let removeLiquidityPage: RemoveLiquidityPage
let poolPage: PoolPage

async function initPages() {
  liquidityPoolsPage = new LiquidityPoolsPage(page, metamask, `${baseUrl}/trident/pools`)
  poolPage = new PoolPage(page, metamask)
  removeLiquidityPage = new RemoveLiquidityPage(page, metamask)
}

jest.retryTimes(1)

describe('Remove Liquidity:', () => {
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
  })

  afterAll(async () => {
    browser.close()
  })

  test('Remove 25% in equal amounts and withdraw to BentoBox', async () => {
    const targetPoolName = 'USDC-WETH'

    await liquidityPoolsPage.navigateTo()
    await liquidityPoolsPage.connectMetamaskWallet()
    await liquidityPoolsPage.goToPool(targetPoolName)

    const positionBeforeWithdraw = await poolPage.getPoolPosition()
    expect(positionBeforeWithdraw.assetA).toEqual('USDC')
    expect(positionBeforeWithdraw.assetB).toEqual('WETH')
    const poolLink = page.url()

    await poolPage.clickRemoveLiquidityButton()
    await removeLiquidityPage.removeLiquidity(25, false, true)

    await page.goto(poolLink)
    await page.waitForSelector(`#pool-title-${targetPoolName}`)

    const positionAfterDeposit = await poolPage.getPoolPosition()
    expect(positionAfterDeposit.assetA).toEqual('USDC')
    expect(positionAfterDeposit.assetB).toEqual('WETH')

    expect(positionAfterDeposit.amountA).toBeLessThanOrEqual(positionBeforeWithdraw.amountA)
    expect(positionAfterDeposit.amountB).toBeLessThanOrEqual(positionBeforeWithdraw.amountB)
  })
})
