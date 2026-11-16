"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signUp, type AuthFormState } from "@/lib/auth/actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/auth/validation";

const INITIAL_STATE: AuthFormState = { error: null };

export function RegisterForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(signUp, INITIAL_STATE);

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-xl border border-line bg-surface p-6"
    >
      <input type="hidden" name="next" value={next} />

      {state.error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 p-3 font-medium text-red-900"
        >
          {state.error}
        </p>
      ) : null}
      {state.notice ? (
        <p
          role="status"
          className="rounded-lg border border-green-300 bg-green-50 p-3 font-medium text-green-900"
        >
          {state.notice}
        </p>
      ) : null}

      <Input
        id="register-name"
        name="displayName"
        type="text"
        label="Nama tampilan (opsional)"
        hint="Boleh dikosongkan. Nama ini bisa terlihat oleh pengguna lain di masa depan."
        autoComplete="nickname"
        maxLength={60}
        defaultValue={state.values?.displayName ?? ""}
        error={state.fieldErrors?.displayName}
      />
      <Input
        id="register-email"
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        required
        defaultValue={state.values?.email ?? ""}
        error={state.fieldErrors?.email}
      />
      <Input
        id="register-password"
        name="password"
        type="password"
        label="Password"
        hint={`Minimal ${PASSWORD_MIN_LENGTH} karakter.`}
        autoComplete="new-password"
        required
        error={state.fieldErrors?.password}
      />

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Memproses..." : "Daftar"}
      </Button>

      <p className="text-center text-sm text-muted">
        Sudah punya akun?{" "}
        <Link href="/masuk" className="font-semibold text-brand-800 underline">
          Masuk
        </Link>
      </p>
    </form>
  );
}