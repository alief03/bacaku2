// /netlify/functions/approve.js
import { getStores, json } from './_store.js';

export async function handler(event) {
  if (event.httpMethod !== 'POST') return json({ message: 'Method not allowed' }, 405);
  const { email } = JSON.parse(event.body || '{}');
  if (!email) return json({ message: 'Email wajib' }, 400);

  const { checkoutStore, accessStore } = await getStores();

  // tandai checkout sebagai approved
  const keys = await checkoutStore.list();
  for (const k of keys.blobs) {
    const raw = await checkoutStore.get(k.key);
    const it = JSON.parse(raw);
    if (it.email.toLowerCase() === email.toLowerCase()) {
      it.status = 'approved';
      await checkoutStore.set(k.key, JSON.stringify(it));
    }
  }

  // masukkan ke daftar akses
  const key = email.toLowerCase();
  await accessStore.set(key, '1');

  return json({ ok: true, message: `Akses diberikan kepada ${email}` });
}
