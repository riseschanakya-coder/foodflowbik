const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');

const credentialsPath = 'C:\\Users\\nalla\\Downloads\\client_secret_770934559805-rp3gvriqrvc65uk4r0vebibno3jkkn8q.apps.googleusercontent.com.json';
const envPath = path.join(__dirname, '..', '.env');
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
const web = credentials.web;

if (!web?.client_id || !web?.client_secret) {
  throw new Error('The OAuth file does not contain web client credentials.');
}

const current = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const parsed = dotenv.parse(current);
const values = {
  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: web.client_id,
  GOOGLE_CLIENT_ID: web.client_id,
  GOOGLE_CLIENT_SECRET: web.client_secret,
  JWT_SECRET: parsed.JWT_SECRET || crypto.randomBytes(48).toString('hex'),
};
const lines = current.split(/\r?\n/);

for (const [key, value] of Object.entries(values)) {
  const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, '');
  const replacement = `${key}="${escaped}"`;
  const matchingLine = new RegExp(`^\\s*(?:export\\s+)?${key}\\s*=`);
  const index = lines.findIndex((line) => matchingLine.test(line));
  if (index >= 0) lines[index] = replacement;
  else lines.push(replacement);
}

fs.writeFileSync(envPath, `${lines.filter((line, index) => line || index < lines.length - 1).join('\n')}\n`, { mode: 0o600 });
console.log(`OAuth environment configured: ${Object.keys(values).every((key) => Boolean(dotenv.parse(fs.readFileSync(envPath, 'utf8'))[key]))}`);
