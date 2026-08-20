import type { Metadata } from "next";
import { DemoEventExperience } from "./DemoEventExperience";

export function generateMetadata(): Metadata {
  return {
    title: "Demo etkinlik | BULUŞ",
    description: "Organizatör panelinden oluşturulan yerel demo etkinlik.",
    openGraph: { title: "Demo etkinlik | BULUŞ", description: "Organizatör panelinden oluşturulan yerel demo etkinlik.", images: [] },
    twitter: { title: "Demo etkinlik | BULUŞ", description: "Organizatör panelinden oluşturulan yerel demo etkinlik.", images: [] },
  };
}

export default async function DemoEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DemoEventExperience slug={slug} />;
}
