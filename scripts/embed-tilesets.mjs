#!/usr/bin/env node
/**
 * embed-tilesets.mjs
 *
 * Lee el JSON exportado por Tiled y embebe los tilesets externos (.tsx)
 * directamente en el JSON, para que Phaser pueda cargarlo sin problemas.
 *
 * Uso: npm run embed-map
 *
 * El script lee los .tsx automáticamente — no hay que hardcodear nada.
 * Si en el futuro se agregan más tilesets en Tiled, se embeben solos.
 *
 * Si el mismo .tsx aparece varias veces (ej. montañas), el segundo
 * recibe el sufijo "2", el tercero "3", etc.
 *
 * Al terminar, compara los tilesets embebidos con los registrados en
 * level1.ts y avisa si hay alguno nuevo que necesite registro manual.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname, basename, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, '..');

const levelId   = process.argv[2] ?? 'level1';
const MAP_PATH  = join(ROOT, `public/assets/tilemaps/levels/${levelId}.json`);
const LEVEL_TS  = join(ROOT, `src/levels/${levelId}.ts`);

// ─── XML helpers ────────────────────────────────────────────────────────────

/** Extrae el valor de un atributo de una cadena XML */
function attr(xml, name) {
  const m = xml.match(new RegExp(`\\b${name}="([^"]*)"`));
  return m ? m[1] : null;
}

/** Parsea un .tsx de Tiled y devuelve los campos necesarios para el JSON */
function parseTsx(tsxPath) {
  const xml = readFileSync(tsxPath, 'utf8');

  const columns    = parseInt(attr(xml, 'columns') ?? '0');
  const tilecount  = parseInt(attr(xml, 'tilecount') ?? '0');
  const tilewidth  = parseInt(attr(xml, 'tilewidth') ?? '16');
  const tileheight = parseInt(attr(xml, 'tileheight') ?? '16');
  const spacing    = parseInt(attr(xml, 'spacing') ?? '0');
  const margin     = parseInt(attr(xml, 'margin') ?? '0');
  const name       = attr(xml, 'name');

  // Atributos del elemento <image ...>
  const imgTag    = xml.match(/<image[^>]*>/)?.[0] ?? '';
  const imgSource = attr(imgTag, 'source') ?? '';
  const imgWidth  = parseInt(attr(imgTag, 'width') ?? '0');
  const imgHeight = parseInt(attr(imgTag, 'height') ?? '0');
  const trans     = attr(imgTag, 'trans'); // color transparente (sin #)

  return { name, columns, tilecount, tilewidth, tileheight,
           spacing, margin, imgSource, imgWidth, imgHeight, trans };
}

// ─── Leer tilesets registrados en level1.ts ──────────────────────────────────

/**
 * Extrae los nombres del array `tilesets: [...]` en level1.ts usando regex.
 * Devuelve un Set con los nombres (string).
 */
