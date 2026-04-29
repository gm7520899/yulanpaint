import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, loadEnv} from 'vite';

// Plugin to restore corrupted images on build platforms (like Netlify/Vercel)
function restoreImagesPlugin() {
  return {
    name: 'restore-images',
    configResolved() {
      const archivePath = path.resolve(__dirname, 'images-archive.json');
      const destDir = path.resolve(__dirname, 'public', 'assets', 'images');
      
      if (!fs.existsSync(archivePath)) {
        console.log('No images-archive.json found. Skipping image restoration.');
        return;
      }
      
      try {
        const archive = JSON.parse(fs.readFileSync(archivePath, 'utf8'));
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        
        console.log('Restoring images from archive to fix GitHub export corruption...');
        for (const [filename, base64] of Object.entries(archive)) {
          const destPath = path.join(destDir, filename);
          const buf = Buffer.from(base64, 'base64');
          fs.writeFileSync(destPath, buf);
          console.log(`Restored ${filename} (${buf.length} bytes)`);
        }
        console.log('Image restoration complete!');
      } catch (e) {
        console.warn('Image restoration failed (this is non-fatal):', e);
      }
    }
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [restoreImagesPlugin(), react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
