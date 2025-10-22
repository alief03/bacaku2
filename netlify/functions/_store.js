// _store.js (shared utilities)
import { getStore } from '@netlify/blobs';

export async function getStores() {
  const checkoutStore = getStore('checkouts');
  const accessStore = getStore('access');
  return { checkoutStore, accessStore };
}

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