function readRegisteredTilesetNames() {
  if (!existsSync(LEVEL_TS)) return new Set();
  const src = readFileSync(LEVEL_TS, 'utf8');
  // Busca todas las ocurrencias de name: 'algo' o name: "algo"
  const names = new Set();
  const re = /\bname:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    names.add(m[1]);
  }
  return names;
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  if (!existsSync(MAP_PATH)) {
    process.stderr.write(`Error: no se encontró ${MAP_PATH}\n`);
    process.exit(1);
  }

  const map    = JSON.parse(readFileSync(MAP_PATH, 'utf8'));
  const mapDir = dirname(MAP_PATH);

  const nameSeen = {};     // nombre base → cantidad de veces visto
  const embeddedNames = []; // nombres únicos de todos los tilesets del mapa
  let changed = false;

  for (const ts of map.tilesets) {
    if (!ts.source) {
      // Ya embebido — registrar su nombre para la comparación final
      if (ts.name) embeddedNames.push(ts.name);
      continue;
    }

    // Resolver la ruta absoluta del .tsx (source es relativo al JSON)
    const tsxPath = resolve(mapDir, ts.source);

    if (!existsSync(tsxPath)) {
      process.stderr.write(`Advertencia: no se encontró ${tsxPath}\n`);
      continue;
    }

    let parsed;
    try {
      parsed = parseTsx(tsxPath);
    } catch (e) {
      process.stderr.write(`Error al leer ${tsxPath}: ${e.message}\n`);
      continue;
    }

    // Nombre base (del tsx) y nombre único (para duplicados)
    const baseName   = parsed.name ?? basename(ts.source, '.tsx');
    nameSeen[baseName] = (nameSeen[baseName] ?? 0) + 1;
    const uniqueName = nameSeen[baseName] === 1
      ? baseName
      : `${baseName}${nameSeen[baseName]}`;

    if (nameSeen[baseName] > 1) {
      process.stdout.write(
        `  ↳ duplicado "${baseName}" → renombrado a "${uniqueName}"\n`
      );
    }

    embeddedNames.push(uniqueName);

    // Ruta de la imagen en el JSON (relativa al JSON → ../tilesets/{archivo})
    const imgFile = basename(parsed.imgSource);
    const imgPath = `../tilesets/${imgFile}`;

    // Objeto embebido (mismo orden que exporta Tiled manualmente)
    const embedded = {
      columns:     parsed.columns,
      firstgid:    ts.firstgid,
      image:       imgPath,
      imageheight: parsed.imgHeight,
      imagewidth:  parsed.imgWidth,
      margin:      parsed.margin,
      name:        uniqueName,
      spacing:     parsed.spacing,
      tilecount:   parsed.tilecount,
      tileheight:  parsed.tileheight,
      tilewidth:   parsed.tilewidth,
    };

    if (parsed.trans) {
      embedded.transparentcolor = `#${parsed.trans}`;
    }

    // Reemplazar la entrada in-place para no perder el orden del array
    const keys = Object.keys(ts);
    for (const k of keys) delete ts[k];
    Object.assign(ts, embedded);

    process.stdout.write(
      `Embebido: ${basename(tsxPath)} → "${uniqueName}" (firstgid=${ts.firstgid})\n`
    );
    changed = true;
  }

  if (changed) {
    writeFileSync(MAP_PATH, JSON.stringify(map, null, 2), 'utf8');
    process.stdout.write(`\nActualizado: ${MAP_PATH}\n`);
  } else {
    process.stdout.write('El mapa ya tiene los tilesets embebidos. Nada que hacer.\n');
  }

  // ── Comparar con level1.ts ──────────────────────────────────────────────
  const registered = readRegisteredTilesetNames();
  const nuevos = embeddedNames.filter(n => !registered.has(n));

  process.stdout.write(`\nTilesets en el mapa (${embeddedNames.length}): ${embeddedNames.join(', ')}\n`);

  if (nuevos.length > 0) {
    process.stdout.write('\n⚠️  TILESETS NUEVOS detectados — necesitan registro manual:\n');
    for (const nombre of nuevos) {
      const keyName = 'TS_' + nombre.toUpperCase().replace(/[^A-Z0-9]/g, '_');
      const keyVal  = 'ts-' + nombre.toLowerCase().replace(/[^a-z0-9]/g, '-');
      process.stdout.write(`\n  Tileset: "${nombre}"\n`);
      process.stdout.write(`  1. constants.ts  → ASSETS: ${keyName}: '${keyVal}'\n`);
      process.stdout.write(`  2. PreloadScene  → preload(): this.load.image(ASSETS.${keyName}, 'assets/tilemaps/tilesets/${nombre}.png')\n`);
      process.stdout.write(`  3. ${levelId}.ts     → tilesets[]: { name: '${nombre}', key: ASSETS.${keyName} }\n`);
    }
    process.stdout.write('\n');
  } else {
    process.stdout.write(`✓  Todos los tilesets ya están registrados en ${levelId}.ts\n`);
  }
}

main();
