import { Dappeteer } from '@chainsafe/dappeteer'
import { Browser, Page } from 'puppeteer'

import { TestHelper } from './helpers/TestHelper'
import { MyWalletPage } from './pages/balances/MyWalletPage'

let browser: Browser
let page: Page
let metamask: Dappeteer

let myWalletPage: MyWalletPage

require('dotenv').config()

let baseUrl: string = process.env.TEST_BASE_URL || 'http://localhost:3000'

jest.retryTimes(1)

describe('Trident Swap:', () => {
  beforeAll(async () => {
    ;[metamask, browser, page] = await TestHelper.initDappeteer()
    myWalletPage = new MyWalletPage(page, metamask, baseUrl)

    await page.goto(baseUrl)
    await page.bringToFront()
  })

  beforeEach(async () => {})

  afterAll(async () => {
    browser.close()
  })

  test.only('Should get correct wallet balances', async () => {
    await myWalletPage.connectMetamaskWallet()

    await myWalletPage.navigateTo()

    const balances = await myWalletPage.getWalletBalances()

    // Get wallet balances list from balance page
    // Get wallet balances list from MM or etherscan
    // Compare balances
  })
})
