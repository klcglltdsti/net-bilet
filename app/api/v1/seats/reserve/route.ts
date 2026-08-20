export async function POST(request: Request) {
  const input = await request.json().catch(() => ({})) as { seatIds?: string[]; userId?: string };
  if (!input.seatIds?.length) return Response.json({ success: false, error: { code: "TICKET_001", message: "En az bir koltuk seçmelisiniz." } }, { status: 400 });
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  return Response.json({ success: true, data: { reservationId: `RSV-${crypto.randomUUID()}`, seatIds: input.seatIds, status: "LOCKED", expiresAt }, message: "Koltuklar 15 dakika ayrıldı" });
}
