const colors = {
  info: '\x1b[36m',   // cyan
  warn: '\x1b[33m',   // amarillo
  error: '\x1b[31m',  // rojo
  reset: '\x1b[0m',
};

function timestamp() {
  return new Date().toLocaleTimeString();
}

module.exports = {
  info: (...args) => console.log(`${colors.info}[INFO ${timestamp()}]${colors.reset}`, ...args),
  warn: (...args) => console.warn(`${colors.warn}[WARN ${timestamp()}]${colors.reset}`, ...args),
  error: (...args) => console.error(`${colors.error}[ERROR ${timestamp()}]${colors.reset}`, ...args),
};