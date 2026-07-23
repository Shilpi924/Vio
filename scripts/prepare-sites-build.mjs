import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const distDir = new URL('../dist/', import.meta.url);
const staticDir = new URL('../dist/static/', import.meta.url);
const serverDir = new URL('../dist/server/', import.meta.url);

await mkdir(staticDir, { recursive: true });
for (const entry of await readdir(distDir)) {
  if (entry === 'static' || entry === 'server') continue;
  await rename(join(distDir.pathname, entry), join(staticDir.pathname, entry));
}

async function collectAssets(directory, prefix = '') {
  const assets = {};
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relativePath = `${prefix}/${entry.name}`;
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      Object.assign(assets, await collectAssets(absolutePath, relativePath));
    } else {
      assets[relativePath] = (await readFile(absolutePath)).toString('base64');
    }
  }
  return assets;
}

const embeddedAssets = await collectAssets(staticDir.pathname);

await mkdir(serverDir, { recursive: true });
await writeFile(new URL('index.js', serverDir), `const ASSETS = ${JSON.stringify(embeddedAssets)};
const CONTENT_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
};

function decodeAsset(encoded) {
  const binary = atob(encoded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function responseFor(pathname, request) {
  const encoded = ASSETS[pathname];
  if (!encoded) return null;
  const extension = pathname.includes('.') ? pathname.slice(pathname.lastIndexOf('.')) : '';
  const headers = new Headers({
    'Content-Type': CONTENT_TYPES[extension] || 'application/octet-stream',
    'Cache-Control': pathname === '/index.html' || pathname === '/sw.js'
      ? 'no-cache'
      : 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
  });
  if (pathname === '/sw.js') headers.set('Service-Worker-Allowed', '/');
  return new Response(request.method === 'HEAD' ? null : decodeAsset(encoded), { status: 200, headers });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }
    const pathname = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
    const assetResponse = responseFor(pathname, request);
    if (assetResponse) return assetResponse;
    const acceptsHtml = request.headers.get('accept')?.includes('text/html');
    if (acceptsHtml) return responseFor('/index.html', request);
    return new Response('Not found', { status: 404 });
  },
};
`);
