const { Client, LocalAuth } = require('whatsapp-web.js');
const { loadCommands } = require('./lib/commandHandler');
const logger = require('./lib/logger');

// Prefijo con el que deben empezar los mensajes para ser tratados como comandos
const PREFIX = '!';

// Si querés vincular con QR en vez de código, poné esto en false
const USE_PAIRING_CODE = true;
// Tu número completo con código de país, sin +, sin espacios ni guiones. Ej: Argentina 54911xxxxxxxx
const PHONE_NUMBER = '54911XXXXXXXX';

const client = new Client({
  authStrategy: new LocalAuth(), // guarda la sesión para no repetir la vinculación cada vez
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

// Carga todos los comandos de la carpeta /commands
const commands = loadCommands();
logger.info(`Comandos cargados: ${[...commands.keys()].join(', ') || 'ninguno'}`);

if (USE_PAIRING_CODE) {
  // En vez de mostrar QR, pide un código de 8 dígitos para ingresar en el celular
  client.on('qr', async () => {
    if (client.pairingCodeRequested) return;
    client.pairingCodeRequested = true;
    const code = await client.requestPairingCode(PHONE_NUMBER);
    logger.info(`📱 Código de vinculación: ${code}`);
    logger.info('En tu celular: WhatsApp > Dispositivos vinculados > Vincular con número de teléfono, e ingresá ese código.');
  });
} else {
  const qrcode = require('qrcode-terminal');
  client.on('qr', (qr) => {
    logger.info('Escanea este código QR con WhatsApp:');
    qrcode.generate(qr, { small: true });
  });
}

client.on('ready', () => {
  logger.info('✅ Bot conectado y listo.');
});

client.on('disconnected', (reason) => {
  logger.warn(`Bot desconectado: ${reason}`);
});

client.on('message', async (msg) => {
  try {
    const body = msg.body?.trim();
    if (!body || !body.startsWith(PREFIX)) return;

    const args = body.slice(PREFIX.length).split(/\s+/);
    const commandName = args.shift().toLowerCase();

    const command = commands.get(commandName);
    if (!command) return; // comando no reconocido, se ignora

    logger.info(`Ejecutando comando "${commandName}" de ${msg.from}`);
    await command.execute(msg, args, client);
  } catch (err) {
    logger.error('Error procesando mensaje:', err);
    msg.reply('⚠️ Ocurrió un error ejecutando ese comando.').catch(() => {});
  }
});

client.initialize();