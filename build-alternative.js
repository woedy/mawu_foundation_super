#!/usr/bin/env node

/**
 * Alternative build script using esbuild instead of Vite/Rollup
 * This avoids the native module issues entirely
 */

const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

async function build() {
  console.log('Building with esbuild...');
  
  try {
    // Build the React app
    await esbuild.build({
      entryPoints: ['apps/web/src/main.tsx'],
      bundle: true,
      minify: true,
      sourcemap: true,
      target: ['es2020'],
      format: 'esm',
      outfile: 'apps/web/dist/assets/main.js',
      loader: {
        '.tsx': 'tsx',
        '.ts': 'ts',
        '.css': 'css',
        '.png': 'file',
        '.jpg': 'file',
        '.jpeg': 'file',
        '.gif': 'file',
        '.svg': 'file',
      },
      define: {
        'process.env.NODE_ENV': '"production"',
      },
      external: [],
    });

    // Copy HTML template
    const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mawu Foundation</title>
    <script type="module" crossorigin src="/assets/main.js"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

    // Ensure dist directory exists
    const distDir = 'apps/web/dist';
    const assetsDir = path.join(distDir, 'assets');
    
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }

    fs.writeFileSync(path.join(distDir, 'index.html'), htmlTemplate);
    
    console.log('✅ Build completed successfully with esbuild');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();