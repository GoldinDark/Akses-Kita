"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { StateMessage } from "@/components/ui/StateMessage";

interface MapErrorBoundaryState {
  hasError: boolean;
}

/**
 * Menangkap error saat peta dimuat atau dirender, supaya halaman dan
 * daftar tempat tetap berfungsi. Error boundary harus berupa class component.
 */
export class MapErrorBoundary extends Component<
  { children: ReactNode },
  MapErrorBoundaryState
> {
  state: MapErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): MapErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <StateMessage
          variant="error"
          title="Peta gagal dimuat"
          description="Daftar tempat di samping tetap lengkap dan bisa dipakai. Anda juga bisa mencoba memuat ulang halaman."
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Muat ulang halaman
          </Button>
        </StateMessage>
      );
    }
    return this.props.children;
  }
}