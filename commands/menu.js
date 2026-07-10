import { loadPlugins } from "../pluginLoader.js";
import { config } from "../config.js";

// Emoji + nombre lindo para cada categoría. Si un plugin usa una categoría
// que no está acá, se muestra tal cual con un emoji genérico.
const tags = {
  main: "🌿 Principal",
  info: "ℹ️ Info",
  tools: "🛠️ Tools",
  grupo: "🐒 Grupos",
  owner: "👑 Owner",
  diversion: "🦜 Diversión",
  descargas: "📥 Descargas",
};

// Banner opcional por categoría. Dejalo vacío ("") si no querés imagen.
const bannerCategory = {
  main: "",
  info: "",
};

function emojiCategoria(cat) {
  return tags[cat] || `📂 ${cat}`;
}

function formatUptime() {
  const segundos = Math.floor(process.uptime());
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${m}m ${s}s`;
}

function buildBodyText({ totalCmd, uptime, userTag, tituloCategoria }) {
  const titulo = tituloCategoria ? tituloCategoria : "MENÚ PRINCIPAL";
  return (
    `╭─🌴・・・・・・・・・・・╮\n` +
    `│ 🐾 *${titulo}*\n` +
    `│ 👤 @${userTag}\n` +
    `│ 📦 ${totalCmd} comandos\n` +
    `│ ⏱️ ${uptime}\n` +
    `╰・・・・・・・・・・・🌴─╯`
  );
}

export default {
  // Alias: .menu, /menu, menu a secas (y variantes por categoría, ej: .menuinfo)
  command: [".menu", "/menu", "menu"],
  description: "Muestra el menú de comandos",
  category: "info",

  ownerOnly: false,
  adminOnly: false,
  groupOnly: false,

  async execute(sock, msg, args, context) {
    const jid = msg.key.remoteJid;
    const userTag = context.senderNumber;

    // Relee /plugins para que el menú siempre esté al día
    const { pluginList } = await loadPlugins();

    // Permite filtrar por categoría: ".menu info", "/menu tools", etc.
    const categoriaBuscada = args[0]?.toLowerCase();
    const categoriaValida = categoriaBuscada && Object.keys(tags).includes(categoriaBuscada)
      ? categoriaBuscada
      : null;

    // Agrupa comandos por categoría
    const porCategoria = {};
    for (const plugin of pluginList) {
      const cat = plugin.category || "otros";
      if (categoriaValida && cat !== categoriaValida) continue;
      if (!porCategoria[cat]) porCategoria[cat] = [];
      porCategoria[cat].push(plugin);
    }

    if (!Object.keys(porCategoria).length) {
      await sock.sendMessage(jid, {
        text:
          `╭─🌴・・・・・・・╮\n` +
          `│ 🐒 *Ups...*\n` +
          `│ 🍃 No se encontraron comandos${categoriaValida ? ` en "${categoriaValida}"` : ""}.\n` +
          `╰・・・・・・・🌴─╯`,
      });
      return;
    }

    const bodyText = buildBodyText({
      totalCmd: pluginList.length,
      uptime: formatUptime(),
      userTag,
      tituloCategoria: categoriaValida ? tags[categoriaValida] : null,
    });

    let listado = "";
    for (const [cat, plugins] of Object.entries(porCategoria)) {
      listado += `\n「 ${emojiCategoria(cat)} 」\n`;
      for (const plugin of plugins) {
        const aliases = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
        listado += `🍃 ${aliases.join(" / ")}\n   _${plugin.description || "sin descripción"}_\n`;
      }
    }

    const textoFinal = `${bodyText}\n${listado}`.trim();

    const bannerUrl = categoriaValida ? bannerCategory[categoriaValida] : bannerCategory.main;

    if (bannerUrl) {
      await sock.sendMessage(jid, { image: { url: bannerUrl }, caption: textoFinal });
    } else {
      await sock.sendMessage(jid, { text: textoFinal });
    }
  },
};