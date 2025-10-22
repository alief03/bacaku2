// /netlify/functions/revoke.js
import { getStores, json } from './_store.js';

export async function handler(event) {
  if (event.httpMethod !== 'POST') return json({ message: 'Method not allowed' }, 405);
  const { email } = JSON.parse(event.body || '{}');
  if (!email) return json({ message: 'Email wajib' }, 400);

  const { checkoutStore, accessStore } = await getStores();

  // tandai checkout sebagai revoked (jika ada)
  const keys = await checkoutStore.list();
  for (const k of keys.blobs) {
    const raw = await checkoutStore.get(k.key);
    const it = JSON.parse(raw);
    if (it.email.toLowerCase() === email.toLowerCase()) {
      it.status = 'revoked';
      await checkoutStore.set(k.key, JSON.stringify(it));
    }
  }

  // hapus dari daftar akses
  await accessStore.delete(email.toLowerCase());

  return json({ ok: true, message: `Akses dicabut dari ${email}` });
}
