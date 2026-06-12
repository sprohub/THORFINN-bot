import dotenv from "dotenv";

dotenv.config();

const PREFIX = process.env.PREFIJO || ".";

// Función para extraer el texto del mensaje
function getMessageText(message) {
  if (message.conversation) return message.conversation;
  if (message.extendedTextMessage) return message.extendedTextMessage.text;
  if (message.imageMessage?.caption) return message.imageMessage.caption;
  if (message.videoMessage?.caption) return message.videoMessage.caption;
  return "";
}

// Función para verificar si es un grupo
function isGroup(jid) {
  return jid.endsWith("@g.us");
}

// Función para obtener el nombre del remitente
async function getSenderName(sock, sender) {
  try {
    const contact = await sock.getContactBasicInfo(sender);
    return contact.data?.pushName || sender.split("@")[0];
  } catch {
    return sender.split("@")[0];
  }
}

// Comandos disponibles
const commands = {
  help: {
    desc: "Muestra la lista de comandos",
    run: async (sock, msg, args, jid, sender) => {
      const helpText = `
╔═══════════════════════════════════╗
║       🗡️  THORFINN BOT  🗡️         ║
╚═══════════════════════════════════╝

📋 *COMANDOS DISPONIBLES:*

${PREFIX}help - Muestra este mensaje
${PREFIX}ping - Verifica que el bot esté activo
${PREFIX}info - Información del bot
${PREFIX}owner - Información del propietario
${PREFIX}menu - Menú principal

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
      const infoText = `
╔═══════════════════════════════════╗
║         ℹ️  INFORMACIÓN            ║
╚═══════════════════════════════════╝

*📌 Bot:* Thorfinn
*🔢 Versión:* 1.0.0
*⚙️ Desarrollado con:* Baileys
*🌐 Plataforma:* WhatsApp
*📅 Última actualización:* Hoy

*✨ Características:*
• Responder comandos
• Información en tiempo real
• Sistema de prefijo personalizable
• Soporte para grupos y privados

${PREFIX}help para más comandos
`;

      await sock.sendMessage(jid, { text: infoText }, { quoted: msg });
    },
  },

  owner: {
    desc: "Información del propietario",
    run: async (sock, msg, args, jid, sender) => {
      const ownerText = `
╔═══════════════════════════════════╗
║         👤  PROPIETARIO            ║
╚═══════════════════════════════════╝

*Nombre:* Tu Nombre
*WhatsApp:* +0000000000
*Estado:* Disponible
*Descripción:* Desarrollador del Bot Thorfinn

Para contactar al propietario, envía un mensaje privado.
`;

      await sock.sendMessage(jid, { text: ownerText }, { quoted: msg });
    },
  },

  menu: {
    desc: "Menú principal del bot",
    run: async (sock, msg, args, jid, sender) => {
      const senderName = await getSenderName(sock, sender);
      const menuText = `
╔═══════════════════════════════════╗
║      🎮  MENÚ PRINCIPAL  🎮       ║
╚═══════════════════════════════════╝

👋 *Hola, ${senderName}!*

Selecciona una opción escribiendo el número:

1️⃣ ${PREFIX}help - Ver todos los comandos
2️⃣ ${PREFIX}ping - Probar velocidad del bot
3️⃣ ${PREFIX}info - Información del bot
4️⃣ ${PREFIX}owner - Datos del propietario

⏱️ *Responde rápidamente al menú*
`;

      await sock.sendMessage(jid, { text: menuText }, { quoted: msg });
    },
  },
};

// Manejador principal de mensajes
export async function handleMessage(sock, msg) {
  try {
    const { key, message } = msg;
    const jid = key.remoteJid;
    const sender = key.participant || key.remoteJid;
    const isGroupMsg = isGroup(jid);

    // Obtener texto del mensaje
    const text = getMessageText(message).trim();

    // Verificar si comienza con el prefijo
    if (!text.startsWith(PREFIX)) return;

    // Extraer comando y argumentos
    const args = text.slice(PREFIX.length).trim().split(/\s+/);
    const commandName = args[0]?.toLowerCase();
    const commandArgs = args.slice(1);

    // Buscar el comando
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

    // Ejecutar comando
    console.log(
      `[COMANDO] ${isGroupMsg ? "Grupo" : "Privado"} | Usuario: ${sender} | Comando: ${commandName}`
    );

    await command.run(sock, msg, commandArgs, jid, sender);
  } catch (e) {
    console.error("Error en handleMessage:", e);
  }
}
