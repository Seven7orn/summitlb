import { checkAuth, json } from '../../_utils.js';

export async function onRequest(context) {
  const { request, env, params } = context;
  if (request.method !== 'DELETE') {
    return json({ error: 'method not allowed' }, 405);
  }

  const bucket = env.BUCKET;
  if (!bucket) {
    return json({ error: 'R2 bucket not bound' }, 503);
  }

  const auth = checkAuth(request, env, ['admin']);
  if (!auth.ok) return auth.response;

  const id = params.id;
  if (!id || !/^f_[\w-]+$/.test(id)) {
    return json({ error: 'invalid id' }, 400);
  }

  const prefix = `media/${id}/`;
  let cursor;
  let deleted = 0;

  do {
    const listed = await bucket.list({ prefix, cursor });
    if (listed.objects.length) {
      await Promise.all(listed.objects.map((o) => bucket.delete(o.key)));
      deleted += listed.objects.length;
    }
    cursor = listed.truncated ? listed.cursor : undefined;
  } while (cursor);

  return json({ ok: true, deleted });
}
