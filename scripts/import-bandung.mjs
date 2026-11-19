// Mengunduh daftar tempat umum di Bandung dari OpenStreetMap lalu membuat skrip SQL impor.
//
// Jalankan:   node scripts/import-bandung.mjs
// Opsi:       --refresh            unduh ulang semua kelompok meski sudah tersimpan di data/bandung-osm/
//             --per-category=6     jumlah maksimum tempat per kategori (bawaan 6)
//             --input=berkas.json  pakai berkas JSON Overpass yang sudah ada (tanpa mengunduh)
//             --out=berkas.sql     lokasi keluaran (bawaan supabase/sql/005_seed_bandung.sql)
//
// Hasilnya HANYA nama, kategori, dan koordinat. Status akses TIDAK diisi (tetap "belum diketahui").
// Data: (c) OpenStreetMap contributors, lisensi ODbL. https://www.openstreetmap.org/copyright

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const CACHE_DIR = "data/bandung-osm";
const DEFAULT_OUT = "supabase/sql/005_seed_bandung.sql";

// Kotak koordinat Bandung dan sekitarnya (selatan, barat, utara, timur).
// Ini BUKAN batas administrasi resmi: beberapa tempat bisa berada di Cimahi atau Kabupaten Bandung.
const BBOX = { south: -6.97, west: 107.56, north: -6.85, east: 107.72 };
const BOX = `${BBOX.south},${BBOX.west},${BBOX.north},${BBOX.east}`;

// Daftar server bisa diganti lewat OVERPASS_ENDPOINTS (dipisah koma), mis. untuk pengujian.
const ENDPOINTS = (
  process.env.OVERPASS_ENDPOINTS ??
  "https://overpass-api.de/api/interpreter,https://overpass.private.coffee/api/interpreter,https://overpass.kumi.systems/api/interpreter"
)
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);
const REQUEST_TIMEOUT_MS = Number(process.env.OVERPASS_TIMEOUT_MS ?? 40_000);
const PAUSE_MS = Number(process.env.OVERPASS_PAUSE_MS ?? 1500);

// Satu permintaan kecil per kelompok agar ringan bagi server publik.
// Untuk kelompok yang padat, hanya yang paling dikenal (bertag wikidata) yang diminta.
const GROUPS = [
  {
    id: "public_service",
    label: "Layanan publik",
    body: `nwr["amenity"~"^(townhall|post_office|courthouse|community_centre)$"]["name"](${BOX});`,
  },
  {
    id: "education",
    label: "Pendidikan",
    body: `nwr["amenity"~"^(university|college|library)$"]["name"](${BOX}); nwr["amenity"="school"]["name"]["wikidata"](${BOX});`,
  },
  {
    id: "health",
    label: "Kesehatan",
    body: `nwr["amenity"="hospital"]["name"](${BOX}); nwr["amenity"="clinic"]["name"]["wikidata"](${BOX});`,
  },
  {
    id: "market",
    label: "Pasar",
    body: `nwr["amenity"="marketplace"]["name"](${BOX});`,
  },
  {
    id: "park",
    label: "Taman",
    body: `nwr["leisure"="park"]["name"](${BOX});`,
  },
  {
    id: "transport",
    label: "Transportasi",
    body: `nwr["railway"="station"]["name"](${BOX}); nwr["amenity"="bus_station"]["name"](${BOX});`,
  },
];

