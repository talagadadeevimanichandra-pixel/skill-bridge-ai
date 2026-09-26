const fs = require('fs');
const path = require('path');

const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', 'uploads', 'coverage', '.system_generated']);
const SECRET_PATTERNS = [
  { name: 'Gemini API Key', regex: /AIza[0-9A-Za-z-_]{35}/g },
  { name: 'MongoDB Connection String with Password', regex: /mongodb(?:\+srv)?:\/\/[a-zA-Z0-9_.-]+:[^@\s/]+@[a-zA-Z0-9_.-]+/g },
  { name: 'Private Key block', regex: /-----BEGIN (?:RSA|OPENSSH|DSA|EC)? PRIVATE KEY-----/g },
  { name: 'AWS Access Key ID', regex: /AKIA[0-9A-Z]{16}/g },
  { name: 'Generic Secret Token pattern', regex: /(?:api_key|secret_key|auth_token)\s*=\s*['"][a-zA-Z0-9_\-]{20,}['"]/gi }
];

const findings = [];

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.isFile()) {
      // Don't scan binary files or large bundles
      if (entry.name.endsWith('.png') || entry.name.endsWith('.jpg') || entry.name.endsWith('.pdf') || entry.name.endsWith('.ico') || entry.name.endsWith('.lock') || entry.name.endsWith('.log')) {
        continue;
      }
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const pattern of SECRET_PATTERNS) {
        const matches = content.match(pattern.regex);
        if (matches) {
          // Exclude comments or placeholder references
          for (const m of matches) {
            if (!m.includes('<username>') && !m.includes('<password>') && !m.includes('your_jwt_secret') && !m.includes('cluster0.abcde')) {
              findings.push({
                file: path.relative(process.cwd(), fullPath),
                type: pattern.name,
                matchSnippet: m.substring(0, 10) + '...' + m.substring(m.length - 4),
              });
            }
          }
        }
      }
    }
  }
}

console.log('=== RUNNING COMPREHENSIVE REPOSITORY SECURITY AUDIT ===\n');
scanDir(process.cwd());

if (findings.length === 0) {
  console.log('✔ [PASS] ZERO exposed secrets detected across all repository source files.');
  process.exit(0);
} else {
  console.error('✘ [FAIL] Potential secrets detected:');
  console.error(findings);
  process.exit(1);
}
