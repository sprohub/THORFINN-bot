export default {
  command: ["ping", "speed"],
  description: "Muestra la velocidad de respuesta del bot",
  category: "info",

  ownerOnly: false,
  adminOnly: false,
  groupOnly: false,

  async execute(sock, msg, args, context) {
    const start = Date.now();
    const jid = msg.key.remoteJid;
    const latency = Date.now() - start;
    await sock.sendMessage(jid, { text: `🏓 Pong! (${latency}ms)` });
  },
};