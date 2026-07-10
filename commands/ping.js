module.exports = {
  name: 'ping',
  description: 'Responde pong y muestra la latencia',
  async execute(msg, args, client) {
    const start = Date.now();
    const sent = await msg.reply('🏓 Pong...');
    const latency = Date.now() - start;
    await sent.edit ? sent.edit(`🏓 Pong! (${latency}ms)`) : msg.reply(`🏓 Pong! (${latency}ms)`);
  },
};