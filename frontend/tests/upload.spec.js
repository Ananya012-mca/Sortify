const { test, expect } = require('@playwright/test');
const path = require('path');

test('upload and classify images and open info modal', async ({ page, request }) => {
  // Navigate to upload page
  await page.goto('/upload');

  // Ensure upload prompt present
  await expect(page.locator('text=What are you throwing away?')).toBeVisible();

  // Attach a sample image (we'll create a tiny data URL image file on the fly)
  const sampleImagePath = path.join(__dirname, 'fixtures', 'sample.jpg');

  // If fixture doesn't exist, skip the upload (sanity check in CI)
  const fs = require('fs');
  if (!fs.existsSync(sampleImagePath)) {
    test.skip('No fixture image available');
    return;
  }

  const input = await page.$('input[type=file]');
  await input.setInputFiles(sampleImagePath);

  // Click classify
  await page.click('text=Classify Waste');

  // Wait for results to appear
  await expect(page.locator('text=Classification Results')).toBeVisible({ timeout: 10000 });

  // Ensure at least one result card exists
  const card = page.locator('.classification-card').first();
  await expect(card).toBeVisible();

  // Click the info icon
  const infoButton = card.locator('.info-icon');
  await infoButton.click();

  // Modal should appear with disposal methods header
  await expect(page.locator('text=Disposal Methods')).toBeVisible();
});
