// Uji keamanan akun: dua pengguna uji tidak boleh saling melihat atau mengubah profil,
// dan tidak ada yang boleh menaikkan perannya sendiri.
// Jalankan:  node --env-file=.env.local scripts/check-auth-rls.mjs
// Prasyarat: "Confirm email" dimatikan di dashboard (Authentication > Email).
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error(
    "Env belum terbaca. Jalankan: node --env-file=.env.local scripts/check-auth-rls.mjs",
  );
  process.exit(1);
}

// Jika Supabase menolak domain ini, isi RLS_TEST_EMAIL_DOMAIN dengan domain lain yang valid.
const domain = process.env.RLS_TEST_EMAIL_DOMAIN ?? "example.com";
const stamp = Date.now();
// Password acak sekali pakai; tidak pernah dicetak.
const password = `Uji-${randomUUID()}`;
let failed = false;

function report(name, ok, detail) {
  console.log(`${ok ? "LOLOS" : "GAGAL"}  ${name}${detail ? " - " + detail : ""}`);
  if (!ok) failed = true;
}

function newClient() {
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function register(label, extraMetadata = {}) {
  const client = newClient();
  const email = `tes-rls-${label}-${stamp}@${domain}`;
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: `Penguji ${label.toUpperCase()}`, ...extraMetadata },
    },
  });
  if (error) {
    console.error(`Gagal mendaftar akun ${label}: [${error.code}] ${error.message}`);
    process.exit(1);
  }
  if (!data.session) {
    console.error(
      "Tidak ada sesi login. Kemungkinan 'Confirm email' masih menyala; matikan dulu untuk uji ini.",
    );
    process.exit(1);
  }
  return { client, id: data.user.id };
}

// Akun A mencoba menyusupkan role=admin lewat data pendaftaran: harus diabaikan.
const a = await register("a", { role: "admin" });
const b = await register("b");

// ---- A hanya melihat profilnya sendiri ----
const readA = await a.client.from("profiles").select("id, display_name, role");
report(
  "A melihat tepat 1 profil (miliknya)",
  !readA.error && readA.data.length === 1 && readA.data[0].id === a.id,
  readA.error ? readA.error.message : `${readA.data.length} baris`,
);
report(
  "Peran A tetap 'user' (role=admin di data pendaftaran diabaikan)",
  readA.data?.[0]?.role === "user",
  `role = ${readA.data?.[0]?.role}`,
);

const readBFromA = await a.client.from("profiles").select("id").eq("id", b.id);
report(
  "A tidak bisa melihat profil B",
  !readBFromA.error && readBFromA.data.length === 0,
  readBFromA.error ? readBFromA.error.message : `${readBFromA.data.length} baris`,
);

// ---- A boleh mengubah nama sendiri ----
const renameOwn = await a.client
  .from("profiles")
  .update({ display_name: "Penguji A Baru" })
  .eq("id", a.id)
  .select("display_name");
report(
  "A bisa mengubah nama tampilannya sendiri",
  !renameOwn.error && renameOwn.data.length === 1,
  renameOwn.error ? renameOwn.error.message : "",
);

// ---- Hal yang harus ditolak ----
const promote = await a.client
  .from("profiles")
  .update({ role: "admin" })
  .eq("id", a.id)
  .select("role");
report(
  "A tidak bisa mengubah perannya sendiri jadi admin",
  promote.error?.code === "42501",
  promote.error ? promote.error.message : "TIDAK ditolak, ini berbahaya!",
);

const renameOther = await a.client
  .from("profiles")
  .update({ display_name: "Diretas" })
  .eq("id", b.id)
  .select("id");
report(
  "A tidak bisa mengubah profil B (0 baris terpengaruh)",
  !renameOther.error && renameOther.data.length === 0,
  renameOther.error ? renameOther.error.message : `${renameOther.data.length} baris`,
);

const insertFake = await a.client.from("profiles").insert({ id: randomUUID() });
report(
  "A tidak bisa menambah profil",
  insertFake.error?.code === "42501",
  insertFake.error ? insertFake.error.message : "TIDAK ditolak, ini berbahaya!",
);

const deleteOwn = await a.client.from("profiles").delete().eq("id", a.id);
report(
  "A tidak bisa menghapus profil",
  deleteOwn.error?.code === "42501",
  deleteOwn.error ? deleteOwn.error.message : "TIDAK ditolak, ini berbahaya!",
);

// ---- B melihat hanya dirinya ----
const readB = await b.client.from("profiles").select("id");
report(
  "B melihat tepat 1 profil (miliknya)",
  !readB.error && readB.data.length === 1 && readB.data[0].id === b.id,
  readB.error ? readB.error.message : `${readB.data.length} baris`,
);

// ---- Pengunjung tanpa login ----
const anonRead = await newClient().from("profiles").select("id");
report(
  "Pengunjung tanpa login tidak bisa membaca profil",
  anonRead.error?.code === "42501",
  anonRead.error ? anonRead.error.message : "TIDAK ditolak, ini berbahaya!",
);

console.log(failed ? "\nADA UJI YANG GAGAL." : "\nSEMUA UJI LOLOS.");
console.log(
  "Catatan: dua akun uji (tes-rls-a-... dan tes-rls-b-...) tetap ada. Hapus lewat Authentication > Users di dashboard.",
);
process.exit(failed ? 1 : 0);