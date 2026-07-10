import {
  default as makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";
import { config } from "./config.js";
import { loadPlugins } from "./pluginLoader.js";

async function startBot() {
  const { commands } = await loadPlugins();
  console.log(`Plugins cargados: ${[...new Set([...commands.values()].map(p => p.command[0] || p.command))].join(", ") || "ninguno"}`);

  const { state, saveCreds } = await useMultiFileAuthState(config.sessionFolder);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: !config.usePairingCode,
  });

  if (config.usePairingCode && !sock.authState.creds.registered) {
    const code = await sock.requestPairingCode(config.ownerNumber);
    console.log(`📱 Código de vinculación: ${code}`);
    console.log("En tu celular: WhatsApp > Dispositivos vinculados > Vincular con número de teléfono.");
  }

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log(`✅ ${config.botName} conectado y listo.`);
    }

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.warn(`Conexión cerrada (${statusCode}). Reconectando: ${shouldReconnect}`);
      if (shouldReconnect) startBot();
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const msg of messages) {
      try {
        if (!msg.message || msg.key.fromMe) continue;

        const body =
          msg.message.conversation ||
          msg.message.extendedTextMessage?.text ||
          "";

        const text = body.trim();
        if (!text) continue;

        // Si hay prefijo configurado, lo exige; si config.prefix es "", no hace falta ninguno
        if (config.prefix && !text.startsWith(config.prefix)) continue;
        const withoutPrefix = config.prefix ? text.slice(config.prefix.length) : text;

        const args = withoutPrefix.split(/\s+/);
        const commandName = args.shift().toLowerCase();

        const plugin = commands.get(commandName);
        if (!plugin) continue; // no coincide con ningún comando, se ignora

        const jid = msg.key.remoteJid;
        const isGroup = jid.endsWith("@g.us");
        const sender = msg.key.participant || msg.key.remoteJid;
        const senderNumber = sender.split("@")[0];

        // Filtros, igual que en TheYui-MD
        if (plugin.groupOnly && !isGroup) {
          await sock.sendMessage(jid, { text: "⚠️ Este comando solo funciona en grupos." });
          continue;
        }
        if (plugin.ownerOnly && senderNumber !== config.ownerNumber) {
          await sock.sendMessage(jid, { text: "⛔ Este comando es solo para el dueño del bot." });
          continue;
        }
        if (plugin.adminOnly && isGroup) {
          const groupMeta = await sock.groupMetadata(jid);
          const isAdmin = groupMeta.participants.some(
            (p) => p.id === sender && (p.admin === "admin" || p.admin === "superadmin")
          );
          if (!isAdmin) {
            await sock.sendMessage(jid, { text: "⛔ Este comando es solo para administradores del grupo." });
            continue;
          }
        }

        console.log(`Ejecutando "${commandName}" de ${sender}`);
        await plugin.execute(sock, msg, args, { isGroup, sender, senderNumber, config });
      } catch (err) {
        console.error("Error procesando mensaje:", err);
      }
    }
  });
}

startBot();