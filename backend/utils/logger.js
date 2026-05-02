// Consistent logger utility — replaces all console.log/error calls in production code.
// Uses structured output with timestamps; can be swapped for winston/pino later.

const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };

const currentLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'debug';

function shouldLog(level) {
  return LOG_LEVELS[level] <= LOG_LEVELS[currentLevel];
}

function formatMessage(level, context, message, meta) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}] [${context}]`;
  if (meta && Object.keys(meta).length > 0) {
    return `${prefix} ${message} ${JSON.stringify(meta)}`;
  }
  return `${prefix} ${message}`;
}

const logger = {
  info(context, message, meta = {}) {
    if (shouldLog('info')) {
      process.stdout.write(formatMessage('info', context, message, meta) + '\n');
    }
  },

  warn(context, message, meta = {}) {
    if (shouldLog('warn')) {
      process.stderr.write(formatMessage('warn', context, message, meta) + '\n');
    }
  },

  error(context, message, meta = {}) {
    if (shouldLog('error')) {
      process.stderr.write(formatMessage('error', context, message, meta) + '\n');
    }
  },

  debug(context, message, meta = {}) {
    if (shouldLog('debug')) {
      process.stdout.write(formatMessage('debug', context, message, meta) + '\n');
    }
  },
};

module.exports = logger;
