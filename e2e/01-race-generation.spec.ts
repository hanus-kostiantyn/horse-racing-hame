/**
 * E2E Test: Race Generation Flow
 */

import { test, expect } from '@playwright/test'

test.describe('Race Generation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="game-page"]')
  })

  test('should display initial empty state correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Horse Racing')

    const generateButton = page.getByTestId('generate-button')
    await expect(generateButton).toBeEnabled()
    await expect(generateButton).toContainText('GENERATE PROGRAM')

    const startButton = page.getByTestId('start-button')
    await expect(startButton).toBeDisabled()

    const horsePanel = page.getByTestId('horse-panel')
    await expect(horsePanel).toContainText('No horses generated yet')

    const programPanel = page.getByTestId('program-panel')
    await expect(programPanel).toContainText('No program generated yet')

    const resultsPanel = page.getByTestId('results-panel')
    await expect(resultsPanel).toContainText('No results yet')

    const raceTrack = page.getByTestId('race-track')
    await expect(raceTrack).toContainText('Generate a program to start racing')
  })

  test('should generate complete program with horses and races', async ({ page }) => {
    const generateButton = page.getByTestId('generate-button')

    await generateButton.click()

    await page.waitForSelector('[data-testid="horse-card"]', { state: 'visible' })

    const horseCards = page.getByTestId('horse-card')
    await expect(horseCards).toHaveCount(20)

    const firstHorse = horseCards.first()
    await expect(firstHorse).toBeVisible()

    const programPanel = page.getByTestId('program-panel')
    await expect(programPanel).toContainText('1st Lap - 1200m')
    await expect(programPanel).toContainText('2nd Lap - 1400m')
    await expect(programPanel).toContainText('3rd Lap - 1600m')
    await expect(programPanel).toContainText('4th Lap - 1800m')
    await expect(programPanel).toContainText('5th Lap - 2000m')
    await expect(programPanel).toContainText('6th Lap - 2200m')

    const raceTrack = page.getByTestId('race-track')
    await expect(raceTrack).toContainText('Round 1 - 1200m')

    const startButton = page.getByTestId('start-button')
    await expect(startButton).toBeEnabled()
    await expect(startButton).toContainText('START')

    await expect(generateButton).toContainText('REGENERATE PROGRAM')
  })
})
