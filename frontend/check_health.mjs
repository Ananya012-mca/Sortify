// Simple Node.js test to check if health endpoint is reachable
(async () => {
  try {
    const response = await fetch('http://localhost:5001/health', {
      method: 'GET',
    });
    const status = response.status;
    const data = await response.json();
    console.log('HEALTH CHECK:', status, JSON.stringify(data));
    process.exit(status === 200 ? 0 : 1);
  } catch (err) {
    console.log('HEALTH CHECK ERROR:', err.message);
    process.exit(1);
  }
})();