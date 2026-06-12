import { Boom } from "@hapi/boom";
import NodeCache from "node-cache";
import readline from "readline";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  makeCacheableSignalKeyStore,
} from "@whiskeysockets/baileys";

import dotenv from "dotenv";
import { handleMessage } from "./main.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const msgRetryCounterCache = new NodeCache({ stdTTL: 86400 });
const SESSION_PATH = "./session";

if (!fs.existsSync(SESSION_PATH)) {
  fs.mkdirSync(SESSION_PATH, { recursive: true });
}

async function startBot() {
  console.log("🤖 Iniciando Thorfinn Bot...\n");

  const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);

  const sock = makeWASocket({
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, console.log),
    },
    printQRInTerminal: false,
    msgRetryCounterCache,
    defaultQueryTimeoutMs: undefined,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    // Pairing Code - Código de 6 dígitos
    if (update.pairingCode) {
      const pairingCode = update.pairingCode;
      console.log("\n╔═══════════════════════════════════╗");
      console.log("║      🔐 CÓDIGO DE PAIRING        ║");
      console.log("╚═══════════════════════════════════╝");
      console.log(`\n📱 Tu código de pairing es:\n`);
      console.log(`    ┌─────────────┐`);
      console.log(`    │  ${pairingCode}  │`);
      console.log(`    └─────────────┘\n`);
      console.log("Para vincular tu WhatsApp:");
      console.log("1️⃣  Abre WhatsApp en tu teléfono");
      console.log("2️⃣  Ve a Configuración > Dispositivos vinculados");
      console.log("3️⃣  Toca 'Vincular un dispositivo'");
      console.log("4️⃣  Ingresa el código de 6 dígitos anterior\n");
      console.log("⏱️  El código expira en 60 segundos\n");
      console.log("═══════════════════════════════════\n");
    }

    if (connection === "close") {
      let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;

      if (reason === DisconnectReason.badSession) {
        console.log("❌ Sesión inválida - Borra la carpeta 'session' y reinicia");
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log("❌ Conexión cerrada - Reconectando...");
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("❌ Conexión perdida - Reconectando...");
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log("❌ Conexión reemplazada - Reconectando...");
      } else if (reason === DisconnectReason.loggedOut) {
        console.log("❌ Sesión cerrada - Necesitas vincular de nuevo");
        fs.rmSync(SESSION_PATH, { recursive: true, force: true });
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("🔄 Reiniciando...");
        startBot();
      } else if (reason === DisconnectReason.timedOut) {
        console.log("⏱️ Tiempo agotado - Reconectando...");
      }
      startBot();
    }

    if (connection === "open") {
      console.log("\n╔═══════════════════════════════════╗");
      console.log("║  ✅ THORFINN BOT CONECTADO ✅    ║");
      console.log("╚═══════════════════════════════════╝");
      console.log("\n🎯 Bot listo para recibir comandos");
      console.log("📱 Sesión guardada correctamente");
      console.log(`⌚ Hora: ${new Date().toLocaleString()}\n`);
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const msg of messages) {
      if (!msg.message) continue;
      if (msg.key.fromMe) continue;

      try {
        await handleMessage(sock, msg);
      } catch (e) {
        console.error("Error procesando mensaje:", e);
      }
    }
  });
}

startBot().catch(console.error);
