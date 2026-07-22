import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "PA GEN KANPE", template: "%s · PA GEN KANPE" },
  description: "Votre file d'attente bancaire, sans rester debout.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0a4d8c" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}

