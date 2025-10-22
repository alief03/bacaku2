// /netlify/functions/check-access.js
import { getStores, json } from './_store.js';

export async function handler(event) {
  const email = (event.queryStringParameters?.email || '').toLowerCase();
  if (!email) return json({ allowed: false, message: 'Email diperlukan' }, 400);
  const { accessStore } = await getStores();
  const val = await accessStore.get(email);
  return json({ allowed: !!val });
}
