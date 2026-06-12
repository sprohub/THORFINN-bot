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
  console.log("🤖 Iniciando Thorfinn Bot...");

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
      console.log("\n📱 Escanea el código QR:\n");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;

      if (reason === DisconnectReason.badSession) {
        console.log("❌ Sesión inválida");
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log("❌ Conexión cerrada");
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("❌ Conexión perdida");
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log("❌ Conexión reemplazada");
      } else if (reason === DisconnectReason.loggedOut) {
        console.log("❌ Sesión cerrada");
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("🔄 Reiniciando...");
        startBot();
      } else if (reason === DisconnectReason.timedOut) {
        console.log("⏱️ Tiempo agotado");
      }
      startBot();
    }

    if (connection === "open") {
      console.log("✅ Thorfinn Bot conectado correctamente");
      console.log("🎯 Bot listo para recibir comandos\n");
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
