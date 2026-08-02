import { checkAuth, json } from '../_utils.js';

const MANIFEST_KEY = 'data/manifest.json';

export async function onRequest(context) {
  const { request, env } = context;
  const bucket = env.BUCKET;
  if (!bucket) {
    return json({ error: 'R2 bucket not bound' }, 503);
  }

  if (request.method === 'GET') {
    const obj = await bucket.get(MANIFEST_KEY);
    if (!obj) {
      return json(null);
    }
    const text = await obj.text();
    try {
      return json(JSON.parse(text));
    } catch {
      return json(null);
    }
  }

  if (request.method === 'PUT') {
    const auth = checkAuth(request, env, ['staff', 'admin']);
    if (!auth.ok) return auth.response;

    const body = await request.text();
    if (!body) {
      return json({ error: 'empty body' }, 400);
    }
    try {
      JSON.parse(body);
    } catch {
      return json({ error: 'invalid json' }, 400);
    }

    await bucket.put(MANIFEST_KEY, body, {
      httpMetadata: { contentType: 'application/json' },
    });
    return json({ ok: true });
  }

  return json({ error: 'method not allowed' }, 405);
}
