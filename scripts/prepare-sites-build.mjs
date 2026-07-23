import { mkdir, readdir, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const distDir = new URL('../dist/', import.meta.url);
const staticDir = new URL('../dist/static/', import.meta.url);
const serverDir = new URL('../dist/server/', import.meta.url);

await mkdir(staticDir, { recursive: true });
for (const entry of await readdir(distDir)) {
  if (entry === 'static' || entry === 'server') continue;
  await rename(join(distDir.pathname, entry), join(staticDir.pathname, entry));
}

await mkdir(serverDir, { recursive: true });
await writeFile(new URL('index.js', serverDir), `export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const assetPrefixes = ['', '/static', '/dist/static'];
    let response = new Response('Not found', { status: 404 });

    for (const prefix of assetPrefixes) {
      const assetUrl = new URL(prefix + url.pathname, request.url);
      assetUrl.search = url.search;
      response = await env.ASSETS.fetch(new Request(assetUrl, request));
      if (response.status !== 404) return response;
    }

    if (request.method !== 'GET') return response;
    const acceptsHtml = request.headers.get('accept')?.includes('text/html');
    if (!acceptsHtml) return response;

    for (const prefix of assetPrefixes) {
      const fallbackUrl = new URL(prefix + '/index.html', request.url);
      response = await env.ASSETS.fetch(new Request(fallbackUrl, request));
      if (response.status !== 404) return response;
    }

    return response;
  },
};
`);
