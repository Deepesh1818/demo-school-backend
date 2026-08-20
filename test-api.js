const http = require('http');

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const runRequest = (path, method = 'GET', body = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('Starting Goshen API Verification Tests...');
  let testsFailed = 0;

  // 1. Health check test
  try {
    const res = await runRequest('/health');
    if (res.status === 200 && res.body.success) {
      console.log('✓ Health Check Endpoint Passed');
    } else {
      console.error('✗ Health Check Endpoint Failed', res);
      testsFailed++;
    }
  } catch (err) {
    console.error('✗ Health Check Connection Failed. Is the backend server running?');
    process.exit(1);
  }

  // 2. Authentication Login (Invalid credentials check)
  try {
    const res = await runRequest('/auth/login', 'POST', { email: 'fake@wrong.com', password: '123' });
    if (res.status === 401 && !res.body.success) {
      console.log('✓ Authentication Invalid Credentials Check Passed');
    } else {
      console.error('✗ Authentication Invalid Credentials Check Failed', res);
      testsFailed++;
    }
  } catch (err) {
    console.error(err);
    testsFailed++;
  }

  // 3. Authenticate with Demo Admin Credentials
  let adminToken = '';
  try {
    const res = await runRequest('/auth/login', 'POST', {
      email: 'admin@goshenschool.demo',
      password: 'Admin@123'
    });

    if (res.status === 200 && res.body.success && res.body.token) {
      adminToken = res.body.token;
      console.log('✓ Admin Login Verification Passed');
    } else {
      console.error('✗ Admin Login Verification Failed', res);
      testsFailed++;
    }
  } catch (err) {
    console.error(err);
    testsFailed++;
  }

  // 4. Secure Resource check (Get student roster using admin JWT token)
  if (adminToken) {
    try {
      const res = await runRequest('/students', 'GET', null, {
        'Authorization': `Bearer ${adminToken}`
      });

      if (res.status === 200 && res.body.success) {
        console.log(`✓ Admin JWT Authorized Route Access Passed (${res.body.totalCount} students found)`);
      } else {
        console.error('✗ Admin JWT Authorized Route Access Failed', res);
        testsFailed++;
      }
    } catch (err) {
      console.error(err);
      testsFailed++;
    }
  }

  // 5. Public Results analytics dashboard fetch
  try {
    const res = await runRequest('/results/analytics');
    if (res.status === 200 && res.body.success && res.body.data.toppers) {
      console.log('✓ Board Results Dashboard API Passed');
    } else {
      console.error('✗ Board Results Dashboard API Failed', res);
      testsFailed++;
    }
  } catch (err) {
    console.error(err);
    testsFailed++;
  }

  // 6. Public Notices board view
  try {
    const res = await runRequest('/notices');
    if (res.status === 200 && res.body.success) {
      console.log('✓ Public Notices Board API Passed');
    } else {
      console.error('✗ Public Notices Board API Failed', res);
      testsFailed++;
    }
  } catch (err) {
    console.error(err);
    testsFailed++;
  }

  // Final summary
  if (testsFailed === 0) {
    console.log('====================================');
    console.log('ALL BACKEND API TESTS VERIFIED SUCCESSFULLY');
    console.log('====================================');
    process.exit(0);
  } else {
    console.error(`====================================`);
    console.error(`${testsFailed} API VERIFICATION TEST(S) FAILED`);
    console.error(`====================================`);
    process.exit(1);
  }
};

runTests();
