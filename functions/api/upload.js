import { checkAuth, json, sanitizeFilename, publicBase } from '../_utils.js';

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'POST') {
    return json({ error: 'method not allowed' }, 405);
  }

  const bucket = env.BUCKET;
  if (!bucket) {
    return json({ error: 'R2 bucket not bound' }, 503);
  }

  const auth = checkAuth(request, env, ['staff', 'admin']);
  if (!auth.ok) return auth.response;

  const base = publicBase(env);
  if (!base) {
    return json({ error: 'R2_PUBLIC_URL not configured' }, 503);
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'invalid form data' }, 400);
  }

  const file = form.get('file');
  if (!file || typeof file === 'string') {
    return json({ error: 'no file' }, 400);
  }

  const id =
    (form.get('id') && String(form.get('id'))) ||
    `f_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const safeName = sanitizeFilename(file.name);
  const key = `media/${id}/${safeName}`;
  const type =
    file.type && file.type !== 'application/octet-stream'
      ? file.type
      : 'application/octet-stream';

  await bucket.put(key, file.stream(), {
    httpMetadata: { contentType: type },
  });

  return json({
    id,
    key,
    url: `${base}/${key}`,
    type,
    size: file.size,
  });
}
