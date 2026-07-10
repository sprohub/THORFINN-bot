import fs from "fs";
import path from "path";
import url from "url";
import chalk from "chalk";
import { config } from "./config.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const pluginsPath = path.join(__dirname, "plugins");

/**
 * Recorre recursivamente una carpeta y devuelve la ruta absoluta
 * de todos los archivos .js que encuentre, sin importar cuántos
 * niveles de subcarpetas existan (plugins/categoria/archivo.js,
 * plugins/categoria/sub/archivo.js, etc).
 */
function listarArchivosJS(dir) {
  let resultado = [];

  const entradas = fs.readdirSync(dir, { withFileTypes: true });

  for (const entrada of entradas) {
    const rutaCompleta = path.join(dir, entrada.name);

    if (entrada.isDirectory()) {
      resultado = resultado.concat(listarArchivosJS(rutaCompleta));
    } else if (entrada.isFile() && entrada.name.endsWith(".js")) {
      resultado.push(rutaCompleta);
    }
  }

  return resultado;
}

/**
 * Carga todos los plugins de la carpeta /plugins de forma dinámica,
 * incluyendo los que estén organizados dentro de subcarpetas
 * (ej: plugins/economia/economia-daily.js, plugins/owner/owner-update.js).
 *
 * Cada plugin debe exportar por defecto un objeto:
 * {
 *   command: ["hola", "hi"],   // palabras clave que activan el plugin (sin prefijo)
 *   category: "Info",         // opcional, se usa para agrupar en consola/menú
 *   description: "texto",     // opcional, para el menú
 *   run: async (sock, msg, args, context) => { ... }
 * }
 */
export async function loadPlugins() {
  const plugins = [];
  const invalidos = [];
  const errores = [];

  if (!fs.existsSync(pluginsPath)) {
    fs.mkdirSync(pluginsPath, { recursive: true });
  }

  const archivos = listarArchivosJS(pluginsPath);
  const total = archivos.length;

  for (let i = 0; i < total; i++) {
    const rutaAbsoluta = archivos[i];
    const rutaRelativa = path.relative(pluginsPath, rutaAbsoluta);

    try {
      const pluginUrl = url.pathToFileURL(rutaAbsoluta).href;
      const module = await import(`${pluginUrl}?update=${Date.now()}`);
      const plugin = module.default;

      if (!plugin || !plugin.command || !plugin.run) {
        invalidos.push(rutaRelativa);
      } else {
        plugin.fileName = rutaRelativa;
        plugins.push(plugin);
      }
    } catch (err) {
      errores.push({ file: rutaRelativa, err });
    }

    const barraLargo = 20;
    const llenos = total ? Math.round(((i + 1) / total) * barraLargo) : barraLargo;
    const barra = "▓".repeat(llenos) + "░".repeat(barraLargo - llenos);

    process.stdout.write(
      `\r👊 Cargando plugins ${chalk.cyan(barra)} ${i + 1}/${total} `
    );
  }

  process.stdout.write("\n");

  const categorias = {};
  for (const p of plugins) {
    const cat = p.category || "Otros";
    categorias[cat] = (categorias[cat] || 0) + 1;
  }

  console.log(chalk.yellowBright(`\n╭─「 📦 *${config.botName}* 」`));
  console.log(chalk.green(`│ ✅ ${plugins.length} plugin(s) cargado(s) correctamente`));

  for (const [cat, cantidad] of Object.entries(categorias).sort()) {
    console.log(chalk.gray(`│    · ${cat}: ${cantidad}`));
  }

  if (invalidos.length > 0) {
    console.log(chalk.yellow(`│ ⚠️  ${invalidos.length} inválido(s): ${invalidos.join(", ")}`));
  }

  if (errores.length > 0) {
    console.log(chalk.red(`│ ❌ ${errores.length} con error al cargar:`));
    for (const { file, err } of errores) {
      console.log(chalk.red(`│    · ${file} → ${err.message || err}`));
    }
  }

  console.log(chalk.yellowBright(`╰────────────────────────\n`));

  return plugins;
}
