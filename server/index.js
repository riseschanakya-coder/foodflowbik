require('dotenv').config();

const cors = require('cors');
const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const port = Number(process.env.PORT || 4000);
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const jwtSecret = process.env.JWT_SECRET || require('crypto').randomBytes(32).toString('hex');

if (!googleClientId) {
  console.warn('Google authentication is not configured. Set GOOGLE_CLIENT_ID.');
}
if (!googleClientSecret) {
  console.warn('Native Google code exchange is not configured. Set GOOGLE_CLIENT_SECRET for Expo mobile auth.');
}

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Origin is not allowed'));
  },
}));
app.use(express.json({ limit: '20kb' }));

const googleClient = new OAuth2Client(
  googleClientId,
  googleClientSecret,
);

const users = new Map();

app.get('/health', (_req, res) => {
  res.json({ ok: true, googleConfigured: Boolean(googleClientId), nativeGoogleConfigured: Boolean(googleClientId && googleClientSecret) });
});

app.post('/api/auth/google/verify', async (req, res) => {
  try {
    if (!googleClientId || !jwtSecret) {
      return res.status(503).json({ error: 'Google authentication is not configured on the server.' });
    }

    const { credential } = req.body;
    if (typeof credential !== 'string' || !credential) {
      return res.status(400).json({ error: 'Missing Google credential.' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      return res.status(401).json({ error: 'Google account details could not be verified.' });
    }

    const user = {
      id: payload.sub,
      name: payload.name || payload.email.split('@')[0],
      email: payload.email,
      picture: payload.picture || null,
    };
    users.set(user.id, user);

    const token = jwt.sign(
      { sub: user.id, email: user.email, name: user.name },
      jwtSecret,
      { expiresIn: '7d', issuer: 'foodflow-api' },
    );

    return res.json({ token, user });
  } catch (error) {
    console.error('Google credential verification failed:', error.message);
    return res.status(401).json({ error: 'Google authentication failed.' });
  }
});

app.post('/api/auth/google/exchange', async (req, res) => {
  try {
    if (!googleClientId || !googleClientSecret || !jwtSecret) {
      return res.status(503).json({ error: 'Google authentication is not configured on the server.' });
    }

    const { code, codeVerifier, redirectUri } = req.body;
    if (typeof code !== 'string' || !code) {
      return res.status(400).json({ error: 'Missing Google authorization code.' });
    }
    if (typeof codeVerifier !== 'string' || !codeVerifier) {
      return res.status(400).json({ error: 'Missing PKCE code verifier.' });
    }
    if (typeof redirectUri !== 'string' || !redirectUri) {
      return res.status(400).json({ error: 'Missing OAuth redirect URI.' });
    }

    const tokenResponse = await googleClient.getToken({
      code,
      codeVerifier,
      redirect_uri: redirectUri,
    });

    const idToken = tokenResponse.tokens.id_token;
    if (!idToken) {
      return res.status(401).json({ error: 'Google did not return an ID token.' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      return res.status(401).json({ error: 'Google account details could not be verified.' });
    }

    const user = {
      id: payload.sub,
      name: payload.name || payload.email.split('@')[0],
      email: payload.email,
      picture: payload.picture || null,
    };
    users.set(user.id, user);

    const token = jwt.sign(
      { sub: user.id, email: user.email, name: user.name },
      jwtSecret,
      { expiresIn: '7d', issuer: 'foodflow-api' },
    );

    return res.json({ token, user });
  } catch (error) {
    console.error('Google token exchange failed:', error.message);
    return res.status(401).json({ error: 'Google authentication failed.' });
  }
});

app.get('/api/auth/me', (req, res) => {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const payload = jwt.verify(authorization.slice(7), jwtSecret, { issuer: 'foodflow-api' });
    return res.json({
      user: {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
      },
    });
  } catch (_error) {
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }
});

app.listen(port, () => {
  console.log(`FoodFlow authentication server listening on http://localhost:${port}`);
});
