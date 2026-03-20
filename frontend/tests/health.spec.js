const { test, expect } = require('@playwright/test');

test('capture console and /health request', async ({ page }) => {
  const logs = [];
  const requests = [];
  const responses = [];

  page.on('console', msg => logs.push({ type: 'console', text: msg.text(), location: msg.location() }));
  page.on('request', req => requests.push({ url: req.url(), method: req.method() }));
  page.on('response', async res => {
    try {
      const url = res.url();
      const status = res.status();
      let body = '';
      if (url.includes('/health')) {
        try { body = await res.text(); } catch (e) { body = '<no-body>'; }
      }
      responses.push({ url, status, body });
    } catch (e) {
      responses.push({ error: String(e) });
    }
  });

  // Go to the frontend root
  await page.goto('http://localhost:5174/', { waitUntil: 'domcontentloaded', timeout: 10000 });

  // Wait to allow the chat component to mount and perform health check
  await page.waitForTimeout(3000);

  // Print a small snapshot to stdout (Playwright will capture test output)
  console.log('--- CONSOLE LOGS ---');
  for (const l of logs) console.log(JSON.stringify(l));
  console.log('--- REQUESTS ---');
  for (const r of requests) console.log(JSON.stringify(r));
  console.log('--- RESPONSES ---');
  for (const r of responses) console.log(JSON.stringify(r));

  // Basic assertions to fail test if /health didn't return 200
  const healthResp = responses.find(r => r.url && r.url.includes('/health'));
  expect(healthResp).toBeTruthy();
  expect(healthResp.status).toBe(200);
});