import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const archivePath = path.join(rootDir, 'images-archive.json');
const destDir = path.join(rootDir, 'public', 'assets', 'images');

if (!fs.existsSync(archivePath)) {
  console.log('No images-archive.json found. Skipping image restoration.');
  process.exit(0);
}

const archive = JSON.parse(fs.readFileSync(archivePath, 'utf8'));

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

console.log('Restoring images from archive to fix GitHub export corruption...');

for (const [filename, base64] of Object.entries(archive)) {
  const destPath = path.join(destDir, filename);
  const buf = Buffer.from(base64, 'base64');
  
  // Always overwrite to fix any potentially corrupted files
  fs.writeFileSync(destPath, buf);
  console.log(`Restored ${filename} (${buf.length} bytes)`);
}

console.log('Image restoration complete!');
