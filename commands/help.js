const { loadCommands } = require('../lib/commandHandler');

module.exports = {
  name: 'help',
  description: 'Muestra la lista de comandos disponibles',
  async execute(msg, args, client) {
    const commands = loadCommands();
    const lista = [...commands.values()]
      .map((c) => `*!${c.name}* - ${c.description || 'sin descripción'}`)
      .join('\n');

    await msg.reply(`📋 *Comandos disponibles:*\n\n${lista}`);
  },
};