/**
 * E2E Test: Race Execution Flow
 */

import { test, expect } from '@playwright/test'

/**
 * Helper: Generate program for tests
 */
async function generateProgram(page: any) {
  await page.getByTestId('generate-button').click()
  await page.waitForSelector('[data-testid="horse-card"]', { state: 'visible' })
}

/**
 * Helper: Wait for race to complete
 */
async function waitForRaceCompletion(page: any) {
  await page.waitForFunction(
    () => {
      const button = document.querySelector('[data-testid="start-button"]')
      return button?.textContent?.includes('NEXT RACE') || button?.textContent?.includes('ALL RACES COMPLETED')
    },
    { timeout: 30000 }
  )
}

test.describe('Race Execution', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="game-page"]')
    await generateProgram(page)
  })

  test('should start and complete a race successfully', async ({ page }) => {
    const startButton = page.getByTestId('start-button')
    const raceTrack = page.getByTestId('race-track')
    const resultsPanel = page.getByTestId('results-panel')

    await expect(startButton).toContainText('START')
    await expect(startButton).toBeEnabled()

    await startButton.click()

    await expect(startButton).toContainText('PAUSE')
    await expect(raceTrack).toContainText('RACING')

    await waitForRaceCompletion(page)

    await expect(startButton).toContainText('NEXT RACE')

    await expect(resultsPanel).toContainText('1st Lap - 1200m ✓')

    await expect(resultsPanel).toContainText('01')
    await expect(resultsPanel).toContainText('10')
  })

  test('should pause and resume race correctly', async ({ page }) => {
    const startButton = page.getByTestId('start-button')
    const raceTrack = page.getByTestId('race-track')

    await startButton.click()
    await expect(startButton).toContainText('PAUSE')
    await expect(raceTrack).toContainText('RACING')

    await startButton.click()
    await expect(startButton).toContainText('START')
    await expect(raceTrack).not.toContainText('RACING')

    await startButton.click()
    await expect(startButton).toContainText('PAUSE')
    await expect(raceTrack).toContainText('RACING')

    await waitForRaceCompletion(page)
    await expect(startButton).toContainText('NEXT RACE')
  })

  test('should prevent generating new program while racing', async ({ page }) => {
    const startButton = page.getByTestId('start-button')
    const generateButton = page.getByTestId('generate-button')

    await expect(generateButton).toBeEnabled()

    await startButton.click()

    await expect(generateButton).toBeDisabled()

    await startButton.click()

    await expect(generateButton).toBeEnabled()
  })
})
