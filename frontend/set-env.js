const fs = require('fs');
const path = require('path');

// Read Clarity Project ID from Vercel environment variables
const clarityProjectId = process.env.CLARITY_PROJECT_ID || '';

const envFileContent = `export const environment = {
  production: true,
  clarityProjectId: '${clarityProjectId}'
};
`;

const targetPath = path.join(__dirname, 'src', 'environments', 'environment.prod.ts');

console.log('Generating environment.prod.ts dynamically...');
try {
  fs.writeFileSync(targetPath, envFileContent, { encoding: 'utf8' });
  console.log(`Successfully generated environment.prod.ts. CLARITY_PROJECT_ID: "${clarityProjectId || 'EMPTY'}"`);
} catch (err) {
  console.error('Error writing environment.prod.ts:', err);
  process.exit(1);
}
