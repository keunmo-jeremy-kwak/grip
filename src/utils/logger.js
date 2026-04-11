'use strict';

const LEVELS = { info: '🟢', warn: '🟡', error: '🔴' };

function timestamp() {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

function log(level, ...args) {
  const icon = LEVELS[level] || '⚪';
  console[level === 'error' ? 'error' : 'log'](
    `[${timestamp()}] ${icon} ${args.join(' ')}`
  );
}

module.exports = {
  info: (...args) => log('info', ...args),
  warn: (...args) => log('warn', ...args),
  error: (...args) => log('error', ...args),
};
