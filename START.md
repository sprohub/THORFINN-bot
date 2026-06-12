# 🚀 INICIO RÁPIDO THORFINN BOT

## ⚡ 3 Pasos para empezar

### 1️⃣ Instalar dependencias
```bash
npm install
```

### 2️⃣ Crear archivo .env
```bash
echo "PREFIJO=." > .env
```

### 3️⃣ Ejecutar el bot
```bash
node index.js
```

---

## 📱 Conectar WhatsApp

El bot te mostrará un código (QR o numérico):
- WhatsApp → Configuración → Dispositivos vinculados
- Selecciona: Vincular un dispositivo
- Ingresa el código
- ¡Listo!

---

## 💬 Usar el bot

Una vez conectado, escribe en WhatsApp:

```
.help    - Ver todos los comandos
.ping    - Probar velocidad
.info    - Info del bot
.owner   - Contacto del creador
.menu    - Menú interactivo
.estado  - Estado del bot
```

---

## 🛠️ Cambiar prefijo

Edita `.env`:
```
PREFIJO=!
```

Luego usa: `!help` en lugar de `.help`

---

## ❌ Si falla

Borra la sesión y vuelve a ejecutar:
```bash
rm -rf session
node index.js
```

---

## 📍 Ubicación de archivos importantes

```
📁 THORFINN-bot/
├── 📄 index.js        ← Archivo principal
├── 📄 main.js         ← Lógica de comandos
├── 📄 package.json    ← Dependencias
├── 📄 .env            ← Configuración
├── 📁 session/        ← Sesión (se crea automáticamente)
└── 📄 README.md       ← Documentación completa
```

---

**¡Tu bot Thorfinn está listo para usar! 🗡️**
