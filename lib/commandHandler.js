const fs = require('fs');
const path = require('path');

const COMMANDS_DIR = path.join(__dirname, '..', 'commands');

/**
 * Lee todos los archivos .js dentro de /commands y los carga en un Map.
 * Cada archivo debe exportar: { name: string, description: string, execute: async (msg, args, client) => {} }
 *
 * Para agregar un comando nuevo solo hay que crear un archivo en /commands
 * siguiendo esa misma estructura, no hace falta tocar este archivo.
 */
function loadCommands() {
  const commands = new Map();

  if (!fs.existsSync(COMMANDS_DIR)) return commands;

  const files = fs.readdirSync(COMMANDS_DIR).filter((f) => f.endsWith('.js'));

  for (const file of files) {
    const filePath = path.join(COMMANDS_DIR, file);
    delete require.cache[require.resolve(filePath)];
    const command = require(filePath);

    if (!command?.name || typeof command.execute !== 'function') {
      console.warn(`⚠️  El comando en "${file}" no tiene el formato correcto, se omite.`);
      continue;
    }

    commands.set(command.name.toLowerCase(), command);
  }

  return commands;
}

module.exports = { loadCommands };