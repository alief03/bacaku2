// /netlify/functions/get-ebook.js
import fs from 'fs/promises';
import path from 'path';
import { getStores } from './_store.js';

export async function handler(event) {
  const email = (event.queryStringParameters?.email || '').toLowerCase();
  if (!email) return new Response('Email required', { status: 400 });

  const { accessStore } = await getStores();
  const ok = await accessStore.get(email);
  if (!ok) return new Response('Forbidden', { status: 403 });

  // File dibawa melalui included_files (lihat netlify.toml)
  const pdfPath = path.resolve(process.cwd(), 'assets', 'ebook.pdf');
  try {
    const buf = await fs.readFile(pdfPath);
    const headers = {
      'Content-Type': 'application/pdf',
      'Cache-Control': 'no-store'
    };
    if (event.queryStringParameters?.download) {
      headers['Content-Disposition'] = 'attachment; filename="ebook.pdf"';
    }
    return new Response(buf, { status: 200, headers });
  } catch {
    return new Response('File not found', { status: 500 });
  }
}
