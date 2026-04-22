import tailwind from "tailwindcss";
import { defineConfig } from "vite";
import { copyFileSync, readdirSync, statSync, mkdirSync } from 'fs';
import { join } from 'path';

// Custom plugin to copy public files with error handling
function copyPublicPlugin() {
  return {
    name: 'copy-public-safe',
    writeBundle() {
      const copyDir = (src: string, dest: string) => {
        try {
          mkdirSync(dest, { recursive: true });
          const entries = readdirSync(src, { withFileTypes: true });

          for (const entry of entries) {
            const srcPath = join(src, entry.name);
            const destPath = join(dest, entry.name);

            try {
              if (entry.isDirectory()) {
                copyDir(srcPath, destPath);
              } else {
                copyFileSync(srcPath, destPath);
              }
            } catch (err: any) {
              // Skip files that can't be copied
              console.warn(`Skipping file ${entry.name}: ${err.message}`);
            }
          }
        } catch (err) {
          console.error(`Error copying directory: ${err}`);
        }
      };

      copyDir('public', 'dist');
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [copyPublicPlugin()],
  base: process.env.GITHUB_PAGES === 'true' ? '/Resource-page/' : '/',
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
  publicDir: 'public',
  build: {
    copyPublicDir: false,
  },
});
