const { performance } = require('perf_hooks');

const logger = (req, res, next) => {
  const startTime = performance.now();
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.path;
  const ip = req.ip || (req.socket && req.socket.remoteAddress) || (req.connection && req.connection.remoteAddress) || 'UNKNOWN';

  res.on('finish', () => {
    const responseTime = Math.round(performance.now() - startTime);
    const status = res.statusCode;
    const isError = status >= 400;

    if (isError) {
      console.error(`[${timestamp}] ${method} ${path} ${status} ${responseTime}ms ${ip} [ERROR]`);
    } else {
      console.log(`[${timestamp}] ${method} ${path} ${status} ${responseTime}ms ${ip}`);
    }
  });

  next();
};

module.exports = logger;
