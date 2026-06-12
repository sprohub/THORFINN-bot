```
████████╗██╗  ██╗ ██████╗ ██████╗ ███████╗██╗███╗   ██╗███╗   ██╗
╚══██╔══╝██║  ██║██╔═══██╗██╔══██╗██╔════╝██║████╗  ██║████╗  ██║
   ██║   ███████║██║   ██║██████╔╝█████╗  ██║██╔██╗ ██║██╔██╗ ██║
   ██║   ██╔══██║██║   ██║██╔══██╗██╔══╝  ██║██║╚██╗██║██║╚██╗██║
   ██║   ██║  ██║╚██████╔╝██║  ██║██║     ██║██║ ╚████║██║ ╚████║
   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝  ╚═══╝
                     🗡️  THORFINN BOT  🗡️
```

---

<div align="center">

# ⚔️ THORFINN BOT - WhatsApp

*Un bot de WhatsApp tan implacable como un guerrero nórdico*

[![Node.js](https://img.shields.io/badge/Node.js-16+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Baileys](https://img.shields.io/badge/Baileys-Latest-blue?style=for-the-badge)](https://github.com/WhiskeySockets/Baileys)
[![License](https://img.shields.io/badge/License-MIT-red?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)]()

</div>

---

## 📖 Tabla de Contenidos

- [✨ Características](#características)
- [🎯 Frases de Inspiración](#frases-de-inspiración)
- [⚙️ Instalación](#instalación)
- [🚀 Uso](#uso)
- [📋 Comandos](#comandos)
- [🎨 Personalización](#personalización)
- [👤 Créditos](#créditos)
- [⚖️ Licencia](#licencia)

---

## ✨ Características

```
✅ Conexión automática a WhatsApp via Baileys
✅ Sistema modular de comandos
✅ Soporte para grupos y chats privados
✅ Mensajes formateados con emojis
✅ Sistema de prefijo personalizable
✅ Manejo inteligente de errores
✅ Autenticación segura con QR
✅ Cache de sesión para reconexión rápida
✅ Información en tiempo real
✅ Menú interactivo
```

---

## 🎯 Frases de Inspiración

> **"No importa cuántas veces caiga, siempre me levantaré."**  
> *- Thorfinn, Vinland Saga*

> **"El verdadero guerrero no busca la victoria, busca el crecimiento."**  
> *- Thorfinn*

> **"La venganza no resuelve nada. Solo consume tu alma."**  
> *- Thorfinn*

> **"Debo encontrar mi propio camino, no el que otros han trazado para mí."**  
> *- Thorfinn*

> **"La vida es una batalla constante, y tú eres quien decide cómo luchar."**  
> *- Thorfinn*

---

## ⚙️ Instalación

### Requisitos Previos
- **Node.js** v16 o superior
- **npm** o **yarn**
- **Git** (opcional)

### Paso 1: Clonar o descargar el proyecto

```bash
# Opción 1: Clonar el repositorio
git clone https://github.com/tu-usuario/thorfinn-bot.git
cd thorfinn-bot

# Opción 2: Descargar directamente
# Descarga los archivos y extrae en tu carpeta
```

### Paso 2: Instalar dependencias

```bash
npm install
```

O si usas yarn:

```bash
yarn install
```

### Paso 3: Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
PREFIJO=.
NODE_ENV=development
```

### Paso 4: Ejecutar el bot

```bash
node index.js
```

**¡Escanea el código QR con tu WhatsApp y el bot estará activo!**

---

## 🚀 Uso

### Comandos Básicos

Una vez que el bot está en línea, usa los siguientes comandos:

```
.help      → Ver todos los comandos disponibles
.ping      → Verificar la velocidad del bot
.info      → Información detallada del bot
.owner     → Datos de contacto del propietario
.menu      → Menú principal interactivo
```

### Ejemplo en WhatsApp

```
Usuario: .help
Bot: [Muestra lista completa de comandos]

Usuario: .ping
Bot: ⚡ Ping: 45ms
     ✅ Bot activo y respondiendo
```

---

## 📋 Comandos

### 📌 .help
Muestra la lista completa de todos los comandos disponibles con sus descripciones.

```
╔═══════════════════════════════════╗
║       🗡️  THORFINN BOT  🗡️         ║
╚═══════════════════════════════════╝

📋 COMANDOS DISPONIBLES:

.help - Muestra este mensaje
.ping - Verifica que el bot esté activo
.info - Información del bot
.owner - Información del propietario
.menu - Menú principal

⏰ Estado: ✅ En línea
🤖 Bot: Thorfinn v1.0
```

### ⚡ .ping
Verifica la latencia y disponibilidad del bot en tiempo real.

```
⚡ Ping: 45ms
✅ Bot activo y respondiendo
```

### ℹ️ .info
Muestra información detallada sobre el bot, versión y características.

### 👤 .owner
Información de contacto del propietario y desarrollador.

### 🎮 .menu
Menú interactivo con todas las opciones disponibles en formato amigable.

---

## 🎨 Personalización

### Cambiar el Prefijo

Edita el archivo `.env`:

```env
PREFIJO=!
```

Ahora usarás `!help` en lugar de `.help`

### Agregar Nuevos Comandos

Abre `main.js` y añade tu comando en el objeto `commands`:

```javascript
miComando: {
  desc: "Descripción de mi comando",
  run: async (sock, msg, args, jid, sender) => {
    const respuesta = `¡Hola! Este es mi comando personalizado`;
    await sock.sendMessage(jid, { text: respuesta }, { quoted: msg });
  }
}
```

### Personalizar Mensajes

Modifica los textos en `main.js` para ajustarlos a tu estilo:

```javascript
const helpText = `
Aquí va tu mensaje personalizado...
`;
```

---

## 📂 Estructura del Proyecto

```
thorfinn-bot/
├── index.js              # Archivo principal (conexión)
├── main.js               # Lógica de comandos
├── .env                  # Variables de entorno
├── .env.example          # Ejemplo de variables
├── package.json          # Dependencias del proyecto
├── session/              # Carpeta de sesión (se crea automáticamente)
├── README.md             # Este archivo
└── .gitignore            # Archivos a ignorar
```

---

## 🛠️ Dependencias

```json
{
  "@whiskeysockets/baileys": "^6.5.0",
  "@hapi/boom": "^10.0.1",
  "node-cache": "^5.1.2",
  "qrcode-terminal": "^0.12.0",
  "dotenv": "^16.3.1"
}
```

---

## 🔐 Seguridad

⚠️ **Importante:**

- Nunca compartas tu archivo `.env` o credenciales
- Añade `node_modules/` y `session/` a `.gitignore`
- Usa variables de entorno para información sensible
- No expongas el bot en repositorios públicos sin privacidad

---

## 🐛 Solución de Problemas

### El bot no se conecta
```bash
# Borra la carpeta de sesión y vuelve a escanear el QR
rm -rf session
node index.js
```

### Error de dependencias
```bash
# Reinstala todas las dependencias
rm -rf node_modules package-lock.json
npm install
```

### El código QR no aparece
```bash
# Asegúrate de tener terminal compatible
# En Windows usa PowerShell o Git Bash
# En Linux/Mac usa terminal normal
```

---

## 📊 Estadísticas

```
✨ Comandos implementados: 5+
⚡ Tiempo de respuesta: < 100ms
📦 Tamaño del proyecto: ~50MB (con node_modules)
🔄 Actualización: Activa
👥 Comunidad: En crecimiento
```

---

## 🚀 Mejoras Futuras

- [ ] Sistema de base de datos para persistencia
- [ ] Más comandos útiles
- [ ] Soporte para plugins externos
- [ ] Dashboard web para monitoreo
- [ ] Comandos de administración
- [ ] Sistema de permisos avanzado
- [ ] Integración con APIs externas
- [ ] Sistema de logs detallados

---

## 👤 Créditos

```
╔═══════════════════════════════════════════════════════════╗
║                     CRÉDITOS Y DERECHOS                   ║
╚═══════════════════════════════════════════════════════════╝

🏆 DESARROLLADOR PRINCIPAL:
   Nombre: Samu
   WhatsApp: +573225396540
   País: 🇨🇴 Colombia
   Estado: Disponible para soporte

📱 CONTACTO:
   WhatsApp: +573225396540
   Telegram: @samupro
   Email: contacto@example.com

🎨 PROYECTO:
   Nombre: THORFINN BOT
   Inspiración: Vinland Saga
   Tipo: Bot de WhatsApp Gratuito
   Licencia: MIT

💼 CRÉDITOS ESPECIALES:
   → SproHub - Inspiración y recursos
   → Baileys Library - Conexión WhatsApp
   → Comunidad Node.js - Herramientas
   → Vinland Saga - Temática y filosofía

⚖️  DERECHOS DE AUTOR:
   © 2024 Samu - SproHub
   © 2024 THORFINN PROJECT
   
   Todos los derechos reservados.
   El código está disponible bajo licencia MIT.
   Úsalo libremente respetando los créditos.

═══════════════════════════════════════════════════════════
Desarrollado con ❤️ en Colombia
═══════════════════════════════════════════════════════════
```

---

## ⚖️ Licencia

Este proyecto está bajo la licencia **MIT**. Puedes usar, modificar y distribuir el código libremente, siempre que mantengas los créditos originales.

```
MIT License

Copyright (c) 2024 Samu - SproHub - Colombia

Se concede permiso, de forma gratuita, a cualquier persona que obtenga
una copia de este software y archivos de documentación asociados 
(el "Software"), para tratar con el Software sin restricción, 
incluyendo sin limitación los derechos de usar, copiar, modificar, 
fusionar, publicar, distribuir, sublicenciar y/o vender copias del Software.

EL SOFTWARE SE PROPORCIONA "TAL CUAL", SIN GARANTÍA DE NINGÚN TIPO...
```

---

## 📞 Soporte y Contacto

¿Problemas? ¿Sugerencias? ¿Quieres mejorar el bot?

**Contacta con Samu:**
- 📱 WhatsApp: **+573225396540**
- 🌐 País: **Colombia**
- 🏢 Empresa: **SproHub**

---

## 🎭 Filosofía del Proyecto

> **"Como Thorfinn en Vinland Saga, este bot busca encontrar su propósito.**  
> **No es solo código, es un viaje constante de mejora y aprendizaje."**

El objetivo de **THORFINN BOT** es ser:

- **Implacable** en su funcionalidad
- **Valiente** al enfrentar errores
- **Dedicado** al servicio del usuario
- **En búsqueda constante** de la perfección

---

<div align="center">

### 🔥 ¡Gracias por usar THORFINN BOT! 🔥

**Desarrollado con pasión en Colombia 🇨🇴**

**Mantén el código, cambia el mundo.**

```
"La verdadera victoria no es vencer al enemigo,
sino encontrar la paz en tu interior."
                                    - Thorfinn
```

⭐ Si te gusta este proyecto, dale una estrella en GitHub ⭐

---

**Versión:** 1.0.0  
**Última actualización:** 2024  
**Estado:** ✅ Activo y en desarrollo

©️ 2024 Samu - SproHub - THORFINN BOT

</div>
```
