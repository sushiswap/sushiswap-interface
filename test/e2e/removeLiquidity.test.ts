import * as dappeteer from '@chainsafe/dappeteer'
import { Dappeteer } from '@chainsafe/dappeteer'
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

describe.skip('Remove Liquidity:', () => {
  beforeAll(async () => {
    browser = await dappeteer.launch(puppeteer, { metamaskVersion: 'v10.1.1', headless: false, defaultViewport: null })
    try {
      metamask = await dappeteer.setupMetamask(browser, { seed: seed, password: pass })
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

  test('Remove 25% in equal amounts and withdraw to BentoBox', async () => {
    const targetPoolName = 'USDC-WETH'

    await liquidityPoolsPage.navigateTo()
    await liquidityPoolsPage.connectMetamaskWallet()
    await liquidityPoolsPage.goToPool(targetPoolName)

    const positionBeforeWithdraw = await poolPage.getPoolPosition()
    expect(positionBeforeWithdraw.token0).toEqual('USDC')
    expect(positionBeforeWithdraw.token1).toEqual('WETH')
    const poolLink = page.url()

    await poolPage.clickRemoveLiquidityButton()
    await removeLiquidityPage.removeLiquidity(25, false, true)

    await page.goto(poolLink)
    await page.waitForSelector(`#pool-title-${targetPoolName}`)

    const positionAfterDeposit = await poolPage.getPoolPosition()
    expect(positionAfterDeposit.token0).toEqual('USDC')
    expect(positionAfterDeposit.token1).toEqual('WETH')

    expect(positionAfterDeposit.amount0).toBeLessThanOrEqual(positionBeforeWithdraw.amount0)
    expect(positionAfterDeposit.amount1).toBeLessThanOrEqual(positionBeforeWithdraw.amount1)
  })
})
