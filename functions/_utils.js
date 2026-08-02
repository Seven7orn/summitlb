export function checkAuth(request, env, allowedRoles) {
  const role = request.headers.get('X-Summit-Role');
  const auth = request.headers.get('X-Summit-Auth');
  if (!role || !allowedRoles.includes(role)) {
    return {
      ok: false,
      response: json({ error: 'forbidden' }, 403),
    };
  }
  const expected =
    role === 'admin'
      ? env.ADMIN_PASS || 'admin0000'
      : env.STAFF_PASS || 'staff0000';
  if (!auth || auth !== expected) {
    return {
      ok: false,
      response: json({ error: 'unauthorized' }, 401),
    };
  }
  return { ok: true };
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

export function sanitizeFilename(name) {
  return (name || 'file').replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200);
}

export function publicBase(env) {
  return (env.R2_PUBLIC_URL || '').replace(/\/$/, '');
}