const CATEGORY_ORDER = [
  "public_service",
  "education",
  "health",
  "market",
  "park",
  "transport",
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseArgs(argv) {
  const args = { refresh: false, perCategory: 6, input: null, out: DEFAULT_OUT };
  for (const arg of argv) {
    if (arg === "--refresh") args.refresh = true;
    else if (arg.startsWith("--per-category=")) {
      const n = Number(arg.split("=")[1]);
      if (!Number.isInteger(n) || n < 1 || n > 50) {
        console.error("--per-category harus bilangan bulat 1-50.");
        process.exit(1);
      }
      args.perCategory = n;
    } else if (arg.startsWith("--input=")) args.input = arg.slice(8);
    else if (arg.startsWith("--out=")) args.out = arg.slice(6);
    else {
      console.error(`Opsi tidak dikenal: ${arg}`);
      process.exit(1);
    }
  }
  return args;
}

// Server yang sudah gagal dilewati sampai skrip selesai, agar tidak menunggu berulang-ulang.
const deadEndpoints = new Set();

async function fetchGroup(group) {
  const query = `[out:json][timeout:25];(${group.body});out center tags 150;`;
  for (const endpoint of ENDPOINTS) {
    if (deadEndpoints.has(endpoint)) continue;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "AksesKita-pilot/0.1 (proyek belajar; data aksesibilitas Bandung)",
        },
        body: new URLSearchParams({ data: query }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (!response.ok) {
        console.warn(`   ${endpoint} membalas status ${response.status}`);
        deadEndpoints.add(endpoint);
        continue;
      }
      const json = await response.json();
      // Overpass kadang membalas 200 tetapi isinya galat (mis. kehabisan waktu).
      if (!Array.isArray(json.elements) || /error|timed out|out of memory/i.test(json.remark ?? "")) {
        console.warn(`   ${endpoint} mengembalikan hasil tidak lengkap: ${json.remark ?? "format tak dikenal"}`);
        continue;
      }
      return json;
    } catch (error) {
      console.warn(`   ${endpoint}: ${error instanceof Error ? error.message : error}`);
      deadEndpoints.add(endpoint);
    }
  }
  return null;
}

/** Mengambil semua kelompok; hasil yang berhasil disimpan agar ulangan hanya melengkapi yang kurang. */
async function loadFromOverpass(refresh) {
  mkdirSync(CACHE_DIR, { recursive: true });
  const elements = [];
  const failed = [];
  let timestamp = null;

  for (const group of GROUPS) {
    const cachePath = `${CACHE_DIR}/${group.id}.json`;
    let json = null;
    if (!refresh && existsSync(cachePath)) {
      json = JSON.parse(readFileSync(cachePath, "utf8"));
      console.log(`[${group.label}] memakai data tersimpan (${json.elements.length} elemen)`);
    } else {
      console.log(`[${group.label}] mengunduh ...`);
      json = await fetchGroup(group);
      if (json) {
        writeFileSync(cachePath, JSON.stringify(json));
        console.log(`   berhasil: ${json.elements.length} elemen`);
      } else {
        failed.push(group.label);
      }
      await sleep(PAUSE_MS);
    }
    if (json) {
      elements.push(...json.elements);
      timestamp ??= json.osm3s?.timestamp_osm_base ?? null;
    }
  }

  if (failed.length > 0) {
    console.error(
      `\nBelum lengkap. Gagal diunduh: ${failed.join(", ")}.\n` +
        "Yang sudah berhasil tersimpan di data/bandung-osm/. Jalankan perintah yang sama lagi\n" +
        "dalam beberapa menit; hanya bagian yang kurang yang akan diunduh. Berkas SQL belum dibuat.",
    );
    process.exit(1);
  }
  return { elements, osm3s: { timestamp_osm_base: timestamp } };
}

function categoryOf(tags) {
  const amenity = tags.amenity;
  if (["townhall", "post_office", "courthouse", "community_centre"].includes(amenity)) return "public_service";
  if (["school", "university", "college", "library"].includes(amenity)) return "education";
  if (["hospital", "clinic"].includes(amenity)) return "health";
  if (amenity === "marketplace") return "market";
  if (tags.leisure === "park") return "park";
  if (tags.railway === "station" || amenity === "bus_station") return "transport";
  return null;
}

/** Membuang karakter kontrol dan merapikan spasi. */
function cleanText(value) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeName(name) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

