const fs = require('fs');
const path = require('path');

const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', 'coverage']);
const results = {
  localhost: [],
  viteApiUrl: [],
  hardcodedProductionApis: []
};

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.isFile()) {
      if (entry.name.endsWith('.png') || entry.name.endsWith('.svg') || entry.name.endsWith('.ico') || entry.name.endsWith('.lock')) {
        continue;
      }
      const relPath = path.relative(path.join(process.cwd(), 'client'), fullPath);
      const lines = fs.readFileSync(fullPath, 'utf8').split('\n');
      lines.forEach((line, idx) => {
        const lineNum = idx + 1;
        if (line.includes('localhost') || line.includes('127.0.0.1')) {
          results.localhost.push({ file: relPath, lineNum, content: line.trim() });
        }
        if (line.includes('VITE_API_URL')) {
          results.viteApiUrl.push({ file: relPath, lineNum, content: line.trim() });
        }
        if (line.match(/https?:\/\/[a-zA-Z0-9.-]+\/api/i) && !line.includes('example.com') && !line.includes('localhost') && !line.includes('import.meta')) {
          results.hardcodedProductionApis.push({ file: relPath, lineNum, content: line.trim() });
        }
      });
    }
  }
}

scanDir(path.join(process.cwd(), 'client'));

console.log('=== CLIENT API URL AUDIT RESULTS ===\n');

console.log('1. Localhost References:');
if (results.localhost.length === 0) {
  console.log('   None found.');
} else {
  results.localhost.forEach(item => {
    console.log(`   - [${item.file}:${item.lineNum}] ${item.content}`);
  });
}

console.log('\n2. Production API References (VITE_API_URL):');
if (results.viteApiUrl.length === 0) {
  console.log('   None found.');
} else {
  results.viteApiUrl.forEach(item => {
    console.log(`   - [${item.file}:${item.lineNum}] ${item.content}`);
  });
}

console.log('\n3. Hardcoded Production API URLs:');
if (results.hardcodedProductionApis.length === 0) {
  console.log('   NONE');
} else {
  results.hardcodedProductionApis.forEach(item => {
    console.log(`   - [${item.file}:${item.lineNum}] ${item.content}`);
  });
}
