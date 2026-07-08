"use strict";

/**
 * tokenBlacklist.js
 * In-process store for invalidated JWT tokens.
 *
 * ── Problem with stateless JWTs ────────────────────────────────────────────
 * A JWT is self-contained: the server verifies it by checking the signature
 * and expiry, without querying a database. This is what makes JWTs scalable
 * and fast. But it creates one serious problem: you cannot "cancel" a token.
 * Once issued, a JWT is valid until it expires — even after the user logs out.
 * An attacker who steals a token has up to 7 days (our JWT_EXPIRES_IN) to
 * use it after the user has logged out.
 *
 * ── Solution: blacklist the JTI ────────────────────────────────────────────
 * Every token we issue now includes a `jti` (JWT ID) claim — a unique UUID.
 * On logout, the controller stores that JTI in this blacklist with a TTL
 * equal to the token's remaining valid time. The protect() middleware checks
 * the blacklist on every request after verifying the signature. A blacklisted
 * JTI is rejected with 401, even if the signature is valid.
 *
 * ── Why not Redis? ─────────────────────────────────────────────────────────
 * Redis would be the production choice for a multi-instance deployment — each
 * server instance would share the same blacklist. This app runs on Render's
 * free tier as a single instance, so an in-process Map works correctly and
 * costs nothing. The Map is lost on server restart (acceptable: tokens issued
 * before a restart remain "unblacklisted" until they expire naturally, which
 * is the same risk as not having a blacklist at all).
 *
 * ── Automatic cleanup ──────────────────────────────────────────────────────
 * A setInterval runs every hour and removes entries whose TTL has passed.
 * Without this, the Map would grow until the process runs out of memory on a
 * server that restarts infrequently. The cleanup is defensive — expired
 * entries are also harmless (a naturally-expired token fails the JWT expiry
 * check before the blacklist is even consulted).
 */

// Map<jti: string, expiresAt: number (Unix ms timestamp)>
const blacklist = new Map();

// ── addToBlacklist ─────────────────────────────────────────────────────────────
/**
 * Add a JTI to the blacklist.
 *
 * @param {string} jti       — the JWT ID claim from the token payload
 * @param {number} expiresAt — Unix timestamp (seconds) when the token expires.
 *                             Sourced from the `exp` claim in the JWT payload.
 */
const addToBlacklist = (jti, expiresAt) => {
  if (!jti || !expiresAt) return;
  // Store expiry in milliseconds for direct comparison with Date.now()
  blacklist.set(jti, expiresAt * 1000);
};

// ── isBlacklisted ──────────────────────────────────────────────────────────────
/**
 * Check whether a JTI has been blacklisted.
 *
 * Returns false for expired entries (the JWT expiry check in protect() would
 * have already rejected the token before we get here). This means expired
 * entries are effectively invisible — cleanup just recovers the Map memory.
 *
 * @param {string} jti
 * @returns {boolean}
 */
const isBlacklisted = (jti) => {
  if (!jti || !blacklist.has(jti)) return false;

  const expiresAt = blacklist.get(jti);
  if (Date.now() > expiresAt) {
    // Already expired — clean up now rather than waiting for the hourly sweep
    blacklist.delete(jti);
    return false;
  }
  return true;
};

// ── Automatic TTL cleanup ──────────────────────────────────────────────────────
// Runs every hour. Iterates the Map once and removes all expired entries.
// unref() prevents this timer from keeping the Node.js event loop alive
// when the server is trying to gracefully shut down.
const cleanupInterval = setInterval(
  () => {
    const now = Date.now();
    for (const [jti, expiresAt] of blacklist.entries()) {
      if (now > expiresAt) {
        blacklist.delete(jti);
      }
    }
  },
  60 * 60 * 1000,
); // every 60 minutes

cleanupInterval.unref();

// ── size (for monitoring/health checks) ───────────────────────────────────────
const getSize = () => blacklist.size;

export { addToBlacklist, getSize, isBlacklisted };
