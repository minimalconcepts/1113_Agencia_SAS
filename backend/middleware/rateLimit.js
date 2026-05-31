function createRateLimiter({ windowMs = 60000, max = 60, methods = null } = {}) {
  const hits = new Map();

  return function rateLimit(request, response, next) {
    if (methods && !methods.includes(request.method)) {
      next();
      return;
    }

    const key = request.ip || request.socket.remoteAddress || "local";
    const now = Date.now();
    const current = hits.get(key);

    if (!current || current.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    current.count += 1;

    if (current.count > max) {
      response.status(429).json({
        error: "Demasiadas solicitudes. Intenta de nuevo en unos segundos."
      });
      return;
    }

    next();
  };
}

module.exports = createRateLimiter;
