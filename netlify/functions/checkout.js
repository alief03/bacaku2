// /netlify/functions/checkout.js
import { nanoid } from 'nanoid';
import { getStores, json } from './_store.js';

export async function handler(event) {
  if (event.httpMethod !== 'POST') return json({ message: 'Method not allowed' }, 405);
  const data = JSON.parse(event.body || '{}');
  const { fullname, email, whatsapp, notes, book } = data;

  if (!email || !fullname) return json({ message: 'Nama & email wajib.' }, 400);

  const { checkoutStore } = await getStores();
  const id = nanoid(10);
  const item = { id, fullname, email: email.toLowerCase(), whatsapp, notes, book, status: 'pending', at: Date.now() };
  await checkoutStore.set(id, JSON.stringify(item));

  return json({ ok: true, message: 'Checkout dicatat. Hubungi admin via WhatsApp untuk pembayaran.', id });
}
