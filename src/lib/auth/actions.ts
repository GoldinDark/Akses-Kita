"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  safeNextPath,
  validateDisplayName,
  validateEmail,
  validatePassword,
} from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/server";

export interface AuthFormState {
  /** Pesan umum untuk seluruh form. */
  error: string | null;
  /** Pesan informasi (bukan galat). */
  notice?: string | null;
  /** Pesan per kolom. */
  fieldErrors?: Partial<Record<"email" | "password" | "displayName", string>>;
  /** Nilai yang dikembalikan ke form (password TIDAK pernah dikembalikan). */
  values?: { email: string; displayName: string };
}

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

/** Mengubah galat Supabase menjadi pesan Indonesia yang aman dan tidak membocorkan detail. */
function messageForAuthError(
  error: { code?: string; message: string },
  mode: "signIn" | "signUp",
): string {
  switch (error.code) {
    case "invalid_credentials":
      return "Email atau password salah.";
    case "email_not_confirmed":
      return "Email Anda belum dikonfirmasi. Periksa kotak masuk email Anda.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "Terlalu banyak percobaan. Tunggu beberapa saat lalu coba lagi.";
    case "user_already_exists":
    case "email_exists":
      return "Pendaftaran tidak dapat diproses. Jika Anda sudah punya akun, silakan masuk.";
    case "weak_password":
      return "Password terlalu lemah. Gunakan minimal 8 karakter dan hindari yang mudah ditebak.";
    case "signup_disabled":
      return "Pendaftaran akun baru sedang dinonaktifkan.";
    default:
      // Hanya kode yang dicatat di terminal server; tidak pernah password.
      console.error(`[auth:${mode}] galat tak terduga, kode:`, error.code);
      return mode === "signIn"
        ? "Tidak dapat masuk saat ini. Coba lagi beberapa saat."
        : "Pendaftaran gagal. Coba lagi beberapa saat.";
  }
}

export async function signIn(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = readText(formData, "email").trim();
  const password = readText(formData, "password");
  const next = safeNextPath(readText(formData, "next"));
  const values = { email, displayName: "" };

  if (validateEmail(email) || !password) {
    return { error: "Isi email dan password Anda dengan benar.", values };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: messageForAuthError(error, "signIn"), values };
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signUp(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = readText(formData, "email").trim();
  const password = readText(formData, "password");
  const displayName = readText(formData, "displayName").trim();
  const next = safeNextPath(readText(formData, "next"));
  const values = { email, displayName };

  const fieldErrors: NonNullable<AuthFormState["fieldErrors"]> = {};
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  const nameError = validateDisplayName(displayName);
  if (emailError) fieldErrors.email = emailError;
  if (passwordError) fieldErrors.password = passwordError;
  if (nameError) fieldErrors.displayName = nameError;
  if (Object.keys(fieldErrors).length > 0) {
    return { error: null, fieldErrors, values };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: displayName ? { display_name: displayName } : {} },
  });
  if (error) {
    return { error: messageForAuthError(error, "signUp"), values };
  }

  // Jika konfirmasi email aktif, belum ada sesi: minta pengguna memeriksa email.
  if (!data.session) {
    return {
      error: null,
      notice: "Akun dibuat. Periksa email Anda untuk menyelesaikan konfirmasi.",
      values: { email, displayName },
    };
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}