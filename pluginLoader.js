import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { config } from "./config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PLUGINS_DIR = path.resolve(__dirname, config.pluginsFolder);

/**
 * Lee todos los archivos .js dentro de /plugins y los carga en un Map,
 * indexados por cada alias declarado en `command`.
 *
 * Cada plugin debe exportar por default un objeto:
 * {
 *   command: ["nombre", "alias"],
 *   description: "...",
 *   category: "info" | "grupo" | "economia" | ...,
 *   ownerOnly, adminOnly, groupOnly: boolean (opcionales),
 *   execute(sock, msg, args, context) { ... }
 * }
 *
 * Para agregar un plugin nuevo solo hace falta crear el archivo en /plugins,
 * no hay que tocar este loader ni index.js.
 */
export async function loadPlugins() {
  const commands = new Map();
  const pluginList = [];

  if (!fs.existsSync(PLUGINS_DIR)) return { commands, pluginList };

  const files = fs.readdirSync(PLUGINS_DIR).filter((f) => f.endsWith(".js"));

  for (const file of files) {
    const filePath = path.join(PLUGINS_DIR, file);
    try {
      const fileUrl = pathToFileURL(filePath).href + `?update=${Date.now()}`;
      const mod = await import(fileUrl);
      const plugin = mod.default;

      if (!plugin?.command || typeof plugin.execute !== "function") {
        console.warn(`⚠️  El plugin "${file}" no tiene el formato correcto, se omite.`);
        continue;
      }

      const aliases = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
      for (const alias of aliases) {
        commands.set(alias.toLowerCase(), plugin);
      }
      pluginList.push(plugin);
    } catch (err) {
      console.error(`❌ Error cargando el plugin "${file}":`, err);
    }
  }

  return { commands, pluginList };
}