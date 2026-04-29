const SESSION_KEY = 'superapp_session';

async function hashPassword(password) {
  const buf = new TextEncoder().encode(password);
  const hashBuf = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hashBuf))
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

async function login(username, password) {
  const hash = await hashPassword(password);
  const user = USERS.find(u => u.username === username && u.passwordHash === hash);
  if (!user) return false;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    loginAt: Date.now()
  }));
  return true;
}

function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function requireAuth(redirectTo = 'index.html') {
  const session = getSession();
  if (!session) {
    window.location.href = redirectTo;
    return null;
  }
  return session;
}

function hasAccess(app, session) {
  return app.active && app.roles.includes(session.role);
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = 'index.html';
}
