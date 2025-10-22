// /netlify/functions/list-checkouts.js
import { getStores, json } from './_store.js';

export async function handler() {
  const { checkoutStore } = await getStores();
  const keys = await checkoutStore.list();
  const items = [];
  for (const key of keys.blobs) {
    const raw = await checkoutStore.get(key.key);
    try { items.push(JSON.parse(raw)); } catch {}
  }
  // urut terbaru
  items.sort((a,b)=>b.at-a.at);
  return json({ items });
}
