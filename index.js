import { Boom } from "@hapi/boom";
import NodeCache from "node-cache";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  makeCacheableSignalKeyStore,
} from "@whiskeysockets/baileys";

import qrcode from "qrcode-terminal";
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
  console.log("\n╔═══════════════════════════════════╗");
  console.log("║   🗡️  THORFINN BOT v1.0  🗡️       ║");
  console.log("║     Iniciando conexión...         ║");
  console.log("╚═══════════════════════════════════╝\n");

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

    if (qr) {
      console.log("\n╔═══════════════════════════════════╗");
      console.log("║     📱 ESCANEA EL CÓDIGO QR      ║");
      console.log("╚═══════════════════════════════════╝\n");
      qrcode.generate(qr, { small: true });
    }

    if (update.pairingCode) {
      const pairingCode = update.pairingCode;
      console.log("\n╔═══════════════════════════════════╗");
      console.log("║      🔐 CÓDIGO DE PAIRING        ║");
      console.log("╚═══════════════════════════════════╝");
      console.log(`\n📱 Tu código es:\n`);
      console.log(`    ┌─────────────┐`);
      console.log(`    │  ${pairingCode}  │`);
      console.log(`    └─────────────┘\n`);
      console.log("En WhatsApp: Configuración > Dispositivos vinculados");
      console.log("Selecciona: Vincular un dispositivo");
      console.log("Ingresa el código de arriba\n");
      console.log("⏱️  El código expira en 60 segundos\n");
      console.log("═══════════════════════════════════\n");
    }

    if (connection === "close") {
      let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;

      if (reason === DisconnectReason.badSession) {
        console.log("❌ Sesión inválida");
        fs.rmSync(SESSION_PATH, { recursive: true, force: true });
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log("❌ Conexión cerrada");
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("❌ Conexión perdida");
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log("❌ Conexión reemplazada");
      } else if (reason === DisconnectReason.loggedOut) {
        console.log("❌ Sesión cerrada - Vincula de nuevo");
        fs.rmSync(SESSION_PATH, { recursive: true, force: true });
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("🔄 Reiniciando...");
        startBot();
        return;
      } else if (reason === DisconnectReason.timedOut) {
        console.log("⏱️ Tiempo agotado");
      } else {
        console.log(`❌ Error desconocido: ${reason}`);
      }

      setTimeout(() => startBot(), 3000);
    }

    if (connection === "open") {
      console.log("\n╔═══════════════════════════════════╗");
      console.log("║  ✅ THORFINN BOT CONECTADO ✅    ║");
      console.log("╚═══════════════════════════════════╝");
      console.log("\n🎯 Bot listo para recibir comandos");
      console.log(`⌚ Hora: ${new Date().toLocaleTimeString()}`);
      console.log("📱 Sesión guardada\n");
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
        console.error("Error en mensaje:", e.message);
      }
    }
  });
}

startBot().catch(console.error);
