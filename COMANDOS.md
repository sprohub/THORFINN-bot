# 📋 DOCUMENTACIÓN DE COMANDOS

## Comandos disponibles

### 1️⃣ `.help`
Muestra la lista completa de comandos disponibles.

**Uso:**
```
.help
```

**Respuesta:**
```
🗡️  THORFINN BOT  🗡️

📋 COMANDOS DISPONIBLES:

.help - Muestra este mensaje
.ping - Verifica que el bot esté activo
.info - Información del bot
.owner - Información del propietario
.menu - Menú principal
.estado - Estado del bot

⏰ Estado: ✅ En línea
🤖 Bot: Thorfinn v1.0
```

---

### 2️⃣ `.ping`
Verifica la latencia y disponibilidad del bot.

**Uso:**
```
.ping
```

**Respuesta:**
```
⚡ Ping: 45ms
✅ Bot activo y respondiendo
```

---

### 3️⃣ `.info`
Información detallada sobre el bot, versión y características.

**Uso:**
```
.info
```

**Respuesta:**
```
ℹ️  INFORMACIÓN

📌 Bot: Thorfinn
🔢 Versión: 1.0.0
⚙️ Desarrollado con: Baileys
🌐 Plataforma: WhatsApp
📅 Última actualización: 2024

✨ Características:
• Responder comandos
• Información en tiempo real
• Sistema de prefijo personalizable
• Soporte para grupos y privados

.help para más comandos
```

---

### 4️⃣ `.owner`
Información de contacto del propietario y desarrollador.

**Uso:**
```
.owner
```

**Respuesta:**
```
👤 PROPIETARIO

Nombre: Samu
WhatsApp: +573225396540
País: 🇨🇴 Colombia
Empresa: SproHub
Estado: Disponible

Para contactar, envía un mensaje privado.
```

---

### 5️⃣ `.menu`
Menú interactivo con todas las opciones disponibles.

**Uso:**
```
.menu
```

**Respuesta:**
```
🎮 MENÚ PRINCIPAL 🎮

👋 ¡Hola, [Tu nombre]!

Selecciona una opción:

1️⃣ .help - Ver todos los comandos
2️⃣ .ping - Probar velocidad del bot
3️⃣ .info - Información del bot
4️⃣ .owner - Datos del propietario
5️⃣ .estado - Estado general

⏱️ Responde con un número
```

---

### 6️⃣ `.estado`
Muestra el estado general del bot y su disponibilidad.

**Uso:**
```
.estado
```

**Respuesta:**
```
📊 ESTADO DEL BOT

🟢 Estado: En línea
⚡ Velocidad: Óptima
📱 Conexión: Estable
🛡️ Seguridad: Activa
💾 Cache: Activo
🕐 Uptime: 3600s

Comandos disponibles: 6
Versión: 1.0.0

Todo funciona correctamente ✅
```

---

## 🎯 Comandos por categoría

### 📌 Información
- `.help` - Lista de comandos
- `.info` - Info del bot
- `.owner` - Contacto

### 🎮 Interactivos
- `.menu` - Menú principal
- `.ping` - Velocidad
- `.estado` - Estado general

---

## ⚙️ Cambiar el prefijo

Por defecto el prefijo es `.`

Para cambiar a otro, edita `.env`:

```env
PREFIJO=!
```

Luego usa: `!help` en lugar de `.help`

---

## 🔄 Patrón de respuesta

Todos los comandos siguen este patrón:

```
┌─────────────────────────┐
│    [Título del comando] │
└─────────────────────────┘

[Contenido con información]
[Emojis decorativos]
[Instrucciones si es necesario]
```

---

## 💡 Tips útiles

1. **En grupos**: El bot responde en todos los grupos
2. **En privado**: El bot responde solo a ti
3. **Comandos inválidos**: Muestra un error y sugiere `.help`
4. **Sin espacios**: `.help` NO funciona, debe ser `.help`
5. **Case insensitive**: `.HELP` y `.help` funcionan igual

---

## 🚀 Próximos comandos (planeados)

Los siguientes comandos serán agregados:
- `.stats` - Estadísticas de uso
- `.perfil` - Tu perfil en el bot
- `.grupos` - Grupos del bot
- `.permisos` - Sistema de permisos

---

**Última actualización:** 2024
**Versión:** 1.0.0
**Soporte:** +573225396540
