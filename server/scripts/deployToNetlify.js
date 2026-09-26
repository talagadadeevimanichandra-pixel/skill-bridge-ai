const fs = require('fs');
const path = require('path');
const https = require('https');

const NETLIFY_TOKEN = process.env.NETLIFY_AUTH_TOKEN || '';
const ZIP_PATH = path.join(process.cwd(), 'dist.zip');

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(data);
        const text = buffer.toString('utf8');
        try {
          resolve({ status: res.statusCode, data: JSON.parse(text) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: text });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function deploy() {
  console.log('🚀 DEPLOYING SKILLBRIDGE AI TO NETLIFY VIA DIRECT API...\n');

  if (!fs.existsSync(ZIP_PATH)) {
    throw new Error('dist.zip not found! Please create it first.');
  }

  const zipBuffer = fs.readFileSync(ZIP_PATH);
  console.log(`📦 Loaded dist.zip (${(zipBuffer.length / 1024).toFixed(1)} KB)`);

  // 1. Check existing sites
  console.log('🔍 Checking Netlify sites...');
  const sitesRes = await request({
    hostname: 'api.netlify.com',
    path: '/api/v1/sites',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${NETLIFY_TOKEN}`,
      'User-Agent': 'SkillBridge-Deployer'
    }
  });

  let site = null;
  if (Array.isArray(sitesRes.data)) {
    site = sitesRes.data.find(s => s.name.includes('skillbridge-ai') || s.custom_domain?.includes('skillbridge'));
  }

  // 2. Create site if needed
  if (!site) {
    const siteName = `skillbridge-ai-${Math.random().toString(36).substring(2, 7)}`;
    console.log(`✨ Creating new Netlify site: ${siteName}...`);
    const createRes = await request({
      hostname: 'api.netlify.com',
      path: '/api/v1/sites',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NETLIFY_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'SkillBridge-Deployer'
      }
    }, JSON.stringify({ name: siteName }));

    if (createRes.status !== 200 && createRes.status !== 201) {
      console.error('Failed to create site:', createRes);
      throw new Error(`Site creation failed with status ${createRes.status}`);
    }
    site = createRes.data;
  }

  console.log(`🎯 Target Site: ${site.name} (ID: ${site.id})`);
  console.log(`🌐 Target URL: ${site.ssl_url || site.url}`);

  // 3. Deploy ZIP buffer
  console.log('📤 Uploading build assets to Netlify Production...');
  const deployRes = await request({
    hostname: 'api.netlify.com',
    path: `/api/v1/sites/${site.id}/deploys`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NETLIFY_TOKEN}`,
      'Content-Type': 'application/zip',
      'Content-Length': zipBuffer.length,
      'User-Agent': 'SkillBridge-Deployer'
    }
  }, zipBuffer);

  if (deployRes.status === 200 || deployRes.status === 201) {
    console.log('\n====================================================');
    console.log('🎉 DEPLOYMENT SUCCESSFUL!');
    console.log('====================================================');
    console.log(`🔗 LIVE URL: ${deployRes.data.ssl_url || deployRes.data.url || site.ssl_url || site.url}`);
    console.log(`🆔 Deploy ID: ${deployRes.data.id}`);
    console.log(`⏱️ State: ${deployRes.data.state}`);
    console.log('====================================================\n');
  } else {
    console.error('✘ Deploy failed:', deployRes);
    throw new Error(`Deploy failed with status ${deployRes.status}`);
  }
}

deploy().catch(err => {
  console.error('Deployment error:', err.message || err);
  process.exit(1);
});
