// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import { fulldetailsMap } from '../maps/fulldetailsview'
import { setDefaultOptions } from 'expect-puppeteer'

const puppeteer = require('puppeteer')
const defaultTimeout = process.env.JEST_TIMEOUT ? process.env.JEST_TIMEOUT : 30000

setDefaultOptions({ timeout: defaultTimeout })
let browser
let page

describe(
  'Full details page',
  () => {
    beforeAll(async () => {
      jest.setTimeout(defaultTimeout)
      browser = await puppeteer.launch({ headless: process.env.NODE_ENV !== 'debug', slowMo: 80 })
      page = await browser.newPage()
      await page.setViewport({ width: 1920, height: 1080 })
      await page.goto(
        `${__HOST__}/definitions/git/github/automattic/mongoose/1ead0e616ab028a994ab47a23643749659243e07`,
        { waitUntil: 'domcontentloaded' }
      )
    })

    afterAll(() => {
      browser.close()
    })

    test('should display the FileList component on the page', async () => {
      await page.waitForSelector(fulldetailsMap.fileList.identifier)
      await expect(page).toMatchElement(fulldetailsMap.fileList.identifier)
    })

    test('FileList should have Name, Facets, Licenses, Copyrights columns', async () => {
      await page.waitForSelector(fulldetailsMap.fileList.columns.name.identifier)
      await expect(page).toMatchElement(fulldetailsMap.fileList.columns.name.identifier)
      await page.waitForSelector(fulldetailsMap.fileList.columns.facets.identifier)
      await expect(page).toMatchElement(fulldetailsMap.fileList.columns.facets.identifier)
      await page.waitForSelector(fulldetailsMap.fileList.columns.license.identifier)
      await expect(page).toMatchElement(fulldetailsMap.fileList.columns.license.identifier)
      await page.waitForSelector(fulldetailsMap.fileList.columns.copyrights.identifier)
      await expect(page).toMatchElement(fulldetailsMap.fileList.columns.copyrights.identifier)
    })

    test('first row of FileList should be a folder', async () => {
      await page.waitForSelector(fulldetailsMap.fileList.firstRow)
      await expect(page).toMatchElement(fulldetailsMap.fileList.firstRow)

      await page.waitForSelector(
        `${fulldetailsMap.fileList.firstRow} > ${fulldetailsMap.fileList.columns.name.identifier}`
      )
      await expect(page).toMatchElement(
        `${fulldetailsMap.fileList.firstRow} > ${fulldetailsMap.fileList.columns.name.identifier}`
      )
      await page.waitForSelector(
        `${fulldetailsMap.fileList.firstRow} > ${fulldetailsMap.fileList.columns.name.identifier} > ${
          fulldetailsMap.fileList.folderIcon
        }`,
        {
          visible: true
        }
      )
      await expect(page).toMatchElement(
        `${fulldetailsMap.fileList.firstRow} > ${fulldetailsMap.fileList.columns.name.identifier} > ${
          fulldetailsMap.fileList.folderIcon
        }`
      )

      const nameContent = await page.$eval(
        `${fulldetailsMap.fileList.firstRow} > ${fulldetailsMap.fileList.columns.name.identifier}`,
        el => el.textContent
      )
      await expect(nameContent).toMatch(fulldetailsMap.fileList.firstRowContent)
    })

    test('last row of FileList should be a file', async () => {
      await page.waitForSelector(fulldetailsMap.fileList.lastRow)
      await expect(page).toMatchElement(fulldetailsMap.fileList.lastRow)
      await page.waitForSelector(
        `${fulldetailsMap.fileList.lastRow} > ${fulldetailsMap.fileList.columns.name.identifier}`
      )
      await expect(page).toMatchElement(
        `${fulldetailsMap.fileList.lastRow} > ${fulldetailsMap.fileList.columns.name.identifier}`
      )

      await page.waitForSelector(
        `${fulldetailsMap.fileList.lastRow} > ${fulldetailsMap.fileList.columns.name.identifier} > ${
          fulldetailsMap.fileList.folderIcon
        }`,
        {
          hidden: true
        }
      )
      await expect(page).toMatchElement(
        `${fulldetailsMap.fileList.lastRow} > ${fulldetailsMap.fileList.columns.name.identifier} > ${
          fulldetailsMap.fileList.folderIcon
        }`
      )

      await expect(nameContent).toMatch(fulldetailsMap.fileList.lastRowContent)
      const nameContent = await page.$eval(
        `${fulldetailsMap.fileList.lastRow} > ${fulldetailsMap.fileList.columns.name.identifier}`,
        el => el.textContent
      )
      await expect(nameContent).toMatch(fulldetailsMap.fileList.lastRowContent)
    })
  },
  defaultTimeout
)