/** Literal teks SQL yang aman: tanda kutip tunggal digandakan. */
function sqlText(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function pickCandidates(elements) {
  const candidates = [];
  const skipped = { noName: 0, noCoords: 0, outside: 0, notOpen: 0, noCategory: 0 };

  for (const element of elements) {
    const tags = element.tags ?? {};
    const category = categoryOf(tags);
    if (!category) { skipped.noCategory++; continue; }

    const name = cleanText(tags.name);
    if (name.length < 2 || name.length > 200) { skipped.noName++; continue; }
    if (["private", "no"].includes(tags.access)) { skipped.notOpen++; continue; }

    const lat = element.lat ?? element.center?.lat;
    const lon = element.lon ?? element.center?.lon;
    if (typeof lat !== "number" || typeof lon !== "number") { skipped.noCoords++; continue; }
    if (lat < BBOX.south || lat > BBOX.north || lon < BBOX.west || lon > BBOX.east) { skipped.outside++; continue; }
    if (!["node", "way", "relation"].includes(element.type) || !Number.isInteger(element.id)) { skipped.noCoords++; continue; }

    const area = cleanText(tags["addr:suburb"] || tags["addr:district"] || tags["addr:city"]) || "Bandung";
    candidates.push({
      slug: `osm-${element.type}-${element.id}`,
      name,
      category,
      area: area.slice(0, 100),
      lat: Number(lat.toFixed(6)),
      lon: Number(lon.toFixed(6)),
      // Tempat yang punya wikidata/wikipedia biasanya lebih dikenal dan lebih terawat datanya.
      notable: Boolean(tags.wikidata || tags.wikipedia),
    });
  }
  return { candidates, skipped };
}

function selectPlaces(candidates, perCategory) {
  const selected = [];
  for (const category of CATEGORY_ORDER) {
    const pool = candidates
      .filter((c) => c.category === category)
      .sort((a, b) => Number(b.notable) - Number(a.notable) || a.name.localeCompare(b.name, "id") || a.slug.localeCompare(b.slug));
    const seen = new Set();
    for (const candidate of pool) {
      const key = normalizeName(candidate.name);
      if (seen.has(key)) continue; // nama kembar (mis. banyak simpul untuk satu tempat)
      seen.add(key);
      selected.push(candidate);
      if (seen.size >= perCategory) break;
    }
  }
  return selected;
}

function buildSql(places, osmTimestamp) {
  const rows = places.map(
    (p) =>
      `  (${sqlText(p.slug)}, ${sqlText(p.name)}, ${sqlText(p.category)}, ${sqlText(p.area)}, ${p.lat}, ${p.lon}, false, 'published', now())`,
  );
  return `-- =====================================================================
-- AksesKita - Seed 005: tempat nyata di Bandung (dibuat otomatis)
-- Dibuat oleh scripts/import-bandung.mjs pada ${new Date().toISOString()}
-- Sumber: (c) OpenStreetMap contributors, lisensi ODbL
--         https://www.openstreetmap.org/copyright
-- Data OSM per: ${osmTimestamp ?? "tidak diketahui"}
--
-- Hanya nama, kategori, dan koordinat. TIDAK ada observasi aksesibilitas:
-- semua atribut akses tetap "belum diketahui" sampai ada observasi nyata.
-- Aman dijalankan ulang (tidak membuat duplikat).
-- =====================================================================

insert into public.places
  (slug, name, category, area, latitude, longitude, is_demo, status, published_at)
values
${rows.join(",\n")}
on conflict (slug) do nothing;
`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const data = args.input
    ? JSON.parse(readFileSync(args.input, "utf8"))
    : await loadFromOverpass(args.refresh);

  if (!Array.isArray(data.elements)) {
    console.error("Format data tidak dikenali (tidak ada 'elements').");
    process.exit(1);
  }

  const { candidates, skipped } = pickCandidates(data.elements);
  const selected = selectPlaces(candidates, args.perCategory);
  if (selected.length === 0) {
    console.error("Tidak ada tempat yang lolos seleksi. Berkas tidak dibuat.");
    process.exit(1);
  }

  mkdirSync(dirname(args.out), { recursive: true });
  writeFileSync(args.out, buildSql(selected, data.osm3s?.timestamp_osm_base));

  console.log(`\nElemen mentah: ${data.elements.length}, lolos syarat awal: ${candidates.length}`);
  console.log("Dilewati:", JSON.stringify(skipped));
  console.log(`Terpilih: ${selected.length} tempat\n`);
  for (const category of CATEGORY_ORDER) {
    const names = selected.filter((p) => p.category === category).map((p) => p.name);
    console.log(`[${category}] ${names.length}`);
    for (const name of names) console.log(`   - ${name}`);
  }
  console.log(`\nSkrip SQL ditulis ke ${args.out}`);
}

await main();