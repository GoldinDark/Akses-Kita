"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signIn, type AuthFormState } from "@/lib/auth/actions";

const INITIAL_STATE: AuthFormState = { error: null };

export function LoginForm({ next }: { next: string }) {
  // useActionState: menjalankan server action dan menyimpan hasilnya (pesan galat).
  const [state, formAction, pending] = useActionState(signIn, INITIAL_STATE);

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

      <Input
        id="login-email"
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        required
        defaultValue={state.values?.email ?? ""}
      />
      <Input
        id="login-password"
        name="password"
        type="password"
        label="Password"
        autoComplete="current-password"
        required
      />

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Memproses..." : "Masuk"}
      </Button>

      <p className="text-center text-sm text-muted">
        Belum punya akun?{" "}
        <Link href="/daftar" className="font-semibold text-brand-800 underline">
          Daftar
        </Link>
      </p>
    </form>
  );
}