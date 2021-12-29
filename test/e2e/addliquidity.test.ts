import { Dappeteer } from '@chainsafe/dappeteer'
import { Browser, Page } from 'puppeteer'

import { ADDRESSES } from './constants/Addresses'
import { TestHelper } from './helpers/TestHelper'
import { AddLiquidityPage } from './pages/pools/AddLiquidityPage'
import { LiquidityPoolsPage } from './pages/pools/LiquidityPoolsPage'
import { PoolPage } from './pages/pools/PoolPage'

require('dotenv').config()

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
  await liquidityPoolsPage.addTokenToMetamask(ADDRESSES.DAI)
  await liquidityPoolsPage.addTokenToMetamask(ADDRESSES.USDC)
}

jest.retryTimes(1)

describe('Add Liquidity:', () => {
  beforeAll(async () => {
    ;[metamask, browser, page] = await TestHelper.initDappeteer()
    await initPages()
    await importTokens()
  })

  afterAll(async () => {
    browser.close()
  })

  test('Should deposit USDC from wallet unequal amounts', async () => {
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

  test.only('Should deposit ETH from bento & USDC from bento in equal amounts', async () => {
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
    await addLiquidityPage.addLiquidity(t0DepositAmount.toFixed(5), false, false, '', true)

    await page.goto(poolLink)
    await page.waitForSelector(`#pool-title-${targetPoolName}`)

    const positionAfterDeposit = await poolPage.getPoolPosition()
    expect(positionAfterDeposit.token0).toEqual('USDC')
    expect(positionAfterDeposit.token1).toEqual('WETH')

    expect(positionAfterDeposit.amount0).toBeGreaterThan(positionBeforeDeposit.amount0)
    expect(positionAfterDeposit.amount1).toBeGreaterThan(positionBeforeDeposit.amount1)
  })
})
