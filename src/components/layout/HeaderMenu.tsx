"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { buttonStyles } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

interface HeaderMenuProps {
  /** Isi menu (tautan navigasi dan tombol akun), dirender di server oleh SiteHeader. */
  children: ReactNode;
}

/**
 * Menu navigasi yang dilipat menjadi tombol "Menu" di layar sempit (di bawah 768 px)
 * dan tampil biasa di layar lebar. Polanya: tombol dengan aria-expanded + aria-controls.
 */
export function HeaderMenu({ children }: HeaderMenuProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Escape menutup menu dan mengembalikan fokus ke tombol Menu.
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Menekan tautan di dalam menu menutup menu (halaman baru akan dimuat).
  function handlePanelClick(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("a")) setOpen(false);
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="menu-utama"
        onClick={() => setOpen((value) => !value)}
        className={buttonStyles({
          variant: "secondary",
          size: "sm",
          className: "md:hidden",
        })}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
        Menu
      </button>

      <div
        id="menu-utama"
        onClick={handlePanelClick}
        className={cn(
          open ? "flex" : "hidden",
          "order-3 w-full flex-col gap-3 border-t border-line pt-3 md:contents",
        )}
      >
        {children}
      </div>
    </>
  );
}