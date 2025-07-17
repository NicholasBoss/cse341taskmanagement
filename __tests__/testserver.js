const { spawn } = require('child_process');
const fetch = require('node-fetch');
const waitOn = require('wait-on');

let serverProcess;

beforeAll(async () => {
  // Start the server.js file
  serverProcess = spawn('node', ['server.js'], {
    stdio: 'inherit', // Optional: show server logs in test output
  });

  // Wait until the server is available
  await waitOn({
    resources: ['http://localhost:3000'],
    timeout: 5000,
  });
});

afterAll(() => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

test('GET / should return welcome message', async () => {
    const response = await fetch('http://localhost:3000/');
    const text = await response.text();

    expect(response.status).toBe(200);
    expect(text).toMatch(/Welcome! Visit \/api-docs/i);
});

test('GET /profile without auth should redirect', async () => {
    const response = await fetch('http://localhost:3000/profile', {
        redirect: 'manual', // Don't auto-follow redirect
    });

    const location = new URL(response.headers.get('location'));
    expect(location.pathname).toBe('/');
});
