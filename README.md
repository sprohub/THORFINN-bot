# Base de Bot de WhatsApp

Base lista para vincular un bot de WhatsApp (vía código QR) con sistema de
comandos dinámico y carpeta de librerías.

## Estructura

```
whatsapp-bot/
├── index.js              # Conexión a WhatsApp y despachador de mensajes
├── package.json
├── commands/              # 👉 acá van los comandos nuevos
│   ├── ping.js
│   └── help.js
└── lib/                    # 👉 acá van las librerías/utilidades
    ├── commandHandler.js   # Carga automática de comandos
    └── logger.js
```

## Instalación

```bash
npm install
npm start
```

Al ejecutar `npm start` va a aparecer un código QR en la terminal.
Escanealo desde WhatsApp > Dispositivos vinculados > Vincular dispositivo.
La sesión queda guardada localmente, así que no hace falta escanear cada vez.

## Cómo agregar un comando nuevo

Creá un archivo en `commands/`, por ejemplo `commands/saludo.js`:

```js
module.exports = {
  name: 'saludo',
  description: 'Saluda al usuario',
  async execute(msg, args, client) {
    await msg.reply('¡Hola! 👋');
  },
};
```

No hace falta tocar `index.js` ni ningún otro archivo: el bot detecta y
carga automáticamente todos los archivos `.js` dentro de `commands/` al
iniciar. El comando queda disponible como `!saludo`.

### Parámetros que recibe `execute`
- `msg`: el mensaje recibido (objeto de whatsapp-web.js), permite hacer `msg.reply(...)`, ver `msg.from`, etc.
- `args`: array con las palabras que siguen al comando. Ej: `!saludo Juan` → `args = ['Juan']`
- `client`: la instancia del cliente de WhatsApp, por si necesitás enviar mensajes a otros chats, etc.

## Cómo agregar una librería nueva

Poné el archivo en `lib/` (por ejemplo `lib/db.js`) y luego importalo donde
lo necesites:

```js
const db = require('../lib/db');
```

## Cambiar el prefijo de comandos

En `index.js` cambiá la constante `PREFIX` (por defecto es `!`).

## Notas

- Usa la librería [`whatsapp-web.js`](https://wwebjs.dev/), que simula
  WhatsApp Web con Puppeteer (Chromium). Es gratis pero no oficial;
  para producción seria/alto volumen conviene evaluar la API oficial de
  WhatsApp Business.
- Requiere Node.js 18+.