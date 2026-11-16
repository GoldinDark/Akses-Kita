// Uji keamanan sederhana: pengunjung (kunci publik) boleh MEMBACA, tidak boleh MENULIS.
// Jalankan:  node --env-file=.env.local scripts/check-rls.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error(
    "Env belum terbaca. Jalankan: node --env-file=.env.local scripts/check-rls.mjs",
  );
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ID nol tidak ada di database, jadi percobaan ubah/hapus tidak mengenai data apa pun.
const ZERO_ID = "00000000-0000-0000-0000-000000000000";
let failed = false;

function report(name, ok, detail) {
  console.log(`${ok ? "LOLOS" : "GAGAL"}  ${name}${detail ? " - " + detail : ""}`);
  if (!ok) failed = true;
}

// Penolakan yang benar memakai kode 42501 (permission denied / melanggar RLS).
async function expectDenied(name, request) {
  const { error, status } = await request;
  if (error && error.code === "42501") {
    report(name, true, "ditolak: " + error.message);
  } else if (error) {
    report(name, false, `error lain (${error.code}): ${error.message}`);
  } else {
    report(name, false, `TIDAK ditolak (status ${status}), ini berbahaya!`);
  }
}

// 1. Membaca harus berhasil.
const read = await supabase
  .from("places")
  .select("id")
  .eq("status", "published");
report(
  "Baca tempat yang dipublikasikan",
  !read.error && read.data.length > 0,
  read.error ? read.error.message : `${read.data.length} tempat`,
);

// 2. Menulis harus ditolak.
await expectDenied(
  "Tambah tempat",
  supabase.from("places").insert({
    slug: "tes-rls-hapus-saya",
    name: "Tes RLS",
    category: "park",
    area: "Tes",
    latitude: 0,
    longitude: 0,
  }),
);
await expectDenied(
  "Ubah tempat",
  supabase.from("places").update({ name: "x" }).eq("id", ZERO_ID),
);
await expectDenied(
  "Hapus tempat",
  supabase.from("places").delete().eq("id", ZERO_ID),
);
await expectDenied(
  "Tambah observasi",
  supabase.from("observations").insert({
    place_id: ZERO_ID,
    attribute_code: "ramp",
    status: "available",
    observed_on: "2026-01-01",
    source_type: "community_report",
  }),
);
await expectDenied(
  "Ubah observasi",
  supabase.from("observations").update({ status: "unknown" }).eq("id", ZERO_ID),
);
await expectDenied(
  "Hapus observasi",
  supabase.from("observations").delete().eq("id", ZERO_ID),
);
await expectDenied(
  "Tambah atribut",
  supabase
    .from("accessibility_attributes")
    .insert({ code: "tes", label: "Tes" }),
);

console.log(failed ? "\nADA UJI YANG GAGAL." : "\nSEMUA UJI LOLOS.");
process.exit(failed ? 1 : 0);