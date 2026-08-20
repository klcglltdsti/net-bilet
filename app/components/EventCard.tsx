"use client";

import { useState } from "react";
import type { EventRecord } from "../data/events";

export function EventCard({ event }: { event: EventRecord }) {
  const [favorite,setFavorite]=useState(false);
  return (
    <article className="event-card">
      <div className={`event-art ${event.art}`}>
        <span className="event-type">{event.category.toLocaleUpperCase("tr-TR")}</span>
        <button className={`heart ${favorite ? "liked" : ""}`} type="button" onClick={()=>setFavorite(value=>!value)} aria-label={`${event.title} ${favorite ? "favorilerden çıkar" : "favorilere ekle"}`}>{favorite ? "♥" : "♡"}</button>
        <strong>{event.mark.split("\n").map((line) => <span key={line}>{line}</span>)}</strong><i>{event.scoreLabel}</i>
      </div>
      <div className="event-info">
        <div className="date-box"><strong>{event.day}</strong><span>{event.month}</span></div>
        <div className="event-details"><h3>{event.title}</h3><p>{event.place} · {event.city}</p><span>{event.price} TL'den başlayan</span></div>
        <a href={event.demo ? `/demo-event/${event.slug}` : `/event/${event.slug}`} aria-label={`${event.title} detayları`}>↗</a>
      </div>
    </article>
  );
}
