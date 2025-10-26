/**
 * E2E Test: Complete Tournament Flow
 * Tests running all 6 races in sequence and tournament lifecycle
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
 * Helper: Complete a single race
 */
async function completeRace(page: any) {
  const startButton = page.getByTestId('start-button')

  const buttonText = await startButton.textContent()
  if (buttonText?.includes('START') || buttonText?.includes('PAUSE')) {
    await startButton.click()
  }

  await page.waitForFunction(
    () => {
      const button = document.querySelector('[data-testid="start-button"]')
      const text = button?.textContent || ''
      return text.includes('NEXT') || text.includes('COMPLETED')
    },
    { timeout: 60000 }
  )
}

test.describe('Complete Tournament', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="game-page"]')
    await generateProgram(page)
  })

  test('should complete all 6 races in sequence', async ({ page }) => {
    test.setTimeout(120000)

    const startButton = page.getByTestId('start-button')
    const raceTrack = page.getByTestId('race-track')
    const resultsPanel = page.getByTestId('results-panel')

    const raceDistances = [1200, 1400, 1600, 1800, 2000, 2200]
    const raceLabels = ['1st', '2nd', '3rd', '4th', '5th', '6th']

    for (let i = 0; i < 6; i++) {
      await expect(raceTrack).toContainText(`Round ${i + 1} - ${raceDistances[i]}m`)

      await completeRace(page)

      await expect(resultsPanel).toContainText(`${raceLabels[i]} Lap - ${raceDistances[i]}m ✓`)

      if (i < 5) {
        await expect(startButton).toContainText('NEXT RACE')
        await startButton.click()
      }
    }

    await expect(startButton).toContainText('ALL RACES COMPLETED')
    await expect(startButton).toBeDisabled()

    for (let i = 0; i < 6; i++) {
      await expect(resultsPanel).toContainText(`${raceLabels[i]} Lap`)
    }
  })

  test('should track race progress correctly in program panel', async ({ page }) => {
    const startButton = page.getByTestId('start-button')
    const programPanel = page.getByTestId('program-panel')

    for (let i = 0; i < 3; i++) {
      await completeRace(page)

      if (i < 2) {
        await startButton.click()
      }
    }

    await expect(programPanel).toContainText('1st Lap - 1200m')
    await expect(programPanel).toContainText('2nd Lap - 1400m')
    await expect(programPanel).toContainText('3rd Lap - 1600m')

    await expect(programPanel).toContainText('4th Lap - 1800m')
    await expect(programPanel).toContainText('5th Lap - 2000m')
    await expect(programPanel).toContainText('6th Lap - 2200m')
  })

  test('should reset tournament when generating new program', async ({ page }) => {
    const generateButton = page.getByTestId('generate-button')
    const startButton = page.getByTestId('start-button')
    const resultsPanel = page.getByTestId('results-panel')
    const raceTrack = page.getByTestId('race-track')

    for (let i = 0; i < 2; i++) {
      await completeRace(page)
      if (i === 0) {
        await startButton.click()
      }
    }

    await expect(resultsPanel).toContainText('1st Lap - 1200m ✓')
    await expect(resultsPanel).toContainText('2nd Lap - 1400m ✓')

    await generateButton.click()
    await page.waitForSelector('[data-testid="horse-card"]', { state: 'visible' })

    await expect(raceTrack).toContainText('Round 1 - 1200m')

    await expect(startButton).toContainText('START')
    await expect(startButton).toBeEnabled()

    await expect(resultsPanel).toContainText('Not started')
  })
})
