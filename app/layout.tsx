import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import "./product.css";
import "./product-extra.css";
import "./panel.css";
import "./demo.css";
import "./readability.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const title = "BULUŞ — Şehrinle buluş";
  const description = "Etkinlikleri keşfet, arkadaşlarınla buluş ve biletini güvenle al.";
  const image = new URL("/og.png", base).toString();
  return {
    metadataBase: base,
    title,
    description,
    openGraph: { title, description, type: "website", url: base, images: [{ url: image, width: 1733, height: 908, alt: "BULUŞ — Şehrinle buluş" }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr"><body>{children}</body></html>;
}
