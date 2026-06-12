import dotenv from "dotenv";

dotenv.config();

const PREFIX = process.env.PREFIJO || ".";

function getMessageText(message) {
  if (message.conversation) return message.conversation;
  if (message.extendedTextMessage) return message.extendedTextMessage.text;
  if (message.imageMessage?.caption) return message.imageMessage.caption;
  if (message.videoMessage?.caption) return message.videoMessage.caption;
  return "";
}

function isGroup(jid) {
  return jid.endsWith("@g.us");
}

async function getSenderName(sock, sender) {
  try {
    const contact = await sock.getContactBasicInfo(sender);
    return contact.data?.pushName || sender.split("@")[0];
  } catch {
    return sender.split("@")[0];
  }
}

const commands = {
  help: {
    desc: "Muestra la lista de comandos",
    run: async (sock, msg, args, jid, sender) => {
      const helpText = `╔═══════════════════════════════════╗
║       🗡️  THORFINN BOT  🗡️         ║
╚═══════════════════════════════════╝

📋 *COMANDOS DISPONIBLES:*

${PREFIX}help - Muestra este mensaje
${PREFIX}ping - Verifica que el bot esté activo
${PREFIX}info - Información del bot
${PREFIX}owner - Información del propietario
${PREFIX}menu - Menú principal
${PREFIX}estado - Estado del bot

⏰ *Estado:* ✅ En línea
🤖 *Bot:* Thorfinn v1.0
`;

      await sock.sendMessage(jid, { text: helpText }, { quoted: msg });
    },
  },

  ping: {
    desc: "Verifica la velocidad del bot",
    run: async (sock, msg, args, jid, sender) => {
      const timestamp = msg.messageTimestamp;
      const now = Math.floor(Date.now() / 1000);
      const ping = now - timestamp;

      await sock.sendMessage(
        jid,
        { text: `⚡ *Ping:* ${ping}ms\n✅ Bot activo y respondiendo` },
        { quoted: msg }
      );
    },
  },

  info: {
    desc: "Información del bot",
    run: async (sock, msg, args, jid, sender) => {
      const infoText = `╔═══════════════════════════════════╗
║         ℹ️  INFORMACIÓN            ║
╚═══════════════════════════════════╝

*📌 Bot:* Thorfinn
*🔢 Versión:* 1.0.0
*⚙️ Desarrollado con:* Baileys
*🌐 Plataforma:* WhatsApp
*📅 Última actualización:* 2024

*✨ Características:*
• Responder comandos
• Información en tiempo real
• Sistema de prefijo personalizable
• Soporte para grupos y privados

${PREFIX}help para más comandos`;

      await sock.sendMessage(jid, { text: infoText }, { quoted: msg });
    },
  },

  owner: {
    desc: "Información del propietario",
    run: async (sock, msg, args, jid, sender) => {
      const ownerText = `╔═══════════════════════════════════╗
║         👤  PROPIETARIO            ║
╚═══════════════════════════════════╝

*Nombre:* Samu
*WhatsApp:* +573225396540
*País:* 🇨🇴 Colombia
*Empresa:* SproHub
*Estado:* Disponible

Para contactar, envía un mensaje privado.`;

      await sock.sendMessage(jid, { text: ownerText }, { quoted: msg });
    },
  },

  menu: {
    desc: "Menú principal del bot",
    run: async (sock, msg, args, jid, sender) => {
      const senderName = await getSenderName(sock, sender);
      const menuText = `╔═══════════════════════════════════╗
║      🎮  MENÚ PRINCIPAL  🎮       ║
╚═══════════════════════════════════╝

👋 *Hola, ${senderName}!*

Selecciona una opción:

1️⃣ ${PREFIX}help - Ver todos los comandos
2️⃣ ${PREFIX}ping - Probar velocidad del bot
3️⃣ ${PREFIX}info - Información del bot
4️⃣ ${PREFIX}owner - Datos del propietario
5️⃣ ${PREFIX}estado - Estado general

⏱️ *Responde con un número*`;

      await sock.sendMessage(jid, { text: menuText }, { quoted: msg });
    },
  },

  estado: {
    desc: "Estado del bot",
    run: async (sock, msg, args, jid, sender) => {
      const estadoText = `╔═══════════════════════════════════╗
║         📊  ESTADO DEL BOT         ║
╚═══════════════════════════════════╝

*🟢 Estado:* En línea
*⚡ Velocidad:* Óptima
*📱 Conexión:* Estable
*🛡️ Seguridad:* Activa
*💾 Cache:* Activo
*🕐 Uptime:* ${process.uptime().toFixed(0)}s

*Comandos disponibles:* 6
*Versión:* 1.0.0

Todo funciona correctamente ✅`;

      await sock.sendMessage(jid, { text: estadoText }, { quoted: msg });
    },
  },
};

export async function handleMessage(sock, msg) {
  try {
    const { key, message } = msg;
    const jid = key.remoteJid;
    const sender = key.participant || key.remoteJid;
    const isGroupMsg = isGroup(jid);

    const text = getMessageText(message).trim();

    if (!text.startsWith(PREFIX)) return;

    const args = text.slice(PREFIX.length).trim().split(/\s+/);
    const commandName = args[0]?.toLowerCase();
    const commandArgs = args.slice(1);

    const command = commands[commandName];

    if (!command) {
      return sock.sendMessage(
        jid,
        {
          text: `❌ Comando no encontrado: *${commandName}*\n\nUsa *${PREFIX}help* para ver los comandos disponibles`,
        },
        { quoted: msg }
      );
    }

    console.log(
      `[CMD] ${isGroupMsg ? "Grupo" : "Privado"} | ${sender} | ${commandName}`
    );

    await command.run(sock, msg, commandArgs, jid, sender);
  } catch (e) {
    console.error("Error:", e);
  }
}
