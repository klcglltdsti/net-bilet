export async function GET() {
  return Response.json({ success: true, data: { status: "operational", services: ["auth", "user", "event", "ticket", "payment", "social", "notification", "recommendation", "analytics"], timestamp: new Date().toISOString() }, message: "Tüm servisler çalışıyor" });
}
