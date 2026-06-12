# 📱 GUÍA DE INSTALACIÓN TERMUX

## 🔧 Instalación Rápida en Termux

### Paso 1: Actualizar Termux
```bash
pkg update && pkg upgrade
```

### Paso 2: Instalar Node.js
```bash
pkg install nodejs
```

Verifica:
```bash
node --version
npm --version
```

### Paso 3: Clonar el repositorio
```bash
cd $HOME
git clone https://github.com/sprohub/THORFINN-bot.git
cd THORFINN-bot
```

### Paso 4: Instalar dependencias
```bash
npm install
```

### Paso 5: Crear archivo .env
```bash
echo "PREFIJO=." > .env
```

### Paso 6: Ejecutar el bot
```bash
node index.js
```

---

## 📋 Alternativa: Sin clonar (Descarga Manual)

Si no tienes git, descarga los archivos manualmente y copia estos en una carpeta:

- `index.js`
- `main.js`
- `package.json`
- `.env`

Luego en esa carpeta ejecuta:
```bash
npm install
node index.js
```

---

## 🚀 Mantener el bot activo con PM2

### Instalar PM2
```bash
npm install -g pm2
```

### Iniciar bot con PM2
```bash
pm2 start index.js --name "thorfinn"
```

### Comandos útiles
```bash
pm2 status              # Ver estado
pm2 logs thorfinn       # Ver logs en vivo
pm2 stop thorfinn       # Detener
pm2 restart thorfinn    # Reiniciar
pm2 delete thorfinn     # Eliminar
```

---

## 📱 Conectar a WhatsApp

### Opción 1: Código QR
- El bot mostrará un código QR
- Abre WhatsApp en tu teléfono
- Ve a Configuración > Dispositivos vinculados
- Escanea el código

### Opción 2: Código Numérico (Recomendado)
- El bot mostrará un código de 6 dígitos
- Ve a WhatsApp > Configuración > Dispositivos vinculados
- Toca "Vincular un dispositivo"
- Ingresa el código

---

## ⚠️ Problemas comunes

**Error: "node: not found"**
```bash
pkg install nodejs
```

**Error: "npm install falla"**
```bash
npm cache clean --force
npm install
```

**El bot se cierra**
```bash
# Usa screen
pkg install screen
screen -S thorfinn
node index.js

# Para volver: screen -r thorfinn
```

**Limpiar sesión vieja**
```bash
rm -rf session
node index.js
```

---

## 📞 Soporte

WhatsApp: +573225396540
País: Colombia
Desarrollador: Samu - SproHub
