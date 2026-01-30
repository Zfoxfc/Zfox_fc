export async function POST(req) {
  try {
    const { userId, referrerId, depositAmount } = await req.json();
    if (userId !== referrerId && Number(depositAmount) >= 20 && referrerId) {
       // logic to send data to SheetDB via fetch
       return Response.json({ success: true });
    }
    return Response.json({ success: false }, { status: 400 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
