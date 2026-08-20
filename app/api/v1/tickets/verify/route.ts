export async function POST(request: Request) {
  const input = await request.json().catch(() => ({})) as { qrToken?: string };
  if (!input.qrToken) return Response.json({ success: false, error: { code: "QR_REQUIRED", message: "QR token gerekli." } }, { status: 400 });
  const used = input.qrToken.toLocaleUpperCase("tr-TR").includes("USED");
  if (used) return Response.json({ success: true, data: { valid: false, reason: "ALREADY_USED" }, message: "Bilet daha önce kullanılmış" });
  return Response.json({ success: true, data: { valid: true, ticket: { holder: "Ahmet Yılmaz", event: "Mesut Süre ile İlişki Testi", seat: "B5", status: "ACTIVE" } }, message: "Bilet doğrulandı" });
}
