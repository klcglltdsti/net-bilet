import type { Metadata } from "next";
import { findEvent } from "../../data/events";
import { EventExperience } from "./EventExperience";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = findEvent(slug);
  const title = `${event.title} | BULUŞ`;
  const description = `${event.city}, ${event.place} etkinliği. ${event.price} TL'den başlayan biletler ve güvenli koltuk seçimi.`;
  return { title, description, openGraph: { title, description, images: [] }, twitter: { title, description, images: [] } };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <EventExperience event={findEvent(slug)} />;
}
